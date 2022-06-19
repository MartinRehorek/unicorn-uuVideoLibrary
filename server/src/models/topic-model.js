'use strict';

const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const topicSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      maxlength: 50,
      minlength: 4,
      trim: true,
      unique: true,
    },
    color: {
      type: String,
      required: true,
      maxlength: 7,
      minlength: 4,
    },
    thumbnail: {
      url: {
        type: String,
        required: true,
      },
      width: {
        type: Number,
      },
      height: {
        type: Number,
      },
    },
  },
  { timestamps: true },
);

topicSchema.plugin(mongoosePaginate);

topicSchema.virtual('video', {
  ref: 'VideoTopic',
  localField: '_id',
  foreignField: 'topicId',
});

topicSchema.set('toObject', {
  virtuals: true,
});
topicSchema.set('toJSON', {
  virtuals: true,
});

module.exports = mongoose.model('Topic', topicSchema, 'topic');
