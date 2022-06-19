'use strict';

const mongoose = require('mongoose');

const videoTopicSchema = new mongoose.Schema(
  {
    videoId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'videoId',
    },

    topicId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'topicId',
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model('VideoTopic', videoTopicSchema, 'videoTopic');
