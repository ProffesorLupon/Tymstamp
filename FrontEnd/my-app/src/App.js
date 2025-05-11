
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './HomePage';
import Login from './login';
import AdminDashboard from './admindashboard';
import Dashboard from './Dashboard';
import ClockInOutGPS from './pages/ClockInOutGPS';
import LeaveRequests from './pages/LeaveRequests';
import ProtectedRoute from './ProtectedRoute';
import { AuthProvider } from './AuthContext';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
        <Route path="/leave-requests" element={<LeaveRequests />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          
          <Route
            path="/admindashboard"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/clock-in-out-gps"
            element={
              <ProtectedRoute>
                <ClockInOutGPS />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
