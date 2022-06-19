import React from 'react';

import { Badge, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

import { convertVideoTime } from 'utils/convertVideoTime';

const VideoItemHomePage = (props) => {
  const { video, className } = props;

  const navigate = useNavigate();
  //TODO: NEED TO BE UPDATED BY COMPONENT FOR RELATED VIDEOS

  return (
    <div className={className} key={`topic-${video._id}`}>
      <Card className="topic__card" onClick={() => navigate(`/watch/${video._id}`)}>
        <div className="topic__container">
          <Card.Img variant="top" className="topic__card-img" src={video.thumbnail.url} />
          <div className="topic__video-Language">{video.defaultLanguage}</div>
          <div className="topic__video-Time">{convertVideoTime(video.duration)}</div>
        </div>
        <Card.Title className="topic__title">{video.title}</Card.Title>
        <div>
          <Badge pill bg="primary" className="topic__card-topic">
            {video.dataType}
          </Badge>
        </div>
      </Card>
    </div>
  );
};

export default VideoItemHomePage;
