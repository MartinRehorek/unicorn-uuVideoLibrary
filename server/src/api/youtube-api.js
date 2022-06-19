const env = require('env-var');
const { createYouTubeAPI } = require('./api');

/**
 * getLocation() take data from address based on SwissTopo API
 * @param {String} videoId
 * @return {Object} response
 */
const getVideoInformation = async (videoId) => {
  return createYouTubeAPI().get(
    `videos?part=snippet,contentDetails,statistics,status&id=${videoId}&key=${env
      .get('YOUTUBE_API')
      .required()
      .asString()}`,
  );
};

module.exports = getVideoInformation;
