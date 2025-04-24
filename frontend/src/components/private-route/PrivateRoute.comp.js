import React from "react";
import { Navigate } from "react-router-dom";
import DefaultLayout from "../../layout/DefaultLayout";

const isAuth = true; // TODO: Replace with real auth check

const PrivateRoute = ({ children }) => {
  return isAuth ? <DefaultLayout>{children}</DefaultLayout> : <Navigate to="/" replace />;
};

export default PrivateRoute;
