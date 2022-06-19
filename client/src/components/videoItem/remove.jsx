import React, { useState } from 'react';
import { Tooltip, OverlayTrigger, Spinner } from 'react-bootstrap';

import { remove } from 'services/video/video';
import { Navigate } from 'react-router-dom';

const RemoveVideo = ({ id }) => {
  const [loading, setLoading] = useState(false);

  const removeVideo = (videoId) => {
    setLoading(true);
    remove(videoId)
      .then(() => <Navigate to={'/'} />)
      .catch(() => {
        setLoading(false);
      });
  };

  return !loading ? (
    <OverlayTrigger
      key={'remove-video'}
      placement={'left'}
      overlay={<Tooltip id={`remove-video`}>Odstranit obsah</Tooltip>}>
      <i onClick={() => removeVideo(id)} className="fa-solid fa-trash-can video__single-actions-remove"></i>
    </OverlayTrigger>
  ) : (
    <Spinner animation="border" size="sm" />
  );
};

export default RemoveVideo;
