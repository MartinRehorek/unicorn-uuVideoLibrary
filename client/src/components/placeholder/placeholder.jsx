import React from 'react';

const Placeholder = (props) => {
  const { className } = props;

  return <div className={`placeholder__animated-bg ${className && className}`}></div>;
};

export default Placeholder;
