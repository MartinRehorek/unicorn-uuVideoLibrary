import React from 'react';
import { Badge, Card, Col } from 'react-bootstrap';
import { convertVideoTime } from '../../utils/convertVideoTime';
import { useNavigate } from 'react-router-dom';
import { shortenText } from '../../utils/shortenText';
import { useAuth } from '../../utils/hooks/useAuth';
import SetFavorite from '../setFavorite/setFavorite';

const TopicItem = (props) => {
  const { video, ...rest } = props;
  const navigate = useNavigate();
  const { authenticated } = useAuth();

  return (
    video && (
      <Col key={`topic-${video._id}`} {...rest}>
        <Card className="topic__card">
          <div className="topic__container">
            <Card.Img
              variant="top"
              className="topic__card-img"
              src={video.thumbnail?.url}
              onClick={() => navigate(`/watch/${video._id}`)}
            />
            <div className="topic__video-Language">{video.defaultLanguage}</div>
            <div className="topic__video-Time">{convertVideoTime(video.duration)}</div>
            {authenticated && (
              <SetFavorite size={'sm'} className="topic__video-favorites" id={video._id} showLabel={false} />
            )}
          </div>
          <Card.Title className="topic__title" onClick={() => navigate(`/watch/${video._id}`)}>
            {video.title}
          </Card.Title>
          <div className={'topic__video-desc'}>{shortenText(video.description, 75)}</div>
          <div className={'topic__video-topics'}>
            <Badge bg="primary" className="topic__card-topic me-1">
              {video.dataType}
            </Badge>
            {video?.topic &&
              video.topic.map((tag, index) => (
                <Badge
                  className={'video__topic'}
                  key={`badge-${index}`}
                  onClick={() => navigate(`/topic/${tag.topicId._id}`)}
                  bg="secondary">
                  {tag.topicId.name}
                </Badge>
              ))}
          </div>
        </Card>
      </Col>
    )
  );
};

export default TopicItem;
