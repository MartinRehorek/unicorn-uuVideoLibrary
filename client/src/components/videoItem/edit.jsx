import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Tooltip, OverlayTrigger } from 'react-bootstrap';

const EditItem = ({ id, videoData }) => {
  const navigate = useNavigate();

  return (
    <OverlayTrigger key={'edit-video'} placement={'left'} overlay={<Tooltip id={`edit-video`}>Upravit obsah</Tooltip>}>
      <i
        className={'fa fa-edit me-4 video__single-actions-edit'}
        onClick={() => navigate(`/video/edit/${id}`, { state: videoData })}></i>
    </OverlayTrigger>
  );
};

export default EditItem;
