import React from 'react';
import { useParams, useLocation } from 'react-router-dom';

import VideoForm from 'components/forms/videoForm';
import NotFoundComponent from 'components/notFound/notFoundComponent';

const VideoCreation = () => {
  const { video } = useParams();
  const { state } = useLocation();

  if (!video) return <NotFoundComponent />;

  return <VideoForm videoData={state} edit={true} />;
};

export default VideoCreation;
