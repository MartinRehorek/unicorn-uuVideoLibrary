import React from 'react';

import { useAuth } from '../../utils/hooks/useAuth';
import { Spinner } from 'react-bootstrap';

const Body = ({ children }) => {
  const { initializing } = useAuth();

  return initializing ? (
    <div className="app__initializing">
      <Spinner animation="border" />
    </div>
  ) : (
    <>{children}</>
  );
};

export default Body;
