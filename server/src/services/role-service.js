'use strict';

const Role = require('../models/role-model');

/**
 * Get one role depends on name
 * @param {String} roleId
 * @returns {Object } role
 */
const getRole = async (id = undefined, name = undefined) => {
  if (name) return await Role.findOne({ name }).lean();
  else return await Role.findById(id).lean();
};

module.exports = { getRole };
