import React, { useEffect, useState } from 'react';

// Placeholder API function to fetch leave requests (replace with your actual API call)
const fetchLeaveRequests = async () => {
  // Simulating an API call with a delay
  return [
    { id: 1, user: 'John Doe', type: 'Sick Leave', status: 'Pending' },
    { id: 2, user: 'Jane Smith', type: 'Annual Leave', status: 'Approved' },
    { id: 3, user: 'Bob Brown', type: 'Casual Leave', status: 'Rejected' },
  ];
};

const LeaveRequests = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch leave requests from the "API" when the component mounts
  useEffect(() => {
    const getLeaveRequests = async () => {
      const data = await fetchLeaveRequests();
      setLeaveRequests(data);
      setLoading(false);
    };

    getLeaveRequests();
  }, []);

  // Handle approval or rejection of leave requests
  const handleStatusChange = (id, newStatus) => {
    setLeaveRequests(prevState =>
      prevState.map((request) =>
        request.id === id ? { ...request, status: newStatus } : request
      )
    );
  };

  return (
    <div className="page-container">
      <h2>Leave Requests</h2>
      {loading ? (
        <p>Loading leave requests...</p>
      ) : (
        <table className="custom-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Leave Type</th>
              <th>Status</th>
              <th>Actions</th> {/* Add actions column */}
            </tr>
          </thead>
          <tbody>
            {leaveRequests.length === 0 ? (
              <tr>
                <td colSpan="4">No leave requests available</td>
              </tr>
            ) : (
              leaveRequests.map((request) => (
                <tr key={request.id}>
                  <td>{request.user}</td>
                  <td>{request.type}</td>
                  <td>{request.status}</td>
                  <td>
                    {/* Approval and Rejection buttons */}
                    {request.status === 'Pending' && (
                      <>
                        <button onClick={() => handleStatusChange(request.id, 'Approved')}>
                          Approve
                        </button>
                        <button onClick={() => handleStatusChange(request.id, 'Rejected')}>
                          Reject
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default LeaveRequests;