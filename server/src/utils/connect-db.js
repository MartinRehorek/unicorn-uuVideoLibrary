'use strict';

const mongoose = require('mongoose');
const env = require('env-var');

const logger = require('./logger');
const { InternalServerError } = require('./errors');

let database;

/**
 * Create connection to Mongo DB
 */
const connectDb = async () => {
  const mongoUri = env.get('MONGO_URI').required().asUrlString();

  try {
    await mongoose
      .connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then((response) => {
        logger.info('Connected to database');
        return response;
      })
      .catch((error) => {
        logger.error(`ERROR DB: ${error.message ?? error}`);
        if (error instanceof Error) {
          throw new InternalServerError('DB error');
        } else {
          throw new InternalServerError();
        }
      });
  } catch (error) {
    logger.error(`ERROR Connection to DB: ${error.message ?? error}`);
    throw new InternalServerError('Error connecting to database');
  }
};

/**
 * Disconnect DB
 * @returns Mongo Status
 */
const disconnectDb = async () => {
  if (!database) {
    return;
  }
  await mongoose.disconnect();
};

/**
 * Check Mongo DB health status
 * @returns Mongo State
 */
const healthCheckDb = async () => {
  const mongoUri = env.get('MONGO_URI').required().asUrlString();
  try {
    const connection = await mongoose.createConnection(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    return await connection.readyState;
  } catch (error) {
    logger.error(`Mongo HealthCheck: ${error}`);
    return error.message;
  }
};

module.exports = {
  connectDb,
  disconnectDb,
  healthCheckDb,
};
