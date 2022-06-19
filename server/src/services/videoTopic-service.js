'use strict';

const VideoTopic = require('../models/videoTopic-model');
const Topic = require('../models/topic-model');
const Video = require('../models/video-model');

const { ConflictError } = require('../utils/errors');

/**
 * Create new video topic
 * @param {Array[String]} data
 * @returns {Boolean} True
 */
const createVideoTopic = async (data) => {
  const existsTopic = await Topic.findOne({ _id: data.topics }).lean();
  if (!existsTopic) {
    await Video.deleteOne({ _id: data.videoId });
    throw new ConflictError("Cannot create video because topic doesn't exists.");
  }
  const videoTopic = new VideoTopic({ videoId: data.videoId, topicId: data.topics });
  await videoTopic.save();

  // TODO: for more then one topic
  // await Promise.all(
  //   data.topics.map(async (topic) => {
  //     const existsTopic = await Topic.findOne({ _id: topic }).lean();
  //     if (!existsTopic) {
  //       await Video.deleteOne({ _id: data.videoId });
  //       throw new ConflictError("Cannot create video because topic doesn't exists.");
  //     }
  //     const videoTopic = new VideoTopic({ videoId: data.videoId, topicId: topic });
  //     await videoTopic.save();
  //   }),
  // );
};

/**
 * Update Video topic
 * @param {Object} data
 * @returns
 */
const updateVideoTopic = async (data) => {
  const oldVideoTopics = await VideoTopic.find({ videoId: data.videoId }).lean();

  await Promise.all(
    oldVideoTopics.map(async (topic) => {
      return await VideoTopic.deleteOne({ _id: topic._id });
    }),
  );

  /* eslint-disable */
  await deleteVideoTopic(data.videoId);
  /* eslint-enable */

  // await Promise.all(
  //   data.topics.map(async (topic) => {
  //     const videoTopic = new VideoTopic({ videoId: data.videoId, topicId: topic });
  //     await videoTopic.save();
  //   }),
  // );

  const videoTopic = new VideoTopic({ videoId: data.videoId, topicId: data.topics });
  await videoTopic.save();

  return true;
};

/**
 * Delete all video topics related to videoId
 * @param {String} videoId
 * @returns
 */
const deleteVideoTopic = async (videoId) => {
  const videoTopics = await VideoTopic.find({ videoId }).lean();

  await Promise.all(
    videoTopics.map(async (topic) => {
      return await VideoTopic.deleteOne({ _id: topic._id });
    }),
  );

  return true;
};

module.exports = { createVideoTopic, updateVideoTopic, deleteVideoTopic };
