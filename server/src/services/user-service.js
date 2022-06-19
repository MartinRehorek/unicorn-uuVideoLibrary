'use strict';

const env = require('env-var');
const jwt = require('jsonwebtoken');

const User = require('../models/user-model');

const { getRole } = require('./role-service');

const { ConflictError, NotFoundError, ForbiddenError } = require('../utils/errors');

/**
 * Create new user
 * @param {Object} data
 * @returns {Boolean} True
 */
const createUser = async (data) => {
  const userExists = await User.exists({ username: data.username });

  if (userExists) {
    throw new ConflictError('User exists');
  }

  const role = await getRole(undefined, data.role);

  const newUserObject = { username: data.username, password: data.password, roleId: role._id, email: data.email };

  const user = new User(newUserObject);

  await user.save();

  return true;
};

/**
 * Get one user depends on id
 * @param {String} userId
 * @returns {Object } user
 */
const getUser = async (userId) => {
  const user = await User.findOne({ _id: userId })
    .lean()
    .populate([{ path: 'role' }, { path: 'favorite', populate: { path: 'videoId', model: 'Video' } }]);

  if (!user) throw new NotFoundError("User doesn't exists");

  delete user.roleId;

  return user;
};

/**
 * Get current logged user
 * @param {String} token
 * @returns {Object} user
 */
const currentUser = async (token) => {
  const decoded = jwt.verify(token, env.get('JWT_SECRET').required().asString());
  const user = await getUser(decoded.id);

  return user;
};

/**
 * Get all users
 * @returns {Array[Object]} users
 */
const allUsers = async (queryParameters) => {
  const { limit, offset, condition } = queryParameters;

  let options = {
    offset,
    limit,
    lean: true,
    populate: [{ path: 'role' }],
  };

  const users = await User.paginate({ condition }, options);

  return users;
};

/**
 * Update user
 * @param {String} userId
 * @param {Object} data
 * @returns
 */
const updateUser = async (userId, data) => {
  let newData;

  if (data?.role) {
    const role = await getRole(undefined, data.role);

    delete data.role;

    newData = {
      ...data,
      roleId: role._id,
    };
  } else {
    newData = data;
  }

  const filter = { _id: userId };
  const update = newData;
  const opts = { new: true };

  const user = await User.findOneAndUpdate(filter, update, opts);

  return user;
};

/**
 * Hard user Delete
 * @param {String} userId
 * @param {String}} token
 * @returns delete count status
 */
const deleteUser = async (userId, token) => {
  const user = await getUser(userId);

  if (!user) throw new NotFoundError("User doesn't exists");

  const decoded = jwt.verify(token, env.get('JWT_SECRET').required().asString());

  // The user cannot delete himself
  if (user._id === decoded.id) throw new ForbiddenError();

  await User.deleteOne({ username: user.username });

  return true;
};

module.exports = { createUser, currentUser, allUsers, getUser, updateUser, deleteUser };
