import React from 'react';

const LeaveRequests = () => {
  // Placeholder data, can be replaced with props or API data
  const leaveRequests = [];

  return (
    <div className="page-container">
      <h2>Leave Requests</h2>
      <table className="custom-table">
        <thead>
          <tr>
            <th>User</th>
            <th>Leave Type</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {leaveRequests.length === 0 ? (
            <tr><td colSpan="3">No leave requests available</td></tr>
          ) : (
            leaveRequests.map((request) => (
              <tr key={request.id}>
                <td>{request.user}</td>
                <td>{request.type}</td>
                <td>{request.status}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default LeaveRequests;
