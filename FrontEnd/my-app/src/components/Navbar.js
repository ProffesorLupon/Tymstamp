import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { FaSignOutAlt, FaTachometerAlt } from 'react-icons/fa';
import '../Dashboard.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };
    // Determine the dashboard URL based on user role
  const dashboardUrl = ['admin', 'manager', 'hr'].includes(user?.role) ? '/admindashboard' : '/dashboard';

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to={dashboardUrl}>Tymstamp</Link>
      </div>
      <div className="navbar-links">
        <Link to={dashboardUrl}><FaTachometerAlt /> Dashboard</Link>
        <button onClick={handleLogout} className="btn btn-danger btn-sm">
          <FaSignOutAlt /> Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
