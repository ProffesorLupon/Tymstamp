import React from 'react';
import { Link } from 'react-router-dom';
import './App.css'; // Ensure this imports the CSS

const HomePage = () => {
  return (
    <div className="home-container">
      <div className="home-content">
        <h1 className="app-title">Tymstamp</h1>
        <p className="tagline">Proximity-Based Attendance & Travel Logging</p>

        <div className="features-grid">
          <div className="feature-box">
            <a href="/clock-in-out-gps" style={{ textDecoration: 'none', color: 'inherit' }}>
              📍 GPS-based Clock In/Out
            </a>
          </div>
          <div className="feature-box">🧠 Compliance Scoring</div>
          <div className="feature-box">🧳 Travel Logs & Reimbursement</div>
          <div className="feature-box">📅 Leave Management</div>
          <div className="feature-box">🧍 Facial Recognition</div>
          <div className="feature-box">📊 Admin Dashboard</div>
        </div>

        <div className="login-options">
          <Link to="/login?role=employee">
            <button className="login-btn employee">Login as Employee</button>
          </Link>
          <Link to="/login?role=admin">
            <button className="login-btn admin">Login as Admin</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
