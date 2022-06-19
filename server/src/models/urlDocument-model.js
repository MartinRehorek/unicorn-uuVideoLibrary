'use strict';

const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const urlDocumentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      maxlength: 30,
      minlength: 4,
      trim: true,
    },
    urlLink: {
      type: String,
      required: true,
      trim: true,
    },
    videoId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'videoId',
    },
  },
  { timestamps: true },
);

urlDocumentSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('UrlDocument', urlDocumentSchema, 'urlDocument');
