// AuthGuard.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './authContext';

const AuthGuard = ({ element }) => {
  const { isAuthenticated } = useAuth(); // Dapatkan nilai isAuthenticated dari useAuth

  return isAuthenticated ? element : <Navigate to="/" />;
};

export default AuthGuard;
