import Client from '../client/client';

export const get = (topicId) =>
  Client({
    method: 'GET',
    url: `topic/${topicId}`,
  });

export const getAllTopicsService = (page = 0, size = 100) =>
  Client({
    method: 'GET',
    url: `topics`,
    params: {
      page,
      size,
    },
  });

export const createTopicService = (
  name,
  color = '#808080',
  thumbnailURL = 'https://www.inboundwriter.com/wp-content/uploads/2019/08/topic_mobile_header.png',
) =>
  Client({
    method: 'POST',
    url: `topic`,
    data: {
      name,
      color,
      thumbnail: {
        url: thumbnailURL,
      },
    },
  });

export const removeTopicsService = (topicId) =>
  Client({
    method: 'DELETE',
    url: `topic/${topicId}`,
  });
