import React, { useState, useEffect } from 'react';
import apiService from '../api/apiService';
import '../Dashboard.css'; // Using Dashboard.css for consistent styling

const LeaveHistoryPage = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaveHistory = async () => {
      setLoading(true);
      try {
        const response = await apiService.get('/leave/history');
        // Assuming the data is nested under a 'data' key
        setLeaveRequests(response.data.data || response.data);
      } catch (error) {
        console.error("Failed to fetch leave history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaveHistory();
  }, []);

  return (
    <>
      {loading ? (
        <p>Loading history...</p>
      ) : (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Dates</th>
              <th>Type</th>
              <th>Reason for Request</th>
              <th>Status</th>
              <th>Manager's Comment</th>
            </tr>
          </thead>
          <tbody>
            {leaveRequests.length > 0 ? (
              leaveRequests.map((log) => (
                <tr key={log.id}>
                  <td>{new Date(log.start_date).toLocaleDateString()} - {new Date(log.end_date).toLocaleDateString()}</td>
                  <td>{log.leave_type}</td>
                  <td>{log.reason}</td>
                  <td>
                    <span className={`badge ${
                      log.status === 'approved' ? 'status-approved' : 
                      log.status === 'rejected' ? 'status-rejected' : 
                      'status-pending'
                    }`}>
                      {log.status}
                    </span>
                  </td>
                  {/* Display the rejection reason if the request was rejected */}
                  <td>{log.status === 'rejected' ? log.rejection_reason : 'N/A'}</td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="5">No leave history found.</td></tr>
            )}
          </tbody>
        </table>
      )}
    </>
  );
};

export default LeaveHistoryPage;
