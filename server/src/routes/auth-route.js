'use strict';

const express = require('express');
const router = express.Router();
const { body } = require('express-validator');

const { validateRequest } = require('../middleware/validate-request');

const { login } = require('../services/auth-service');

/**
 * @swagger
 * /login:
 *  post:
 *    summary: Login of the user
 *    tags:
 *      - Login
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required: [username, password]
 *            properties:
 *              username:
 *                type: string
 *                default: AdminUser
 *              password:
 *                type: string
 *                default: xxx
 *    responses:
 *      '200':
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                token:
 *                  type: string
 *                  description: Token for authorized user
 *      '400':
 *        description: Incorrect locale information provided
 *      '401':
 *        description: Not Authorized
 *      '422':
 *        description: Invalid request parameters
 */
router.post(
  '/login',
  body('username').not().isEmpty().isString().trim().escape().isLength({ min: 4, max: 32 }),
  body('password').not().isEmpty().isString().trim().escape().isLength({ min: 4 }),
  validateRequest,
  async (req, res, next) => {
    try {
      const token = await login(req.body);

      res.status(200).send({ token });
      return;
    } catch (error) {
      next(error);
    }
  },
);

module.exports = {
  authRoute: router,
};
