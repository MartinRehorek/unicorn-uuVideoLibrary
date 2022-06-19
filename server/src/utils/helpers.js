/**
 * Check if string is hexColor base standard
 * @param {String} value
 * @returns Boolean
 */
const hexColorChecker = (value) => {
  const reg = /^#([0-9a-f]{3}){1,2}$/i;
  return reg.test(value);
};

/**
 * Check if URL is valid YouTube link
 * @param {String} url
 * @returns {Boolean}
 */
const validateYouTubeUrl = (url) => {
  if (url.includes('www.youtube.com')) return true;
  else return false;
};

/**
 * Check if string is valid URL link
 */
/* eslint-disable */
const stringIsAValidUrl = (s, protocols) => {
  try {
    const url = new URL(s);
    return protocols
      ? url.protocol
        ? protocols.map((x) => `${x.toLowerCase()}:`).includes(url.protocol)
        : false
      : true;
  } catch (err) {
    return false;
  }
};
/* eslint-enable */

/**
 * Get YouTube ID from various YouTube URL
 * @param {String} url
 * @returns {String} id
 */
/* eslint-disable  */
const youTubeGetID = (url) => {
  let ID = '';
  url = url.replace(/(>|<)/gi, '').split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
  if (url[2] !== undefined) {
    ID = url[2].split(/[^0-9a-z_\-]/i);
    ID = ID[0];
  } else {
    ID = url;
  }
  return ID;
};
/* eslint-enable  */

module.exports = {
  hexColorChecker,
  validateYouTubeUrl,
  stringIsAValidUrl,
  youTubeGetID,
};
