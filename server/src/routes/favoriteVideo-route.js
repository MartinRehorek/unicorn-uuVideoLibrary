'use strict';

const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');

const { validateRequest } = require('../middleware/validate-request');
const { checkJwt, isAdmin } = require('../middleware/authentication');
const { BadRequestError, NotFoundError } = require('../utils/errors');
const { getPagination } = require('../utils/pagination');

const { currentUser } = require('../services/user-service');
const {
  createFavoriteVideo,
  allFavoriteVideos,
  allFavoriteUserVideos,
  getFavoriteVideo,
  deleteFavoriteVideo,
} = require('../services/favoriteVideo-service');

/**
 * @swagger
 * /video/favorite/{videoId}:
 *  post:
 *    summary: Creates new favorite video
 *    description: ~ For logged in users
 *    tags:
 *      - Favorite Video
 *    security:
 *      - jwt: []
 *    parameters:
 *      - in: path
 *        name: videoId
 *        schema:
 *          type: string
 *    responses:
 *      '201':
 *        description: Favorite video successfully created
 *      '401':
 *        description: Not Authorized
 *      '404':
 *        description: User doesn't exists
 *      '422':
 *        description: Invalid request parameters
 */
router.post(
  '/video/favorite/:videoId',
  param('videoId').not().isEmpty().isString().trim().escape(),
  validateRequest,
  checkJwt,
  async (req, res, next) => {
    try {
      let token;
      if (req.headers.authorization.split(' ').length === 2) token = req.headers.authorization.split(' ')[1];
      else token = req.headers.authorization;

      const user = await currentUser(token);
      if (!user) throw new NotFoundError("User doesn't exists");

      const { videoId } = req.params;

      await createFavoriteVideo(user._id, videoId);

      res.status(201).send({ message: 'Favorite video successfully created' });
    } catch (error) {
      next(error);
    }
  },
);

/**
 * @swagger
 * /video/favorites:
 *  get:
 *    summary: Gets all favorite videos
 *    description: |
 *        ~ For logged in users <br />
 *        ~ For administrators
 *    tags:
 *      - Favorite Video
 *    security:
 *      - jwt: []
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
 *                      userId:
 *                        type: string
 *                      videoId:
 *                        type: string
 *                      favorite:
 *                        type: boolean
 *                      videos:
 *                        type: array
 *                        items:
 *                          type: object
 *                          properties:
 *                            _id:
 *                              type: string
 *                            title:
 *                              type: string
 *                            originalTitle:
 *                              type: string
 *                            originURL:
 *                              type: string
 *                            thumbnail:
 *                              type: object
 *                              properties:
 *                                url:
 *                                  type: string
 *                                width:
 *                                  type: number
 *                                height:
 *                                  type: number
 *                            description:
 *                              type: string
 *                            channelTitle:
 *                              type: string
 *                            duration:
 *                              type: string
 *                            defaultLanguage:
 *                              type: string
 *                            dataType:
 *                              type: string
 *                            userId:
 *                              type: string
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
router.get('/video/favorites', checkJwt, async (req, res, next) => {
  const { page, size, name } = req.query;
  let condition = {};
  const { limit, offset } = getPagination(page, size);
  const queryParameters = { limit, offset, condition };

  try {
    const favorites = await allFavoriteVideos(queryParameters);

    res.status(200).send(favorites);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /video/favorite/current-user:
 *  get:
 *    summary: Gets all favorite videos for current user
 *    description: ~ For logged in users
 *    tags:
 *      - Favorite Video
 *    security:
 *      - jwt: []
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
 *                      userId:
 *                        type: string
 *                      videoId:
 *                        type: string
 *                      favorite:
 *                        type: boolean
 *                      videos:
 *                        type: array
 *                        items:
 *                          type: object
 *                          properties:
 *                            _id:
 *                              type: string
 *                            title:
 *                              type: string
 *                            originalTitle:
 *                              type: string
 *                            originURL:
 *                              type: string
 *                            thumbnail:
 *                              type: object
 *                              properties:
 *                                url:
 *                                  type: string
 *                                width:
 *                                  type: number
 *                                height:
 *                                  type: number
 *                            description:
 *                              type: string
 *                            channelTitle:
 *                              type: string
 *                            duration:
 *                              type: string
 *                            defaultLanguage:
 *                              type: string
 *                            dataType:
 *                              type: string
 *                            userId:
 *                              type: string
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
 *      '404':
 *        description: User doesn't exists
 */
router.get('/video/favorite/current-user', checkJwt, async (req, res, next) => {
  const { page, size, name } = req.query;
  let condition = {};
  const { limit, offset } = getPagination(page, size);
  const queryParameters = { limit, offset, condition };

  // TODO: Check this route with insomnia
  try {
    let token;
    if (req.headers.authorization.split(' ').length === 2) token = req.headers.authorization.split(' ')[1];
    else token = req.headers.authorization;

    const user = await currentUser(token);

    if (!user) throw new NotFoundError("User doesn't exists");

    const favorites = await allFavoriteUserVideos(user._id, queryParameters);

    res.status(200).send(favorites);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /video/favorite/{videoId}:
 *  get:
 *    summary: Get favorite video by id
 *    description: ~ For logged in users
 *    tags:
 *      - Favorite Video
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
 *                userId:
 *                  type: string
 *                videoId:
 *                  type: string
 *                favorite:
 *                  type: boolean
 *                videos:
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
 *      '404':
 *        description: User doesn't exists
 */
router.get(
  '/video/favorite/:videoId',
  param('videoId').not().isEmpty().isString().trim().escape(),
  validateRequest,
  checkJwt,
  async (req, res, next) => {
    try {
      let token;
      if (req.headers.authorization.split(' ').length === 2) token = req.headers.authorization.split(' ')[1];
      else token = req.headers.authorization;

      const user = await currentUser(token);
      if (!user) throw new NotFoundError("User doesn't exists");

      const { videoId } = req.params;

      const favorite = await getFavoriteVideo(user._id, videoId);

      res.status(200).send(favorite);
    } catch (error) {
      next(error);
    }
  },
);

/**
 * @swagger
 * /video/favorite/{videoId}:
 *  delete:
 *    summary: Delete favorite video by id
 *    description: ~ For logged in users
 *    tags:
 *      - Favorite Video
 *    security:
 *      - jwt: []
 *    parameters:
 *      - in: path
 *        name: videoId
 *        schema:
 *          type: string
 *    responses:
 *      '204':
 *        description: Favorite video successfully deleted
 *      '404':
 *        description: User doesn't exists
 */
router.delete(
  '/video/favorite/:videoId',
  param('videoId').not().isEmpty().isString().trim().escape(),
  validateRequest,
  checkJwt,
  async (req, res, next) => {
    try {
      let token;
      if (req.headers.authorization.split(' ').length === 2) token = req.headers.authorization.split(' ')[1];
      else token = req.headers.authorization;

      const user = await currentUser(token);
      if (!user) throw new NotFoundError("User doesn't exists");

      const { videoId } = req.params;

      await deleteFavoriteVideo(user._id, videoId);

      res.status(204).send({ message: 'Favorite video successfully deleted' });
    } catch (error) {
      next(error);
    }
  },
);

module.exports = {
  favoriteVideoRoute: router,
};
