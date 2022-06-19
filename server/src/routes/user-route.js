'use strict';

const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');

const { validateRequest } = require('../middleware/validate-request');
const { checkJwt, isAdmin, samePerson, accessRights } = require('../middleware/authentication');
const { getPagination } = require('../utils/pagination');

const { ROLE } = require('../utils/constants');

const { createUser, currentUser, allUsers, getUser, updateUser, deleteUser } = require('../services/user-service');

/**
 * @swagger
 * /user:
 *  post:
 *    summary: Creates new user
 *    tags:
 *      - User
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required: [username, email, password, role]
 *            properties:
 *              username:
 *                type: string
 *                minLength: 4
 *                maxLength: 32
 *              email:
 *                type: string
 *              password:
 *                type: string
 *                minLength: 4
 *              role:
 *                type: string
 *                enum: [admin, user]
 *                default: user
 *    responses:
 *      '201':
 *        description: User successfully created
 *      '409':
 *        description: User exists
 */
router.post(
  '/user',
  body('username').not().isEmpty().isString().trim().escape().isLength({ min: 4, max: 32 }),
  body('email').not().isEmpty().trim().escape().isEmail(),
  body('password').not().isEmpty().isString().trim().escape().isLength({ min: 4 }),
  body('role').not().isEmpty().isString().trim().escape().isIn([ROLE.admin, ROLE.user]),
  validateRequest,
  async (req, res, next) => {
    try {
      if (!req.headers.authorization) req.body.role = ROLE.user;

      await createUser(req.body);

      res.status(201).send({ message: 'User successfully created' });
    } catch (error) {
      next(error);
    }
  },
);

/**
 * @swagger
 * /current-user:
 *  get:
 *    summary: Get current user
 *    description: ~ For logged in users
 *    tags:
 *      - User
 *    security:
 *      - jwt: []
 *    responses:
 *      '200':
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                _id:
 *                  type: string
 *                username:
 *                  type: string
 *                email:
 *                  type: string
 *                isDeleted:
 *                  type: string
 *                role:
 *                  type: object
 *                  properties:
 *                    _id:
 *                      type: string
 *                    name:
 *                      type: string
 *                favorite:
 *                  type: array
 *                  items:
 *                    type: object
 *                    properties:
 *                      _id:
 *                        type: string
 *                      userId:
 *                        type: string
 *                      videoId:
 *                        type: object
 *                        properties:
 *                          _id:
 *                            type: string
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
 *                      favorite:
 *                        type: boolean
 *      '404':
 *        description: User doesn't exists
 */
router.get('/current-user', checkJwt, async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization.split(' ').length === 2) token = req.headers.authorization.split(' ')[1];
    else token = req.headers.authorization;

    const user = await currentUser(token);

    res.status(200).send(user);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /users:
 *  get:
 *    summary: Get all users
 *    description: |
 *        ~ For logged in users <br />
 *        ~ For administrators
 *    tags:
 *      - User
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
 *                      username:
 *                        type: string
 *                      email:
 *                        type: string
 *                      isDeleted:
 *                        type: boolean
 *                      roleId:
 *                        type: string
 *                      role:
 *                        type: object
 *                        properties:
 *                          _id:
 *                            type: string
 *                          name:
 *                            type: string
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
router.get('/users', checkJwt, isAdmin, async (req, res, next) => {
  const { page, size, name } = req.query;
  let condition = {};
  const { limit, offset } = getPagination(page, size);
  const queryParameters = { limit, offset, condition };

  try {
    const users = await allUsers(queryParameters);

    res.status(200).send(users);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /user/{userId}:
 *  get:
 *    summary: Get user by id
 *    description: |
 *        ~ For logged in users <br />
 *        ~ For administrators
 *    tags:
 *      - User
 *    security:
 *      - jwt: []
 *    parameters:
 *      - in: path
 *        name: userId
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
 *                username:
 *                  type: string
 *                email:
 *                  type: string
 *                isDeleted:
 *                  type: string
 *                role:
 *                  type: object
 *                  properties:
 *                    _id:
 *                      type: string
 *                    name:
 *                      type: string
 *                favorite:
 *                  type: array
 *                  items:
 *                    type: object
 *                    properties:
 *                      _id:
 *                        type: string
 *                      userId:
 *                        type: string
 *                      videoId:
 *                        type: object
 *                        properties:
 *                          _id:
 *                            type: string
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
 *                      favorite:
 *                        type: boolean
 *      '404':
 *        description: User doesn't exists
 */
router.get(
  '/user/:userId',
  param('userId').not().isEmpty().isString().trim().escape(),
  validateRequest,
  checkJwt,
  isAdmin,
  async (req, res, next) => {
    try {
      const { userId } = req.params;

      const user = await getUser(userId);

      res.status(200).send(user);
    } catch (error) {
      next(error);
    }
  },
);

/**
 * @swagger
 * /user/{userId}:
 *  patch:
 *    summary: Get user by id
 *    description: |
 *        ~ For logged in users <br />
 *        ~ For the same person who created the account
 *    tags:
 *      - User
 *    security:
 *      - jwt: []
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              username:
 *                type: string
 *                minLength: 4
 *                maxLength: 32
 *                nullable: true
 *              password:
 *                type: string
 *                minLength: 4
 *                nullable: true
 *              role:
 *                type: string
 *                enum: [admin, user]
 *                nullable: true
 *    parameters:
 *      - in: path
 *        name: userId
 *        schema:
 *          type: string
 *    responses:
 *      '204':
 *        description: User succesfully updated
 *      '404':
 *        description: User doesn't exists
 */
router.patch(
  '/user/:userId',
  param('userId').not().isEmpty().isString().trim().escape(),
  body('username').isString().trim().escape().isLength({ min: 4, max: 32 }).optional({ nullable: true }),
  body('password').isString().trim().escape().isLength({ min: 4 }).optional({ nullable: true }),
  body('role').isString().trim().escape().isIn([ROLE.admin, ROLE.user]).optional({ nullable: true }),
  validateRequest,
  checkJwt,
  samePerson,
  async (req, res, next) => {
    try {
      const { userId } = req.params;
      const bodyData = req.body;

      await updateUser(userId, bodyData);

      res.status(204).send({ message: 'User succesfully updated' });
    } catch (error) {
      next(error);
    }
  },
);

/**
 * @swagger
 * /user/{userId}:
 *  delete:
 *    summary: Delete user by id
 *    description: |
 *        ~ For logged in users <br />
 *        ~ For the same person who created the account
 *    tags:
 *      - User
 *    security:
 *      - jwt: []
 *    parameters:
 *      - in: path
 *        name: userId
 *        schema:
 *          type: string
 *    responses:
 *      '204':
 *        description: User successfully deleted
 *      '404':
 *        description: User doesn't exists
 */
router.delete(
  '/user/:userId',
  param('userId').not().isEmpty().isString().trim().escape(),
  validateRequest,
  checkJwt,
  samePerson,
  async (req, res, next) => {
    try {
      const { userId } = req.params;

      let token;
      if (req.headers.authorization.split(' ').length === 2) token = req.headers.authorization.split(' ')[1];
      else token = req.headers.authorization;

      await deleteUser(userId, token);

      res.status(204).send({ message: 'User successfully deleted' });
    } catch (error) {
      next(error);
    }
  },
);

module.exports = {
  userRoute: router,
};
