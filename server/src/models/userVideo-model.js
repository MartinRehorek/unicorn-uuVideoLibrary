'use strict';

const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const userVideoSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'userId',
      required: true,
    },
    videoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'videoId',
      required: true,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

userVideoSchema.plugin(mongoosePaginate);

userVideoSchema.virtual('videos', {
  ref: 'Video',
  localField: 'videoId',
  foreignField: '_id',
});

userVideoSchema.set('toObject', {
  virtuals: true,
});
userVideoSchema.set('toJSON', {
  virtuals: true,
});

module.exports = mongoose.model('UserVideo', userVideoSchema, 'userVideo');
