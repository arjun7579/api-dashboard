import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../services/authService';
import Spinner from './Spinner';

// This component protects routes that require a logged-in user.
// It checks the authentication status using the useAuth hook.
function PrivateRoute() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    // Show a spinner while checking auth status to prevent flicker
    return <Spinner />;
  }
  
  // If user is logged in, render the child route (using <Outlet />).
  // Otherwise, redirect to the /login page.
  return user ? <Outlet /> : <Navigate to="/login" />;
}

export default PrivateRoute;