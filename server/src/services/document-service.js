'use strict';

const UrlDocument = require('../models/urlDocument-model');

const { getVideo } = require('../services/video-service');

const { ConflictError, NotFoundError } = require('../utils/errors');

/**
 * Create new document
 * @param {Object} data
 * @returns {Boolean} True
 */
const createDocument = async (data) => {
  const video = await getVideo(data.videoId);
  if (!video) throw new NotFoundError("Video doesn't exists");

  const documentExists = await UrlDocument.exists({ name: data.name });
  if (documentExists) {
    throw new ConflictError('Document exists');
  }

  const document = new UrlDocument(data);

  await document.save();

  return true;
};

/**
 * Get one document depends on id
 * @param {String} documentId
 * @returns {Object } document
 */
const getDocument = async (documentId) => {
  const document = await UrlDocument.findOne({ _id: documentId }).lean();

  if (!document) throw new NotFoundError("Document doesn't exists");

  return document;
};

/**
 * Get all documents
 * @returns {Array[Object]} documents
 */
const allDocuments = async (queryParameters) => {

  const { limit, offset, condition } = queryParameters;

  let options = {
    offset,
    limit,
    lean: true
  };

  const documents = await UrlDocument.paginate(condition, options);

  return documents;
};

/**
 * Get all documents related with video
 * @returns {Array[Object]} documents
 */
const allVideoDocuments = async (videoId, queryParameters) => {
  // if video doesnt exist? maybe return 404 not found
  const { limit, offset, condition } = queryParameters;

  let options = {
    offset,
    limit,
    lean: true
  };

  const documents = await UrlDocument.paginate({ ...condition, videoId }, options);

  return documents;
};

/**
 * Update document
 * @param {String} documentId
 * @param {Object} data
 * @returns
 */
const updateDocument = async (documentId, data) => {
  const filter = { _id: documentId };
  const update = data;
  const opts = { new: true };

  const document = await UrlDocument.findOneAndUpdate(filter, update, opts);

  return document;
};

/**
 * Hard document Delete
 * @param {String} documentId
 * @returns delete count status
 */
const deleteDocument = async (documentId) => {
  const document = await getDocument(documentId);

  if (!document) throw new NotFoundError("Document doesn't exists");

  return await UrlDocument.deleteOne({ _id: document._id });
};

module.exports = { createDocument, allDocuments, allVideoDocuments, getDocument, updateDocument, deleteDocument };
