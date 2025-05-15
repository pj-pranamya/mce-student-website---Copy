import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles }) => {
  // Retrieve the user role from localStorage
  const userRole = localStorage.getItem("userRole");

  // If no userRole is set (i.e., user is not logged in), redirect to login
  if (!userRole) {
    return <Navigate to="/login" replace />;
  }

  // If the user's role is not allowed, redirect to the access-denied page
  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/access-denied" replace />;
  }

  // If the user has the correct role, render the children components
  return children;
};

export default ProtectedRoute;
