'use strict';

const mongoose = require('mongoose');
const env = require('env-var');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const User = require('../models/user-model');
const { NotAuthorizedError } = require('../utils/errors');

/**
 * Simple Login per JWT Token
 * @param {String} username
 * @param {String} password
 * @returns {String} JWT Token
 */
const login = async ({ username, password }) => {
  const user = await User.findOne({ username }).select('+encrypt_password').select('+salt').select('+roleId').lean();

  if (!user) throw new NotAuthorizedError();

  const securePassword = (plainPassword) => crypto.createHmac('sha512', user.salt).update(plainPassword).digest('hex');

  if (securePassword(password) !== user.encrypt_password) throw new NotAuthorizedError();

  return jwt.sign(
    { id: mongoose.Types.ObjectId(user._id).toString(), role: user.roleId.toString() },
    env.get('JWT_SECRET').required().asString(),
    {
      algorithm: 'HS512',
      expiresIn: env.get('JWT_EXPIRES_IN').required().asString(),
      audience: env.get('JWT_AUDIENCE').required().asString(),
      issuer: env.get('JWT_ISSUER').required().asString(),
    },
  );
};

module.exports = { login };
