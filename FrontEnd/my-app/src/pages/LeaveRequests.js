import React, { useEffect, useState } from 'react';
import apiService from '../api/apiService';
import '../Dashboard.css';

const LeaveRequests = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getLeaveRequests = async () => {
      setLoading(true);
      try {
        const response = await apiService.get('/manager/leave/pending-requests');
        setLeaveRequests(response.data);
      } catch (error) {
        console.error("Failed to fetch leave requests:", error);
      } finally {
        setLoading(false);
      }
    };

    getLeaveRequests();
  }, []);

  const handleApprove = async (id) => {
    try {
      await apiService.post(`/manager/leave/requests/${id}/approve`);
      setLeaveRequests(prev => prev.filter(req => req.id !== id));
      alert('Request approved.');
    } catch (error) {
      console.error('Failed to approve request:', error);
      alert('Could not approve request.');
    }
  };

  const handleReject = async (id) => {
    const reason = prompt("Please provide a reason for rejection:");
    if (!reason) return;

    try {
      await apiService.post(`/manager/leave/requests/${id}/reject`, { rejection_reason: reason });
      setLeaveRequests(prev => prev.filter(req => req.id !== id));
      alert('Request rejected.');
    } catch (error) {
      console.error('Failed to reject request:', error);
      alert('Could not reject request.');
    }
  };

  return (
    <>
      {loading ? (
        <p>Loading leave requests...</p>
      ) : (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Employee</th>
              <th>Leave Type</th>
              <th>Dates</th>
              <th>Reason</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {leaveRequests.length === 0 ? (
              <tr><td colSpan="6">No pending leave requests.</td></tr>
            ) : (
              leaveRequests.map((request) => (
                <tr key={request.id}>
                  <td>{request.employee.user.name}</td>
                  <td>{request.leave_type}</td>
                  <td>{new Date(request.start_date).toLocaleDateString()} - {new Date(request.end_date).toLocaleDateString()}</td>
                  <td>{request.reason}</td>
                  <td><span className="badge status-pending">{request.status}</span></td>
                  <td>
                    <button onClick={() => handleApprove(request.id)} className="btn btn-success btn-sm me-2">Approve</button>
                    <button onClick={() => handleReject(request.id)} className="btn btn-danger btn-sm">Reject</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </>
  );
};

export default LeaveRequests;
