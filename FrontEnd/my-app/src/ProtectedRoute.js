import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, token, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!token || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If a user has a role that should see the admin dashboard but lands on the employee one, redirect them.
  if (['admin', 'manager', 'hr'].includes(user.role) && location.pathname === '/dashboard') {
    return <Navigate to="/admindashboard" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // If not allowed, redirect to their default dashboard
    const defaultDashboard = ['admin', 'manager', 'hr'].includes(user.role) ? '/admindashboard' : '/dashboard';
    return <Navigate to={defaultDashboard} replace />;
  }

  return children;
};

export default ProtectedRoute;
