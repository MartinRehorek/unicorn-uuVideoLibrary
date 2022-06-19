'use strict';

const logger = require('../utils/logger');
const { GeneralError } = require('../utils/errors');

/**
 * Global error handler
 * @param {func} err
 * @param {func} req
 * @param {func} res
 * @param {func} next
 * @returns Error
 */
const errorHandler = (err, req, res, next) => {
  logger.error(`Handle Errors: ${err}`);

  if (err instanceof GeneralError) {
    return res.status(err.code).send(err.serializeErrors());
  }

  return res.status(400).send({
    message: 'Something went wrong',
  });
};

module.exports = errorHandler;
