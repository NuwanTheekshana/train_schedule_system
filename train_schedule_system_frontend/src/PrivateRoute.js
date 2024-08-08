import React from 'react';
import { Route, Navigate } from 'react-router-dom';

function PrivateRoute({ element }) {
  //Check for valid token
  const isAuthenticated = !!localStorage.getItem('token');

  //If authenticated render element or redirect to login page
  return isAuthenticated ? element : <Navigate to="/" />;
}

export default PrivateRoute;
