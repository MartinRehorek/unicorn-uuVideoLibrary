'use strict';

const UserVideo = require('../models/userVideo-model');

const { ConflictError, NotFoundError } = require('../utils/errors');

/**
 * Create new favorite video
 * @param {Object} data
 * @returns {Boolean} True
 */
const createFavoriteVideo = async (userId, videoId) => {
  const favoriteExists = await UserVideo.exists({ userId, videoId });

  if (favoriteExists) {
    throw new ConflictError('Favorite video exists for user');
  }

  const data = {
    userId,
    videoId,
    favorite: true,
  };
  const favorite = new UserVideo(data);
  await favorite.save();

  return true;
};

/**
 * Get all favorite videos
 * @returns {Array[Object]} favorites
 */
const allFavoriteVideos = async (queryParameters) => {

  const { limit, offset, condition } = queryParameters;

  let options = {
    offset,
    limit,
    lean: true,
    populate: [
      {'path': 'videos'},
    ]
  };

  const favorites = await UserVideo.paginate({ condition }, options);

  return favorites;
};

/**
 * Get all favorite for user
 * @param {String} userId
 * @returns {Array[Object]} favorites
 */
const allFavoriteUserVideos = async (userId, queryParameters) => {

  const { limit, offset, condition } = queryParameters;

  let options = {
    offset,
    limit,
    lean: true,
    populate: [
      {'path': 'videos'},
    ]
  };
  const favorites = await UserVideo.paginate({ ...condition, userId }, options);

  return favorites;
};

/**
 * Get one favorite video depends on id
 * @param {String} userId
 * @param {String} videoId
 * @returns {Object } favorite
 */
const getFavoriteVideo = async (userId, videoId) => {
  const favorite = await UserVideo.findOne({ userId, videoId }).lean().populate({ path: 'videos' });

  if (!favorite) throw new NotFoundError("Favorite video doesn't exists");

  return favorite;
};

/**
 * Hard favorite video Delete
 * @param {String} userId
 * @param {String} videoId
 * @returns delete count status
 */
const deleteFavoriteVideo = async (userId, videoId) => {
  const favorite = await getFavoriteVideo(userId, videoId);

  if (!favorite) throw new NotFoundError("Favorite video doesn't exists");

  return await UserVideo.deleteOne({ userId, videoId });
};

module.exports = {
  createFavoriteVideo,
  allFavoriteVideos,
  allFavoriteUserVideos,
  getFavoriteVideo,
  deleteFavoriteVideo,
};
