import React, { useState } from 'react';
import { remove } from 'services/video/video';
import { Tooltip, OverlayTrigger, Spinner } from 'react-bootstrap';
import {useNavigate} from 'react-router-dom';

const RemoveItem = ({ id }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const removeVideo = (videoId) => {
    setLoading(true);
    remove(videoId)
      .then((response) => navigate('/'),
      ).catch((e) => {
      setLoading(false);
      console.log(e);
    })
  }

  return !loading ? <OverlayTrigger
    key={'remove-video'}
    placement={'left'}
    overlay={
      <Tooltip id={`remove-video`}>
        Odstranit video
      </Tooltip>
    }
  ><i onClick={() => removeVideo(id)} className="fa-solid fa-trash-can video__single-actions-remove"></i>
  </OverlayTrigger> : <Spinner animation="border" size="sm"/>
}

export default RemoveItem;
