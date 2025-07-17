import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './HomePage';
import Login from './login';
import AdminDashboard from './admindashboard';
import Dashboard from './Dashboard';
import ProtectedRoute from './ProtectedRoute';
import { AuthProvider } from './AuthContext';
import PageLayout from './components/PageLayout';

import ClockInOutGPS from './pages/ClockInOutGPS';
import AttendanceLogs from './pages/AttendanceLogs';
import TravelLogs from './pages/TravelLogs';
import ManageUsers from './pages/ManageUsers';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import SubmitLeavePage from './pages/SubmitLeavePage';
import SubmitTripPage from './pages/SubmitTripPage';
import LeaveHistoryPage from './pages/LeaveHistoryPage';
import SuspiciousActivityPage from './pages/SuspiciousActivityPage';
import TeamAttendancePage from './pages/TeamAttendancePage';
import LeaveRequests from './pages/LeaveRequests';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          {/* Main Dashboards */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          {/* HR users will now also be directed to the admin dashboard */}
          <Route path="/admindashboard" element={<ProtectedRoute allowedRoles={['admin', 'manager', 'hr']}><AdminDashboard /></ProtectedRoute>} />

          {/* Employee Routes */}
          <Route path="/clock-in-out-gps" element={<ProtectedRoute><PageLayout title="Clock In / Out"><ClockInOutGPS /></PageLayout></ProtectedRoute>} />
          <Route path="/submit-trip" element={<ProtectedRoute><PageLayout title="Start a New Trip"><SubmitTripPage /></PageLayout></ProtectedRoute>} />
          <Route path="/submit-leave" element={<ProtectedRoute><PageLayout title="Submit Leave Request"><SubmitLeavePage /></PageLayout></ProtectedRoute>} />
          <Route path="/attendance-logs" element={<ProtectedRoute><PageLayout title="My Attendance History"><AttendanceLogs /></PageLayout></ProtectedRoute>} />
          <Route path="/travel-logs" element={<ProtectedRoute><PageLayout title="My Travel Logs"><TravelLogs /></PageLayout></ProtectedRoute>} />
          <Route path="/leave-history" element={<ProtectedRoute><PageLayout title="My Leave History"><LeaveHistoryPage /></PageLayout></ProtectedRoute>} />

          {/* Manager & HR Routes */}
          <Route path="/leave-requests" element={<ProtectedRoute allowedRoles={['admin', 'manager', 'hr']}><PageLayout title="Manage Leave Requests"><LeaveRequests /></PageLayout></ProtectedRoute>} />
          <Route path="/suspicious-activity" element={<ProtectedRoute allowedRoles={['admin', 'manager', 'hr']}><PageLayout title="Suspicious Activity"><SuspiciousActivityPage /></PageLayout></ProtectedRoute>} />
          <Route path="/team-attendance" element={<ProtectedRoute allowedRoles={['admin', 'manager', 'hr']}><PageLayout title="Team Attendance"><TeamAttendancePage /></PageLayout></ProtectedRoute>} />

          {/* Admin & HR Only Routes */}
          <Route path="/manage-users" element={<ProtectedRoute allowedRoles={['admin', 'hr']}><PageLayout title="Manage Users"><ManageUsers /></PageLayout></ProtectedRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
