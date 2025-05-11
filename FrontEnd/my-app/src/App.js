// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './HomePage'; // Add this import
import Login from './login'; // Login component
import AdminDashboard from './admindashboard'; // Admin Dashboard
import Dashboard from './Dashboard'; // Employee Dashboard
import ClockInOutGPS from './pages/ClockInOutGPS'; // Import GPS Clock In/Out page

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />            {/* Show HomePage first */}
        <Route path="/login" element={<Login />} />
        <Route path="/admindashboard" element={<AdminDashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/clock-in-out-gps" element={<ClockInOutGPS />} /> {/* Add route for GPS Clock In/Out */}
      </Routes>
    </Router>
  );
};

export default App;
