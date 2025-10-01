import React from 'react';
import { Navigate } from 'react-router-dom';
import { useFirebase } from '../context/FirebaseContext';
import LoadingSpinner from './LoadingSpinner';

const AuthWrapper = ({ children, requireAuth = true }) => {
  const { firebaseUser, loading } = useFirebase();

  // Show loading spinner while checking authentication
  if (loading) {
    return <LoadingSpinner fullScreen message="Loading..." />;
  }

  // If authentication is required but user is not logged in
  if (requireAuth && !firebaseUser) {
    return <Navigate to="/login" replace />;
  }

  // If user is logged in but trying to access auth pages
  if (!requireAuth && firebaseUser) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default AuthWrapper;
