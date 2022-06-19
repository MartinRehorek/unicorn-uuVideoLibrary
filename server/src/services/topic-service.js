'use strict';

const Topic = require('../models/topic-model');

const { ConflictError, NotFoundError } = require('../utils/errors');

/**
 * Create new topic
 * @param {Object} data
 * @returns {Boolean} True
 */
const createTopic = async (data) => {
  const topicExists = await Topic.exists({ name: data.name });

  if (topicExists) {
    throw new ConflictError('Topic exists');
  }

  const topic = new Topic(data);

  await topic.save();

  return true;
};

/**
 * Get one topic depends on id
 * @param {String} topicId
 * @returns {Object } topic
 */
const getTopic = async (topicId) => {
  const topic = await Topic.findOne({ _id: topicId })
    .lean()
    .populate({ path: 'video', populate: { path: 'videoId', model: 'Video' } });

  if (!topic) throw new NotFoundError("Topic doesn't exists");

  return topic;
};

/**
 * Get all topics
 * @returns {Array[Object]} topics
 */
const allTopics = async (queryParameters) => {
  const { limit, offset, condition } = queryParameters;

  let options = {
    offset,
    limit,
    lean: true,
  };

  const topics = await Topic.paginate({ condition }, options);

  return topics;
};

/**
 * Get all topics with related videos
 * @returns {Array[Object]} topics
 */
const allTopicsVideos = async (queryParameters) => {
  const { limit, offset, condition } = queryParameters;

  let options = {
    offset,
    limit,
    lean: true,
    populate: [
      {
        path: 'video',
        populate: {
          path: 'videoId',
          model: 'Video',
        },
      },
    ],
  };

  const topics = await Topic.paginate({ condition }, options);

  return topics;
};

/**
 * Update topic
 * @param {String} topicId
 * @param {Object} data
 * @returns
 */
const updateTopic = async (topicId, data) => {
  await getTopic(topicId);

  const filter = { _id: topicId };
  const update = data;
  const opts = { new: true };

  const topic = await Topic.findOneAndUpdate(filter, update, opts);

  return topic;
};

/**
 * Hard topic Delete
 * @param {String} topicId
 * @returns delete count status
 */
const deleteTopic = async (topicId) => {
  const topic = await getTopic(topicId);

  if (!topic) throw new NotFoundError("Topic doesn't exists");

  return await Topic.deleteOne({ name: topic.name });
};

module.exports = { createTopic, allTopics, allTopicsVideos, getTopic, updateTopic, deleteTopic };
