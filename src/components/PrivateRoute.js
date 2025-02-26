import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("isAuthenticated");

  if (isAuthenticated !== "true") {
    return <Navigate to="/" />;
  }

  return children;
};

export default PrivateRoute;
