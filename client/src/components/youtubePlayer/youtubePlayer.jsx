import React, { useEffect, useState } from 'react';

import { isYoutubeIframeLoaded, loadYoutubeIframeApi, loadYoutubePlayer } from 'utils/youtubeIframeAPI';
import Placeholder from '../placeholder/placeholder';

const YoutubePlayer = (props) => {
  const { videoId, className } = props;
  const playerId = `video-${videoId}`;
  const [playerReady, setPlayerReady] = useState(false);
  const [isApiReady, setApiReady] = useState(false);

  const onPlayerReady = () => {
    setPlayerReady(true);
  };

  useEffect(() => {
    if (isApiReady) {
      loadYoutubePlayer(playerId, {
        width: '100%',
        height: '100%',
        videoId,
        playerVars: {
          playsinline: 1,
          rel: 0,
        },
        events: {
          onReady: onPlayerReady,
        },
      });
    }
  }, [isApiReady]);

  useEffect(() => {
    if (!isYoutubeIframeLoaded()) {
      loadYoutubeIframeApi(() => setApiReady(true));
    } else {
      setApiReady(true);
    }

    return () => setApiReady(false);
  }, []);

  return (
    <div className={`video__player ${className && className}`}>
      {!playerReady && <Placeholder className="video__player-placeholder" />}
      <div id={playerId}></div>
    </div>
  );
};

export default YoutubePlayer;
