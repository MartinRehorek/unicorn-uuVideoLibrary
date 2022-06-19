import React from 'react';

import { Badge, Row, Col } from 'react-bootstrap';
import { convertVideoTime } from '../../utils/convertVideoTime';
import { useNavigate } from 'react-router-dom';
import {shortenText} from "../../utils/shortenText";

const VideoItem = (props) => {
  const { item } = props;
  const navigate = useNavigate();

  return (
    <div className="video__item mt-2">
      <Row>
        <Col xs={5} sm={4} md={3} md={5}>
          <div className="video__item-thumbnail-wrapper" onClick={() => navigate(`/watch/${item._id}`)}>
            <img className="video__item-thumbnail" src={item.thumbnail.url} onClick={() => navigate(``)} />
            <span className="video__item-thumbnail-time">{convertVideoTime(item.duration)}</span>
          </div>
        </Col>

        <Col xs={7} sm={8} md={9} md={7}>
          <h6 className="video__item-title" onClick={() => navigate(`/watch/${item._id}`)}>
            {shortenText(item.title, 30)}
          </h6>
          <div className={"topic__video-desc"}>
            {shortenText(item.description, 45)}
          </div>
          <Badge className={'video__datatype me-1'}>{item.dataType}</Badge>
          {item.topic.map((tag, index) => (
            <Badge
              className={'video__topic'}
              key={`badge-${index}`}
              onClick={() => navigate(`/topic/${tag.topicId._id}`)}
              bg="secondary">
              {tag.topicId.name}
            </Badge>
          ))}
        </Col>
      </Row>
    </div>
  );
};

export default VideoItem;
