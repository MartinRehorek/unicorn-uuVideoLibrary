'use strict';

const express = require('express');
const router = express.Router();
const { body, param, check } = require('express-validator');

const { validateRequest } = require('../middleware/validate-request');
const { checkJwt, videoOwner, isAdmin } = require('../middleware/authentication');
const { BadRequestError, NotFoundError } = require('../utils/errors');
const { youTubeGetID, validateYouTubeUrl } = require('../utils/helpers');
const { getPagination } = require('../utils/pagination');

const {
  getVideoInfo,
  createVideo,
  allVideos,
  userVideos,
  getVideo,
  updateVideo,
  deleteVideo,
} = require('../services/video-service');
const { currentUser } = require('../services/user-service');

/**
 * @swagger
 * /video:
 *  post:
 *    summary: Creates a new video
 *    description:
 *        ~ For logged in users <br />
 *        ~ For administrators
 *    tags:
 *      - Video
 *    security:
 *      - jwt: []
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required: [title, originalTitle, originURL, description, duration, defaultLanguage, dataType]
 *            properties:
 *              title:
 *                type: string
 *              originalTitle:
 *                type: string
 *              originURL:
 *                type: string
 *              thumbnail:
 *                type: object
 *                properties:
 *                  url:
 *                    type: string
 *                    nullable: true
 *                  width:
 *                    type: number
 *                    nullable: true
 *                  height:
 *                    type: number
 *                    nullable: true
 *              description:
 *                type: string
 *              channelTitle:
 *                type: string
 *                nullable: true
 *              duration:
 *                type: string
 *              defaultLanguage:
 *                type: string
 *              dataType:
 *                type: string
 *                enum: [Video, Podcast]
 *              topics:
 *                type: array
 *                items:
 *                  type: string
 *
 *    responses:
 *      '201':
 *        description: Video successfully created
 *      '400':
 *        description: Incorrect locale information provided
 *      '401':
 *        description: Not Authorized
 *      '409':
 *        description: Conflict
 */
router.post(
  '/video',
  body('title').not().isEmpty().isString().trim().escape(),
  body('originalTitle').not().isEmpty().isString().trim().escape(),
  body('originURL').not().isEmpty().isString().trim().escape(),
  check('thumbnail.url').trim().isString().optional({ nullable: true }),
  check('thumbnail.width').trim().isNumeric().optional({ nullable: true }),
  check('thumbnail.height').trim().isNumeric().optional({ nullable: true }),
  body('description').not().isEmpty().isString().trim().escape(),
  body('channelTitle').isString().trim().escape().optional({ nullable: true }),
  body('duration').not().isEmpty().isString().trim().escape(),
  body('defaultLanguage').not().isEmpty().isString().trim().escape(),
  body('dataType').not().isEmpty().isString().trim().escape().isIn(['Video', 'Podcast']),
  check('topics.*').not().isEmpty().isString().trim().escape(),
  validateRequest,
  checkJwt,
  isAdmin,
  async (req, res, next) => {
    try {
      const data = req.body;

      // Check language
      try {
        Intl.getCanonicalLocales(data.defaultLanguage);
      } catch (err) {
        throw new BadRequestError('Incorrect locale information provided');
      }

      let token;
      if (req.headers.authorization.split(' ').length === 2) token = req.headers.authorization.split(' ')[1];
      else token = req.headers.authorization;

      const user = await currentUser(token);
      data.userId = user._id;

      const video = await createVideo(data);

      res.status(201).send({ id: video._id });
    } catch (error) {
      next(error);
    }
  },
);

/**
 * @swagger
 * /video/info:
 *  post:
 *    summary: Get video info from YT api
 *    description: ~ For logged in users
 *    tags:
 *      - Video
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              videoUrl:
 *                type: string
 *    responses:
 *      '200':
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                data:
 *                  type: object
 *                  properties:
 *                    videoTitle:
 *                      type: string
 *                    videoDescription:
 *                      type: string
 *                    videoThumbnails:
 *                      type: object
 *                      properties:
 *                        url:
 *                          type: string
 *                        width:
 *                          type: number
 *                        height:
 *                          type: number
 *                    videoChannelTitle:
 *                      type: string
 *                    videoDefaultLanguage:
 *                      type: string
 *                    videoDuration:
 *                      type: string
 *                    originalUrl:
 *                      type: string
 *      '400':
 *        description: Url is not valid link!
 *      '404':
 *        description: YouTube video id not found!
 */
router.post(
  '/video/info',
  body('videoUrl').not().isEmpty().isString().trim().escape(),
  validateRequest,
  checkJwt,
  async (req, res, next) => {
    try {
      const { videoUrl } = req.body;
      if (!validateYouTubeUrl(videoUrl)) throw new BadRequestError('Invalid YouTube link!');

      const videoId = youTubeGetID(videoUrl);
      if (!videoId) throw new NotFoundError('YouTube video id not found!');

      const response = await getVideoInfo(videoId, videoUrl);

      res.status(200).send({ data: response });
    } catch (error) {
      next(error);
    }
  },
);

/**
 * @swagger
 * /videos:
 *  get:
 *    summary: Get all videos
 *    description: ~ For logged in users
 *    tags:
 *      - Video
 *    security:
 *      - jwt: []
 *    parameters:
 *      - in: query
 *        name: page
 *        schema:
 *          type: integer
 *      - in: query
 *        name: size
 *        schema:
 *          type: integer
 *      - in: query
 *        name: title
 *        schema:
 *          type: string
 *        description: For query by title name
 *      - in: query
 *        name: topic
 *        schema:
 *          type: string
 *        description: For query by topic name
 *      - in: query
 *        name: dataType
 *        schema:
 *          type: string
 *        description: For query by Video/Podcast
 *    responses:
 *      '200':
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                docs:
 *                  type: array
 *                  items:
 *                    type: object
 *                    properties:
 *                      _id:
 *                        type: string
 *                      title:
 *                        type: string
 *                      originalTitle:
 *                        type: string
 *                      originURL:
 *                        type: string
 *                      thumbnail:
 *                        type: object
 *                        properties:
 *                          url:
 *                            type: string
 *                          width:
 *                            type: number
 *                          height:
 *                            type: number
 *                      description:
 *                        type: string
 *                      channelTitle:
 *                        type: string
 *                      duration:
 *                        type: string
 *                      defaultLanguage:
 *                        type: string
 *                      dataType:
 *                        type: string
 *                      userId:
 *                        type: string
 *                      user:
 *                        type: object
 *                        properties:
 *                          _id:
 *                            type: string
 *                          username:
 *                            type: string
 *                          email:
 *                            type: string
 *                          isDeleted:
 *                            type: boolean
 *                          roleId:
 *                            type: string
 *                      document:
 *                        type: array
 *                        items:
 *                          type: object
 *                          properties:
 *                            _id:
 *                              type: string
 *                            name:
 *                              type: string
 *                            urlLink:
 *                              type: string
 *                            videoId:
 *                              type: string
 *                      topic:
 *                        type: array
 *                        items:
 *                          type: object
 *                          properties:
 *                            _id:
 *                              type: string
 *                            videoId:
 *                              type: string
 *                            topicId:
 *                              type: object
 *                              properties:
 *                                _id:
 *                                  type: string
 *                                name:
 *                                  type: string
 *                                color:
 *                                  type: string
 *                                thumbnail:
 *                                  type: object
 *                                  properties:
 *                                    url:
 *                                      type: string
 *                                    width:
 *                                      type: number
 *                                    height:
 *                                      type: number
 *                      id:
 *                        type: string
 *                totalDocs:
 *                  type: number
 *                offset:
 *                  type: number
 *                limit:
 *                  type: number
 *                page:
 *                  type: number
 *                pagingCounter:
 *                  type: number
 *                hasPrevPage:
 *                  type: boolean
 *                hasNextPage:
 *                  type: boolean
 *                prevPage:
 *                  type: number
 *                nextPage:
 *                  type: number
 *      '401':
 *        description: Not Authorized
 */
router.get('/videos', async (req, res, next) => {
  const { page, size, title, topic, dataType } = req.query;

  let condition = {};
  if (title && !topic) {
    condition.title = {
      $regex: new RegExp(title),
      $options: 'i',
    };
  }
  if (dataType) {
    condition.dataType = {
      $regex: new RegExp(dataType),
      $options: 'i',
    };
  }

  const { limit, offset } = getPagination(page, topic ? 9999 : size);

  const queryParameters = { limit, offset, condition };

  try {
    const videos = await allVideos(queryParameters);

    if (topic) {
      const videosDependsTopic = [];
      const topicName = JSON.parse(topic[0]).topicId.name;
      let count = 0;
      videos.docs.map((video) => {
        if (video.topic[0].topicId.name === topicName && count < size && title !== video.title) {
          videosDependsTopic.push(video);
          count++;
        }
      });

      videos.docs = videosDependsTopic;
    }

    res.status(200).send(videos);
  } catch (error) {
    next(error);
  }
});

module.exports = {
  videoRoute: router,
};

/**
 * @swagger
 * /videos/user:
 *  get:
 *    summary: Get all videos by user
 *    description: ~ For logged in users
 *    tags:
 *      - Video
 *    security:
 *      - jwt: []
 *    parameters:
 *      - in: query
 *        name: page
 *        schema:
 *          type: integer
 *      - in: query
 *        name: size
 *        schema:
 *          type: integer
 *    responses:
 *      '200':
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                docs:
 *                  type: array
 *                  items:
 *                    type: object
 *                    properties:
 *                      _id:
 *                        type: string
 *                      title:
 *                        type: string
 *                      originalTitle:
 *                        type: string
 *                      originURL:
 *                        type: string
 *                      thumbnail:
 *                        type: object
 *                        properties:
 *                          url:
 *                            type: string
 *                          width:
 *                            type: number
 *                          height:
 *                            type: number
 *                      description:
 *                        type: string
 *                      channelTitle:
 *                        type: string
 *                      duration:
 *                        type: string
 *                      defaultLanguage:
 *                        type: string
 *                      dataType:
 *                        type: string
 *                      userId:
 *                        type: string
 *                      user:
 *                        type: object
 *                        properties:
 *                          _id:
 *                            type: string
 *                          username:
 *                            type: string
 *                          email:
 *                            type: string
 *                          isDeleted:
 *                            type: boolean
 *                          roleId:
 *                            type: string
 *                      document:
 *                        type: array
 *                        items:
 *                          type: object
 *                          properties:
 *                            _id:
 *                              type: string
 *                            name:
 *                              type: string
 *                            urlLink:
 *                              type: string
 *                            videoId:
 *                              type: string
 *                      topic:
 *                        type: array
 *                        items:
 *                          type: object
 *                          properties:
 *                            _id:
 *                              type: string
 *                            videoId:
 *                              type: string
 *                            topicId:
 *                              type: object
 *                              properties:
 *                                _id:
 *                                  type: string
 *                                name:
 *                                  type: string
 *                                color:
 *                                  type: string
 *                                thumbnail:
 *                                  type: object
 *                                  properties:
 *                                    url:
 *                                      type: string
 *                                    width:
 *                                      type: number
 *                                    height:
 *                                      type: number
 *                      id:
 *                        type: string
 *                totalDocs:
 *                  type: number
 *                offset:
 *                  type: number
 *                limit:
 *                  type: number
 *                page:
 *                  type: number
 *                pagingCounter:
 *                  type: number
 *                hasPrevPage:
 *                  type: boolean
 *                hasNextPage:
 *                  type: boolean
 *                prevPage:
 *                  type: number
 *                nextPage:
 *                  type: number
 *      '401':
 *        description: Not Authorized
 */
router.get('/videos/user', checkJwt, async (req, res, next) => {
  const { page, size, name } = req.query;
  let condition = {};
  const { limit, offset } = getPagination(page, size);
  const queryParameters = { limit, offset, condition };

  try {
    let token;
    if (req.headers.authorization.split(' ').length === 2) token = req.headers.authorization.split(' ')[1];
    else token = req.headers.authorization;

    const user = await currentUser(token);
    const videos = await userVideos(user._id, queryParameters);

    res.status(200).send(videos);
  } catch (error) {
    next(error);
  }
});

module.exports = {
  videoRoute: router,
};

/**
 * @swagger
 * /video/{videoId}:
 *  get:
 *    summary: Get video by id
 *    description: ~ For logged in users
 *    tags:
 *      - Video
 *    security:
 *      - jwt: []
 *    parameters:
 *      - in: path
 *        name: videoId
 *        schema:
 *          type: string
 *    responses:
 *      '200':
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                _id:
 *                  type: string
 *                title:
 *                  type: string
 *                originalTitle:
 *                  type: string
 *                originURL:
 *                  type: string
 *                thumbnail:
 *                  type: object
 *                  properties:
 *                    url:
 *                      type: string
 *                    width:
 *                      type: number
 *                    height:
 *                      type: number
 *                description:
 *                  type: string
 *                channelTitle:
 *                  type: string
 *                duration:
 *                  type: string
 *                defaultLanguage:
 *                  type: string
 *                dataType:
 *                  type: string
 *                userId:
 *                  type: string
 *                user:
 *                  type: object
 *                  properties:
 *                    _id:
 *                      type: string
 *                    username:
 *                      type: string
 *                    email:
 *                      type: string
 *                    isDeleted:
 *                      type: boolean
 *                    roleId:
 *                      type: string
 *                document:
 *                  type: array
 *                  items:
 *                    type: object
 *                    properties:
 *                      _id:
 *                        type: string
 *                      name:
 *                        type: string
 *                      urlLink:
 *                        type: string
 *                      videoId:
 *                        type: string
 *                topic:
 *                  type: array
 *                  items:
 *                    type: object
 *                    properties:
 *                      _id:
 *                        type: string
 *                      videoId:
 *                        type: string
 *                      topicId:
 *                        type: object
 *                        properties:
 *                          _id:
 *                            type: string
 *                          name:
 *                            type: string
 *                          color:
 *                            type: string
 *                          thumbnail:
 *                            type: object
 *                            properties:
 *                              url:
 *                                type: string
 *                              width:
 *                                type: number
 *                              height:
 *                                type: number
 *      '401':
 *        description: Not Authorized
 */
router.get(
  '/video/:videoId',
  param('videoId').not().isEmpty().isString().trim().escape(),
  validateRequest,
  async (req, res, next) => {
    try {
      const { videoId } = req.params;
      const video = await getVideo(videoId);

      res.status(200).send(video);
    } catch (error) {
      next(error);
    }
  },
);

/**
 * @swagger
 * /video/{videoId}:
 *  patch:
 *    summary: Updates a new video
 *    description: |
 *        ~ For logged in users <br />
 *        ~ For the video owner
 *    tags:
 *      - Video
 *    security:
 *      - jwt: []
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              title:
 *                type: string
 *                nullable: true
 *              description:
 *                type: string
 *                nullable: true
 *              topics:
 *                type: array
 *                nullable: true
 *                items:
 *                  id:
 *                    type: string
 *    parameters:
 *      - in: path
 *        name: videoId
 *        schema:
 *          type: string
 *    responses:
 *      '204':
 *        description: Video succesfully updated
 *      '401':
 *        description: Not Authorized
 */
router.patch(
  '/video/:videoId',
  param('videoId').not().isEmpty().isString().trim().escape(),
  body('title').isString().trim().escape().optional({ nullable: true }),
  body('description').isString().trim().escape().optional({ nullable: true }),
  body('channeltitle').isString().trim().escape().optional({ nullable: true }),
  body('dataType').isString().trim().escape().isIn(['Video', 'Podcast']).optional({ nullable: true }),
  check('topics.*').isString().trim().escape().optional({ nullable: true }),
  validateRequest,
  checkJwt,
  videoOwner,
  async (req, res, next) => {
    try {
      const { videoId } = req.params;
      const bodyData = req.body;

      await updateVideo(videoId, bodyData);

      res.status(204).send({ message: 'Video succesfully updated' });
    } catch (error) {
      next(error);
    }
  },
);

/**
 * @swagger
 * /video/{videoId}:
 *  delete:
 *    summary: Delete video by id
 *    description: |
 *        ~ For logged in users <br />
 *        ~ For the video owner
 *    tags:
 *      - Video
 *    security:
 *      - jwt: []
 *    parameters:
 *      - in: path
 *        name: videoId
 *        schema:
 *          type: string
 *    responses:
 *      '204':
 *        description: Video successfully deleted
 *      '401':
 *        description: Not Authorized
 */
router.delete(
  '/video/:videoId',
  param('videoId').not().isEmpty().isString().trim().escape(),
  validateRequest,
  checkJwt,
  videoOwner,
  async (req, res, next) => {
    try {
      const { videoId } = req.params;

      await deleteVideo(videoId);

      res.status(204).send({ message: 'Video successfully deleted' });
    } catch (error) {
      next(error);
    }
  },
);

module.exports = {
  videoRoute: router,
};
