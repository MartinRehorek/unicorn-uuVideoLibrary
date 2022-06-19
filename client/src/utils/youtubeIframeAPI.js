const youtubeIframeAPISrc = 'https://www.youtube.com/iframe_api';
const youtubeIframeAPIScriptId = 'youtube-iframe-api';

export const isYoutubeIframeLoaded = () => document.getElementById(youtubeIframeAPIScriptId);

export const loadYoutubeIframeApi = (onYouTubeIframeAPIReady) => {
  const tag = document.createElement('script');

  tag.src = youtubeIframeAPISrc;
  tag.id = youtubeIframeAPIScriptId;

  const firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

  window.onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;
};

export const loadYoutubePlayer = (playerID, options) => new window.YT.Player(playerID, options);
