const axios = require('axios');
const env = require('env-var');

/**
 * Create global connection
 */
const createYouTubeAPI = () => {
  const baseUrl = env.get('YOUTUBE_URI').required().asUrlString();

  return axios.create({
    baseURL: baseUrl,
    timeout: 6000,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

module.exports = { createYouTubeAPI };
