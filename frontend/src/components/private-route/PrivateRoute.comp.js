import React from "react";
import { Navigate } from "react-router-dom";
import DefaultLayout from "../../layout/DefaultLayout";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? <DefaultLayout>{children}</DefaultLayout> : <Navigate to="/" replace />;
};

export default PrivateRoute;