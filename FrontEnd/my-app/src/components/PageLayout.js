import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import { useAuth } from '../AuthContext';
import '../Dashboard.css';

const PageLayout = ({ children, title }) => {
  const { user } = useAuth();
  const dashboardUrl = user?.role === 'admin' || user?.role === 'manager' ? '/admindashboard' : '/dashboard';

  return (
    <>
      <Navbar />
      <div className="dashboard">
        <div className="page-header">
            <h2>{title}</h2>
        </div>
        <div className="section">
          {children}
        </div>
        <div className="back-link-container">
          <Link to={dashboardUrl} className="back-link">
            &larr; Back to Dashboard
          </Link>
        </div>
      </div>
    </>
  );
};

export default PageLayout;
