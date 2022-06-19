'use strict';

const getVideoInformation = require('../api/youtube-api');
const Video = require('../models/video-model');

const { createVideoTopic, updateVideoTopic, deleteVideoTopic } = require('./videoTopic-service');

const { ConflictError, NotFoundError } = require('../utils/errors');

// TODO: implement language checker
const setVideLanguage = (data) => {
  if (data && data.defaultAudioLanguage === 'zxx') return data.defaultLanguage;
  else return data.defaultAudioLanguage;
};

/**
 * Get information about YouTube video from Youtube Link depends Video ID
 * @param {String} videoUrl
 * @returns {Boolean} True
 */
const getVideoInfo = async (videoId, videoUrl) => {
  const videoData = await getVideoInformation(videoId);
  const videoItems = videoData.data.items[0];

  return {
    videoTitle: videoItems.snippet.title,
    videoDescription: videoItems.snippet?.description,
    videoThumbnails: videoItems.snippet?.thumbnails?.standard
      ? videoItems.snippet?.thumbnails?.standard
      : videoItems.snippet?.thumbnails?.default,
    videoChannelTitle: videoItems.snippet.channelTitle,
    videoDefaultLanguage: setVideLanguage(videoItems.snippet),
    videoDuration: videoItems.contentDetails.duration,
    originalUrl: videoUrl,
  };
};

/**
 * Create video
 * @param {Object} data
 * @returns {Boolean} True
 */
const createVideo = async (data) => {
  const videoExists = await Video.exists({ title: data.title });

  if (videoExists) {
    throw new ConflictError('Video exists');
  }

  const video = new Video(data);
  await video.save();

  const topicData = {
    videoId: video.id,
    topics: data.topics,
  };

  await createVideoTopic(topicData);

  return video;
};

/**
 * Get all Videos with dependencies
 * @returns {Array[Object]} videos
 */
const allVideos = async (queryParameters) => {
  const { limit, offset, condition } = queryParameters;
  let options = {
    offset,
    limit,
    lean: true,
    populate: [
      { path: 'user' },
      {
        path: 'topic',
        populate: {
          path: 'topicId',
          model: 'Topic',
        },
      },
      { path: 'document' },
    ],
  };

  const videos = await Video.paginate(condition, options);

  return videos;
};

/**
 * Get all User Videos with dependencies
 * @returns {Array[Object]} videos
 */
const userVideos = async (userId, queryParameters) => {
  const { limit, offset, condition } = queryParameters;

  let options = {
    offset,
    limit,
    lean: true,
    populate: [
      { path: 'user' },
      {
        path: 'topic',
        populate: {
          path: 'topicId',
          model: 'Topic',
        },
      },
      { path: 'document' },
    ],
  };

  const videos = await Video.paginate({ ...condition, userId }, options);

  return videos;
};

/**
 * Get one video depends on id with dependencies
 * @param {String} videoId
 * @returns {Object } video
 */
const getVideo = async (videoId) => {
  const video = await Video.findOne({ _id: videoId })
    .lean()
    .populate([
      { path: 'user' },
      { path: 'topic', populate: { path: 'topicId', model: 'Topic' } },
      { path: 'document' },
    ]);

  if (!video) throw new NotFoundError("Video doesn't exists");

  return video;
};

/**
 * Update video
 * @param {String} videoId
 * @param {Object} data
 * @returns
 */
const updateVideo = async (videoId, data) => {
  if (data.topics) {
    const topicData = {
      videoId,
      topics: data.topics,
    };

    await updateVideoTopic(topicData);

    delete data.topics;
  }

  const filter = { _id: videoId };
  const update = data;
  const opts = { new: true };

  const video = await Video.findOneAndUpdate(filter, update, opts);

  return video;
};

/**
 * Delete video with dependencies
 * @param {String} videoId
 * @returns {Boolean}
 */
const deleteVideo = async (videoId) => {
  const video = await getVideo(videoId);

  if (!video) throw new NotFoundError("Video doesn't exists");

  await Video.deleteOne({ _id: videoId });

  await deleteVideoTopic(videoId);

  return true;
};

module.exports = { getVideoInfo, createVideo, allVideos, userVideos, getVideo, updateVideo, deleteVideo };
