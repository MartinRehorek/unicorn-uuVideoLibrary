import React from "react";
import {Outlet,Navigate,useOutletContext} from "react-router-dom";
import {useAuth} from "../../utils/hooks/useAuth";

const AdminRoute = () => {
  const {isAdmin} = useAuth();
  const outletContext = useOutletContext();

  if (!isAdmin) {
    return <Navigate to={"/"}/>;
  }

  return <Outlet context={outletContext}/>;
}

export default AdminRoute;
