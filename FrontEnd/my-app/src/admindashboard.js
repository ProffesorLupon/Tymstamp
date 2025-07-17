import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUsers, FaCalendarCheck, FaSignOutAlt, FaExclamationTriangle, FaTasks } from 'react-icons/fa';
import { useAuth } from './AuthContext';
import './Dashboard.css';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>Manager Dashboard</h2>
        <p>Welcome, {user?.name}</p>
        <button className="btn btn-danger" onClick={handleLogout}>
          <FaSignOutAlt /> Logout
        </button>
      </div>

      <div className="dashboard-content">
        <div className="section quick-links">
          <h3>Management Tasks</h3>
          <div className="features-grid">
            <Link to="/leave-requests" className="feature-box-link">
              <div className="feature-box">
                <FaTasks size={30} />
                <span>Pending Leave Requests</span>
              </div>
            </Link>
            <Link to="/suspicious-activity" className="feature-box-link">
              <div className="feature-box">
                <FaExclamationTriangle size={30} />
                <span>Suspicious Activity</span>
              </div>
            </Link>
            <Link to="/team-attendance" className="feature-box-link">
              <div className="feature-box">
                <FaCalendarCheck size={30} />
                <span>Team Attendance</span>
              </div>
            </Link>
            {user?.role === 'admin' && (
              <Link to="/manage-users" className="feature-box-link">
                <div className="feature-box">
                  <FaUsers size={30} />
                  <span>Manage Users</span>
                </div>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
