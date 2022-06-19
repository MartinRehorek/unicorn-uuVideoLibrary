import React, { useEffect } from 'react';
import { useAuth } from 'utils/hooks/useAuth';
import { Spinner } from 'react-bootstrap';

const Logout = () => {
  const { signOut } = useAuth();

  useEffect(() => {
    signOut();
  }, []);

  return <Spinner className={'logout__process-loader'} animation="border" />;
};

export default Logout;
