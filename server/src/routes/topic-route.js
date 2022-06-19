'use strict';

const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');

const { validateRequest } = require('../middleware/validate-request');
const { checkJwt, isAdmin } = require('../middleware/authentication');
const { BadRequestError } = require('../utils/errors');
const { hexColorChecker } = require('../utils/helpers');
const { getPagination } = require('../utils/pagination');

const {
  createTopic,
  allTopics,
  allTopicsVideos,
  getTopic,
  updateTopic,
  deleteTopic,
} = require('../services/topic-service');

/**
 * @swagger
 * /topic:
 *  post:
 *    summary: Creates new topic
 *    description: |
 *        ~ For logged in users <br />
 *        ~ For administrators
 *    tags:
 *      - Topic
 *    security:
 *      - jwt: []
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required: [name, color]
 *            properties:
 *              name:
 *                type: string
 *                minLength: 4
 *                maxLength: 32
 *              color:
 *                type: string
 *                minLength: 4
 *              thumbnail:
 *                type: object
 *                properties:
 *                  url:
 *                    type: string
 *                  width:
 *                    type: number
 *                  height:
 *                    type: number
 *    responses:
 *      '201':
 *        description: Topic successfully created
 *      '400':
 *        description: Wrong hex color value
 *      '409':
 *        description: Topic exists
 */
router.post(
  '/topic',
  body('name').not().isEmpty().isString().trim().escape().isLength({ min: 4, max: 32 }),
  body('color').not().isEmpty().isString().trim().escape().isLength({ min: 4 }),
  body('thumbnail.url').trim().isString().optional({ nullable: true }),
  body('thumbnail.width').trim().isNumeric().optional({ nullable: true }),
  body('thumbnail.height').trim().isNumeric().optional({ nullable: true }),
  validateRequest,
  checkJwt,
  isAdmin,
  async (req, res, next) => {
    try {
      if (!hexColorChecker(req.body.color)) throw new BadRequestError('Wrong hex color value!');

      await createTopic(req.body);

      res.status(201).send({ message: 'Topic successfully created' });
    } catch (error) {
      next(error);
    }
  },
);

/**
 * @swagger
 * /topics:
 *  get:
 *    summary: Gets all topics
 *    tags:
 *      - Topic
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
 *                      name:
 *                        type: string
 *                      color:
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
 */
router.get('/topics', async (req, res, next) => {
  const { page, size, name } = req.query;
  let condition = {};
  const { limit, offset } = getPagination(page, size);
  const queryParameters = { limit, offset, condition };

  try {
    const topics = await allTopics(queryParameters);

    res.status(200).send(topics);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /topics/videos:
 *  get:
 *    summary: Gets all topics with related videos
 *    description: |
 *        ~ For logged in users <br />
 *        ~ For administrators
 *    tags:
 *      - Topic
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
 *                      name:
 *                        type: string
 *                      color:
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
 *                      video:
 *                        type: array
 *                        items:
 *                          type: object
 *                          properties:
 *                            _id:
 *                              type: string
 *                            videoId:
 *                              type: object
 *                              properties:
 *                                title:
 *                                  type: string
 *                                originalTitle:
 *                                  type: string
 *                                originURL:
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
 *                                description:
 *                                  type: string
 *                                channelTitle:
 *                                  type: string
 *                                duration:
 *                                  type: string
 *                                defaultLanguage:
 *                                  type: string
 *                                dataType:
 *                                  type: string
 *                                userId:
 *                                  type: string
 *                            topicId:
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
 */
router.get('/topics/videos', async (req, res, next) => {
  const { page, size, name } = req.query;
  let condition = {};
  const { limit, offset } = getPagination(page, size);
  const queryParameters = { limit, offset, condition };

  try {
    const topicsVideos = await allTopicsVideos(queryParameters);

    res.status(200).send(topicsVideos);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /topic/{topicId}:
 *  get:
 *    summary: Get topic based on id
 *    tags:
 *      - Topic
 *    parameters:
 *      - in: path
 *        name: topicId
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
 *                name:
 *                  type: string
 *                color:
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
 *                video:
 *                  type: array
 *                  items:
 *                    type: object
 *                    properties:
 *                      _id:
 *                        type: string
 *                      videoId:
 *                        type: object
 *                        properties:
 *                          title:
 *                            type: string
 *                          originalTitle:
 *                            type: string
 *                          originURL:
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
 *                          description:
 *                            type: string
 *                          channelTitle:
 *                            type: string
 *                          duration:
 *                            type: string
 *                          defaultLanguage:
 *                            type: string
 *                          dataType:
 *                            type: string
 *                          userId:
 *                            type: string
 *                      topicId:
 *                        type: string
 *      '404':
 *        description: Topic doesn't exists
 */
router.get(
  '/topic/:topicId',
  param('topicId').not().isEmpty().isString().trim().escape(),
  validateRequest,
  async (req, res, next) => {
    try {
      const { topicId } = req.params;

      const topic = await getTopic(topicId);

      res.status(200).send(topic);
    } catch (error) {
      next(error);
    }
  },
);

/**
 * @swagger
 * /topic/{topicId}:
 *  patch:
 *    summary: Updates a topic
 *    description: |
 *        ~ For logged in users
 *        ~ For administrators <br />
 *    tags:
 *      - Topic
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              name:
 *                type: string
 *                minLength: 4
 *                maxLength: 32
 *                nullable: true
 *              color:
 *                type: string
 *                minLength: 4
 *                nullable: true
 *              thumbnail:
 *                type: object
 *                properties:
 *                  url:
 *                    type: string
 *                  width:
 *                    type: number
 *                  height:
 *                    type: number
 *    parameters:
 *      - in: path
 *        name: topicId
 *        schema:
 *          type: string
 *    responses:
 *      '204':
 *        description: Topic succesfully updated
 *      '400':
 *        description: Wrong hex color value
 *      '409':
 *        description: Topic exists
 */
router.patch(
  '/topic/:topicId',
  param('topicId').not().isEmpty().isString().trim().escape(),
  body('name').isString().trim().escape().isLength({ min: 4, max: 32 }).optional({ nullable: true }),
  body('color').isString().trim().escape().isLength({ min: 4 }).optional({ nullable: true }),
  body('thumbnail.url').trim().isString().optional({ nullable: true }),
  body('thumbnail.width').trim().isNumeric().optional({ nullable: true }),
  body('thumbnail.height').trim().isNumeric().optional({ nullable: true }),
  validateRequest,
  checkJwt,
  isAdmin,
  async (req, res, next) => {
    try {
      const { topicId } = req.params;
      const bodyData = req.body;

      if (req.body?.color && !hexColorChecker(req.body.color)) throw new BadRequestError('Wrong hex color value!');
      await updateTopic(topicId, bodyData);

      res.status(204).send({ message: 'Topic succesfully updated' });
    } catch (error) {
      next(error);
    }
  },
);

/**
 * @swagger
 * /topic/{topicId}:
 *  delete:
 *    summary: Deletes topic based on id
 *    description: |
 *        ~ For logged in users
 *        ~ For administrators
 *    tags:
 *      - Topic
 *    security:
 *      - jwt: []
 *    parameters:
 *      - in: path
 *        name: topicId
 *        schema:
 *          type: string
 *    responses:
 *      '204':
 *        description: Topic successfully deleted
 *      '404':
 *        description: Topic doesn't exists
 */
router.delete(
  '/topic/:topicId',
  param('topicId').not().isEmpty().isString().trim().escape(),
  validateRequest,
  checkJwt,
  isAdmin,
  async (req, res, next) => {
    try {
      const { topicId } = req.params;

      await deleteTopic(topicId);

      res.status(204).send({ message: 'Topic successfully deleted' });
    } catch (error) {
      next(error);
    }
  },
);

module.exports = {
  topicRoute: router,
};
