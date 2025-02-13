import React from 'react';
import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated');

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // If user tries to access root path when authenticated, redirect to home
  if (window.location.pathname === '/') {
    return <Navigate to="/home" replace />;
  }

  return children;
};

// Define prop types
ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired, // children must be a valid React node
};

export default ProtectedRoute;
