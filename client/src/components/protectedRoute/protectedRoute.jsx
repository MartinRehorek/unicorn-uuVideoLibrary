import React from 'react';

import { Outlet, Navigate, useOutletContext } from 'react-router-dom';
import { useAuth } from 'utils/hooks/useAuth';

const ProtectedRoute = () => {
  const { authenticated } = useAuth();
  const outletContext = useOutletContext();

  if (!authenticated) {
    return <Navigate to={'/login'} />;
  }

  return <Outlet context={outletContext} />;
};

export default ProtectedRoute;
