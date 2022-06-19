import Client from '../client/client';

export const createVideoService = (
  title,
  originalTitle,
  originURL,
  thumbnailURL,
  description,
  channelTitle,
  duration,
  defaultLanguage,
  dataType,
  topics,
) =>
  Client({
    method: 'POST',
    url: `video`,
    data: {
      title,
      originalTitle,
      originURL,
      thumbnail: { url: thumbnailURL },
      description,
      channelTitle,
      duration,
      defaultLanguage,
      dataType,
      topics,
    },
  });

export const updateVideoService = (editedVideoId, title, originalTitle, description, channelTitle, dataType, topics) =>
  Client({
    method: 'PATCH',
    url: `video/${editedVideoId}`,
    data: {
      title,
      originalTitle,
      description,
      channelTitle,
      dataType,
      topics,
    },
  });

export const getInfoFromYoutubeAPIService = (URL) =>
  Client({
    method: 'POST',
    url: `video/info`,
    data: {
      videoUrl: URL,
    },
  });
