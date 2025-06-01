import React from "react";
import { Navigate, Outlet } from "react-router-dom";

/**
 * PrivateRoute will check for an ID_TOKEN in localStorage.
 * - If the token exists, render the nested route (<Outlet />).
 * - If there is no token, redirect the user to "/" route.
 */
const PrivateRoute = () => {
  const token = localStorage.getItem("ID_TOKEN");
  console.warn("Warning: Unable to access private route. Please log in");
  return token ? <Outlet /> : <Navigate to="/" replace />;
};

export default PrivateRoute;