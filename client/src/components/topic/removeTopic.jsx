import React, { useState } from 'react';
import { Tooltip, OverlayTrigger, Spinner } from 'react-bootstrap';

import { removeTopicsService } from 'services/topic/topic';

const RemoveTopic = ({ id, onHandleDeleteTopic }) => {
  const [loading, setLoading] = useState(false);

  const removeTopic = (topicId) => {
    setLoading(true);
    removeTopicsService(topicId)
      .then(() => {
        onHandleDeleteTopic(topicId);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  return !loading ? (
    <OverlayTrigger
      key={'remove-video'}
      placement={'left'}
      overlay={<Tooltip id={`remove-video`}>Odstranit topic</Tooltip>}>
      <i onClick={() => removeTopic(id)} className="fa-solid fa-trash-can video__single-actions-remove"></i>
    </OverlayTrigger>
  ) : (
    <Spinner animation="border" size="sm" />
  );
};

export default RemoveTopic;
