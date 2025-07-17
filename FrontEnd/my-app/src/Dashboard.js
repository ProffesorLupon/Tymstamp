import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaClock, FaPlaneDeparture, FaFileAlt, FaHistory, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from './AuthContext';
import './Dashboard.css';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>Welcome, {user?.name}</h2>
        <button className="btn btn-danger" onClick={handleLogout}>
          <FaSignOutAlt /> Logout
        </button>
      </div>

      <div className="dashboard-content">
        <div className="section quick-links">
          <h3>What would you like to do?</h3>
          <div className="features-grid">
            <Link to="/clock-in-out-gps" className="feature-box-link">
              <div className="feature-box">
                <FaClock size={30} />
                <span>Clock In / Out</span>
              </div>
            </Link>
            <Link to="/submit-trip" className="feature-box-link">
              <div className="feature-box">
                <FaPlaneDeparture size={30} />
                <span>Start a New Trip</span>
              </div>
            </Link>
            <Link to="/submit-leave" className="feature-box-link">
              <div className="feature-box">
                <FaFileAlt size={30} />
                <span>Request Leave</span>
              </div>
            </Link>
            <Link to="/attendance-logs" className="feature-box-link">
              <div className="feature-box">
                <FaHistory size={30} />
                <span>View Attendance</span>
              </div>
            </Link>
            <Link to="/travel-logs" className="feature-box-link">
              <div className="feature-box">
                <FaPlaneDeparture size={30} />
                <span>View Travel Logs</span>
              </div>
            </Link>
            <Link to="/leave-history" className="feature-box-link">
              <div className="feature-box">
                <FaFileAlt size={30} />
                <span>View Leave History</span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
