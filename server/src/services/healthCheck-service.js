'use strict';

const { healthCheckDb } = require('../utils/connect-db');

/**
 * healthCheckService - check mongo DB status
 * @returns Express & Mongo status
 */
const healthCheckService = async () => {
  const healthCheckMongoDB = await healthCheckDb();

  return {
    expressUptime: process.uptime(),
    mongoDB: healthCheckMongoDB,
    timestamp: Date.now(),
  };
};

module.exports = healthCheckService;
