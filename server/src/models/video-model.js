'use strict';

const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const videoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      maxlength: 200,
      minlength: 4,
      trim: true,
    },
    originalTitle: {
      type: String,
    },
    originURL: {
      type: String,
    },
    thumbnail: {
      url: {
        type: String,
      },
      width: {
        type: Number,
      },
      height: {
        type: Number,
      },
    },
    description: {
      type: String,
      trim: true,
      required: true,
    },
    channelTitle: {
      type: String,
      trim: true,
    },
    duration: {
      type: String,
      required: true,
    },
    defaultLanguage: {
      type: String,
      minlength: 2,
      maxlength: 5,
      required: true,
    },
    dataType: {
        type: String,
        enum: ["Video", "Podcast"],
        required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'userId',
      required: true,
      select: true,
    },
  },
  { timestamps: true },
);

videoSchema.plugin(mongoosePaginate);

videoSchema.virtual('user', {
  ref: 'User',
  localField: 'userId',
  foreignField: '_id',
  justOne: true,
});

videoSchema.virtual('document', {
  ref: 'UrlDocument',
  localField: '_id',
  foreignField: 'videoId',
});

videoSchema.virtual('topic', {
  ref: 'VideoTopic',
  localField: '_id',
  foreignField: 'videoId',
});

videoSchema.set('toObject', {
  virtuals: true,
});
videoSchema.set('toJSON', {
  virtuals: true,
});

module.exports = mongoose.model('Video', videoSchema, 'video');