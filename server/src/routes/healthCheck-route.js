'use strict';

const express = require('express');
const { Error } = require('mongoose');
const router = express.Router();

const { validateRequest } = require('../middleware/validate-request');
const healthCheckService = require('../services/healthCheck-service');
const { InternalServerError } = require('../utils/errors');

/**
 * Health-Check for Express & Mongo Atlas
 */
router.post('/health-check', validateRequest, async (req, res) => {
  try {
    const data = await healthCheckService();

    res.status(200).send({ data });
  } catch (error) {
    if (error instanceof Error) {
      throw new InternalServerError('Mongoose health check error');
    } else {
      throw new InternalServerError();
    }
  }
});

module.exports = {
  healthCheckRoute: router,
};
