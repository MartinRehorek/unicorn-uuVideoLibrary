'use strict';

const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');

const { validateRequest } = require('../middleware/validate-request');
const { checkJwt, isAdmin, documentOwner } = require('../middleware/authentication');
const { stringIsAValidUrl } = require('../utils/helpers');
const { BadRequestError } = require('../utils/errors');
const { getPagination } = require('../utils/pagination');

const {
  createDocument,
  allDocuments,
  allVideoDocuments,
  getDocument,
  updateDocument,
  deleteDocument,
} = require('../services/document-service');

/**
 * @swagger
 * /document:
 *  post:
 *    summary: Create document
 *    description: ~ For logged in users
 *    tags:
 *      - Document
 *    security:
 *      - jwt: []
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required: [name, urlLink, videoId]
 *            properties:
 *              name:
 *                type: string
 *                minLength: 4
 *                maxLength: 100
 *              urlLink:
 *                type: string
 *              videoId:
 *                type: string
 *    responses:
 *      '201':
 *        description: Document successfully created
 *      '400':
 *        description: Url is not valid link!
 *      '401':
 *        description: Not Authorized
 *      '404':
 *        description: Not found.
 *      '409':
 *        description: Document exists
 *      '422':
 *        description: Invalid request parameters
 */
router.post(
  '/document',
  body('name').not().isEmpty().isString().trim().escape().isLength({ min: 4, max: 100 }),
  body('urlLink')
    .not()
    .isEmpty()
    .isString()
    .trim()
    .escape()
    .customSanitizer((value) => {
      if (stringIsAValidUrl(value)) return value.replaceAll('&#x2F;', '');
      else throw new BadRequestError('Url is not valid link!');
    }),
  body('videoId').not().isEmpty().isString().trim().escape(),
  validateRequest,
  checkJwt,
  isAdmin,
  async (req, res, next) => {
    try {
      await createDocument(req.body);

      res.status(201).send({ message: 'Document successfully created' });
    } catch (error) {
      next(error);
    }
  },
);

/**
 * @swagger
 * /documents:
 *  get:
 *    summary: Get all documents
 *    description: |
 *        ~ For logged in users <br />
 *        ~ For administrators
 *    tags:
 *      - Document
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
 *                        _id:
 *                          type: string
 *                        name:
 *                          type: string
 *                        urlLink:
 *                          type: string
 *                        videoId:
 *                          type: string
 *                        id:
 *                          type: string
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
router.get('/documents', checkJwt, isAdmin, async (req, res, next) => {
  const { page, size, name } = req.query;
  let condition = {};
  const { limit, offset } = getPagination(page, size);
  const queryParameters = { limit, offset, condition };

  try {
    const documents = await allDocuments(queryParameters);

    res.status(200).send(documents);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /documents/video/{videoId}:
 *  get:
 *    summary: Gets all documents for a video
 *    description: ~ For logged in users
 *    tags:
 *      - Document
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
 *                docs:
 *                  type: array
 *                  items:
 *                    type: object
 *                    properties:
 *                        _id:
 *                          type: string
 *                        name:
 *                          type: string
 *                        urlLink:
 *                          type: string
 *                        videoId:
 *                          type: string
 *                        id:
 *                          type: string
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
router.get(
  '/documents/video/:videoId',
  checkJwt,
  param('videoId').not().isEmpty().isString().trim().escape(),
  async (req, res, next) => {
    const { page, size, name } = req.query;
    let condition = {};
    const { limit, offset } = getPagination(page, size);
    const queryParameters = { limit, offset, condition };

    try {
      const { videoId } = req.params;
      const documents = await allVideoDocuments(videoId, queryParameters);

      res.status(200).send(documents);
    } catch (error) {
      next(error);
    }
  },
);

/**
 * @swagger
 * /document/{documentId}:
 *  get:
 *    summary: Get Document based on id
 *    description: ~ For logged in users
 *    tags:
 *      - Document
 *    security:
 *      - jwt: []
 *    parameters:
 *      - in: path
 *        name: documentId
 *        schema:
 *          type: string
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
 *                        _id:
 *                          type: string
 *                        name:
 *                          type: string
 *                        urlLink:
 *                          type: string
 *                        videoId:
 *                          type: string
 *                        id:
 *                          type: string
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
 *      '404':
 *        description: Document doesn't exists
 *      '422':
 *        description: Invalid request parameters
 */
router.get(
  '/document/:documentId',
  param('documentId').not().isEmpty().isString().trim().escape(),
  validateRequest,
  checkJwt,
  async (req, res, next) => {
    try {
      const { documentId } = req.params;

      const document = await getDocument(documentId);

      res.status(200).send(document);
    } catch (error) {
      next(error);
    }
  },
);

/**
 * @swagger
 * /document/{documentId}:
 *  patch:
 *    summary: Patches document based on id
 *    description: ~ For logged in users
 *    tags:
 *      - Document
 *    security:
 *      - jwt: []
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              name:
 *                type: string
 *                minLength: 4
 *                maxLength: 100
 *                nullable: true
 *              urlLink:
 *                type: string
 *                nullable: true
 *    parameters:
 *      - in: path
 *        name: documentId
 *        schema:
 *          type: string
 *    responses:
 *      '204':
 *        description: Document succesfully updated
 *      '400':
 *        description: Url is not valid link!
 *      '401':
 *        description: Not Authorized
 *      '404':
 *        description: Not found.
 *      '422':
 *        description: Invalid request parameters
 */
router.patch(
  '/document/:documentId',
  param('documentId').not().isEmpty().isString().trim().escape(),
  body('name').isString().trim().escape().isLength({ min: 4, max: 100 }).optional({ nullable: true }),
  body('urlLink')
    .isString()
    .trim()
    .escape()
    .customSanitizer((value) => {
      if (stringIsAValidUrl(value)) return value.replaceAll('&#x2F;', '');
      else throw new BadRequestError('Url is not valid link!');
    })
    .optional({ nullable: true }),
  validateRequest,
  checkJwt,
  documentOwner,
  async (req, res, next) => {
    try {
      const { documentId } = req.params;
      const bodyData = req.body;

      await updateDocument(documentId, bodyData);

      res.status(204).send('Document succesfully updated');
    } catch (error) {
      next(error);
    }
  },
);

/**
 * @swagger
 * /document/{documentId}:
 *  delete:
 *    summary: Deletes document based on id
 *    description: |
 *        ~ For logged in users <br />
 *        ~ For administrators
 *    tags:
 *      - Document
 *    security:
 *      - jwt: []
 *    parameters:
 *      - in: path
 *        name: documentId
 *        schema:
 *          type: string
 *    responses:
 *      '204':
 *        description: Document successfully deleted
 *      '401':
 *        description: Not Authorized
 *      '404':
 *        description: Document doesn't exists
 *      '422':
 *        description: Invalid request parameters
 */
router.delete(
  '/document/:documentId',
  param('documentId').not().isEmpty().isString().trim().escape(),
  validateRequest,
  checkJwt,
  documentOwner,
  async (req, res, next) => {
    try {
      const { documentId } = req.params;

      await deleteDocument(documentId);

      res.status(204).send({ message: 'Document successfully deleted' });
    } catch (error) {
      next(error);
    }
  },
);

module.exports = {
  documentRoute: router,
};
