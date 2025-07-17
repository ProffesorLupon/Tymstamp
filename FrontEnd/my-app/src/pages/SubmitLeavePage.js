import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import apiService from '../api/apiService';
import '../App.css';

const SubmitLeavePage = () => {
  const [leaveType, setLeaveType] = useState('sick');
  const [leaveReason, setLeaveReason] = useState('');
  const [leaveStartDate, setLeaveStartDate] = useState('');
  const [leaveEndDate, setLeaveEndDate] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLeaveRequestSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await apiService.post('/leave/request', {
        leave_type: leaveType,
        reason: leaveReason,
        start_date: leaveStartDate,
        end_date: leaveEndDate,
      });
      setSuccess('Leave request submitted successfully!');
      // Clear form
      setLeaveType('sick');
      setLeaveReason('');
      setLeaveStartDate('');
      setLeaveEndDate('');
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to submit leave request.';
      setError(errorMessage);
      console.error('Failed to submit leave request:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard">
      <h2 className="dashboard-header">Submit a Leave Request</h2>
      <div className="section leave-request">
        {error && <p className="error">{error}</p>}
        {success && <p style={{ color: 'green' }}>{success}</p>}
        <form onSubmit={handleLeaveRequestSubmit} className="leave-request-form">
          <div>
            <label>Leave Type</label>
            <select value={leaveType} onChange={(e) => setLeaveType(e.target.value)} required>
              <option value="sick">Sick</option>
              <option value="casual">Casual</option>
              <option value="paid">Paid</option>
              <option value="maternity">Maternity</option>
              <option value="paternity">Paternity</option>
            </select>
          </div>
          <div>
            <label>Start Date</label>
            <input type="date" value={leaveStartDate} onChange={(e) => setLeaveStartDate(e.target.value)} required />
          </div>
          <div>
            <label>End Date</label>
            <input type="date" value={leaveEndDate} onChange={(e) => setLeaveEndDate(e.target.value)} required />
          </div>
          <div>
            <label>Reason</label>
            <textarea placeholder="Reason for leave" value={leaveReason} onChange={(e) => setLeaveReason(e.target.value)} required />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit Request'}
          </button>
        </form>
         <div style={{ marginTop: '1.5rem' }}>
          <Link to="/dashboard" style={{ textDecoration: 'none', color: '#00cec9' }}>Back to Dashboard</Link>
        </div>
      </div>
    </div>
  );
};

export default SubmitLeavePage;
