import React from 'react';
import { Badge } from 'react-bootstrap';

const Item = ({ tags, title, description }) => {
  const printTags = [];
  for (let tag of tags) {
    let tagClass = 'secondary';
    if (tag.isPrimary) tagClass = 'primary';
    printTags.push(<Badge bg={tagClass}>{tag.name}</Badge>);
  }

  return (
    <div className="item-wrapper">
      {/* <img src={image1} alt="" className="item-teaser-img" /> */}
      <div className="item-content">
        <h1 className="video-title">{title}</h1>
        <div className="item-tags">{printTags}</div>
        <p>{description}</p>
      </div>
    </div>
  );
};

export default Item;
