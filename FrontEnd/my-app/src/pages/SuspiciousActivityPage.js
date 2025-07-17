import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiService from '../api/apiService';
import '../App.css';

const SuspiciousActivityPage = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSuspiciousActivity = async () => {
      setLoading(true);
      try {
        const response = await apiService.get('/manager/suspicious-activity');
        setActivities(response.data);
      } catch (error) {
        console.error("Failed to fetch suspicious activities:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSuspiciousActivity();
  }, []);

  return (
    <div className="dashboard">
      <h2 className="dashboard-header">Suspicious Activity Logs</h2>
      <div className="section">
        {loading ? (
          <p>Loading activities...</p>
        ) : (
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Clock-In Time</th>
                <th>Location (Lat, Lon)</th>
              </tr>
            </thead>
            <tbody>
              {activities.length > 0 ? (
                activities.map((activity) => (
                  <tr key={activity.id}>
                    <td>{activity.employee.user.name}</td>
                    <td>{new Date(activity.clock_in_time).toLocaleString()}</td>
                    <td>{activity.clock_in_latitude}, {activity.clock_in_longitude}</td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="3">No suspicious activities found.</td></tr>
              )}
            </tbody>
          </table>
        )}
        <div style={{ marginTop: '1.5rem' }}>
          <Link to="/admindashboard" style={{ textDecoration: 'none', color: '#00cec9' }}>Back to Dashboard</Link>
        </div>
      </div>
    </div>
  );
};

export default SuspiciousActivityPage;
