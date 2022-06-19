import Client from '../client/client';

export const getAllVideosService = (page = 0, size = 1000, title = null, topic = null, dataType = null) =>
  Client({
    method: 'GET',
    url: `videos`,
    params: {
      page,
      size,
      title,
      topic,
      dataType,
    },
  });

export const getVideoService = (videoId) =>
  Client({
    method: 'GET',
    url: `video/${videoId}`,
  });

export const remove = (videoId) =>
  Client({
    method: 'DELETE',
    url: `video/${videoId}`,
  });
