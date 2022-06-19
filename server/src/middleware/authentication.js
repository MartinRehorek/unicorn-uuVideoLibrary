// TODO: create it dynamic with middleware params and switch cases

'use strict';

const jwt = require('jsonwebtoken');
const env = require('env-var');

const { getRole } = require('../services/role-service');
const { getVideo } = require('../services/video-service');
const { getDocument } = require('../services/document-service');

const { NotAuthorizedError } = require('../utils/errors');
const { ROLE } = require('../utils/constants');

/**
 * Check if JWT token agree with JWT secret key
 * @param {authorization} req
 * @param {none} res
 * @param {next step} next
 */
const checkJwt = (req, res, next) => {
  if (req.headers?.authorization?.split(' ')?.length === 2) {
    const token = req.headers.authorization.split(' ')[1];

    if (!token) throw new NotAuthorizedError();

    jwt.verify(token, env.get('JWT_SECRET').required().asString(), (err) => {
      if (err) throw new NotAuthorizedError();

      next();
    });
  } else {
    const token = req.headers.authorization;

    if (!token) throw new NotAuthorizedError();

    jwt.verify(token, env.get('JWT_SECRET').required().asString(), (err) => {
      if (err) throw new NotAuthorizedError();

      next();
    });
  }
};

/**
 * Check if user is Admin role
 * @param {authorization} req
 * @param {none} res
 * @param {next step} next
 */
const isAdmin = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization.split(' ')?.length === 2) token = req.headers.authorization.split(' ')[1];
    else token = req.headers.authorization;

    const decoded = jwt.verify(token, env.get('JWT_SECRET').required().asString());
    const role = await getRole(decoded.role, undefined);

    if (role.name !== ROLE.admin) throw new NotAuthorizedError();
    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Check if is admin or has auth
 * @param {authorization} req
 * @param {none} res
 * @param {next step} next
 */
const samePerson = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization.split(' ')?.length === 2) token = req.headers.authorization.split(' ')[1];
    else token = req.headers.authorization;

    const { userId } = req.params;
    const { role } = req.body;

    const decoded = jwt.verify(token, env.get('JWT_SECRET').required().asString());
    const roleModel = await getRole(decoded.role, undefined);

    if ((role && roleModel.name === ROLE.admin && decoded.id === userId) || roleModel.name === ROLE.admin) next();
    else throw new NotAuthorizedError();
  } catch (error) {
    next(error);
  }
};

/**
 * Check if user is video  owner
 * @param {authorization} req
 * @param {none} res
 * @param {next step} next
 */
const videoOwner = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization.split(' ')?.length === 2) token = req.headers.authorization.split(' ')[1];
    else token = req.headers.authorization;

    const { videoId } = req.params;

    const decoded = jwt.verify(token, env.get('JWT_SECRET').required().asString());
    const video = await getVideo(videoId);
    const roleModel = await getRole(decoded.role, undefined);

    if (decoded.id === video.user._id || roleModel.name === ROLE.admin) next();
    else throw new NotAuthorizedError();
  } catch (error) {
    next(error);
  }
};

/**
 * Check if user is document owner
 * @param {authorization} req
 * @param {none} res
 * @param {next step} next
 */
const documentOwner = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization.split(' ')?.length === 2) token = req.headers.authorization.split(' ')[1];
    else token = req.headers.authorization;

    const { documentId } = req.params;

    const decoded = jwt.verify(token, env.get('JWT_SECRET').required().asString());
    const document = await getDocument(documentId);
    const video = await getVideo(document.videoId);
    const roleModel = await getRole(decoded.role, undefined);

    if (decoded.id === video.user._id || roleModel.name === ROLE.admin) next();
    else throw new NotAuthorizedError();
  } catch (error) {
    next(error);
  }
};

const accessRights = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization.split(' ')?.length === 2)
      token = req.headers.authorization ? req.headers.authorization.split(' ')[1] : '';
    else token = req.headers.authorization;

    const decoded = jwt.verify(token, env.get('JWT_SECRET').required().asString());
    const roleModel = await getRole(decoded.role, undefined);

    if (roleModel.name === ROLE.admin) next();
    else throw new NotAuthorizedError();
  } catch (error) {
    next(error);
  }
};

module.exports = { checkJwt, isAdmin, samePerson, videoOwner, documentOwner, accessRights };
