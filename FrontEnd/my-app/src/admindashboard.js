import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaClock, FaUsers, FaCalendar, FaCalendarCheck, FaSignOutAlt } from 'react-icons/fa';
import './App.css'; // Import App.css for styling

const AdminDashboard = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [travelLogs, setTravelLogs] = useState([]);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [users, setUsers] = useState([]);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Simulating fetching data from the backend (empty for now)
    setAttendanceData([]);
    setTravelLogs([]);
    setLeaveRequests([]);
    setUsers([]);
  }, []);

  // Handle leave request approval
  const handleApproveLeave = (id) => {
    setLeaveRequests((prevRequests) =>
      prevRequests.map((request) =>
        request.id === id ? { ...request, status: 'Approved' } : request
      )
    );
  };

  // Handle leave request denial
  const handleDenyLeave = (id) => {
    setLeaveRequests((prevRequests) =>
      prevRequests.map((request) =>
        request.id === id ? { ...request, status: 'Denied' } : request
      )
    );
  };

  const handleLogout = () => {
    navigate('/');
  };

  // Handle input changes for new user
  const handleNewUserNameChange = (e) => {
    setNewUserName(e.target.value);
  };

  const handleNewUserEmailChange = (e) => {
    setNewUserEmail(e.target.value);
  };

  // Handle adding a new user
  const handleAddUser = () => {
    if (newUserName.trim() === '' || newUserEmail.trim() === '') {
      alert('Please enter both name and email.');
      return;
    }
    const newUser = {
      id: Date.now(),
      name: newUserName,
      email: newUserEmail,
    };
    setUsers((prevUsers) => [...prevUsers, newUser]);
    setNewUserName('');
    setNewUserEmail('');
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>Admin Dashboard</h2>
        <div className="logout-btn">
          <button className="btn btn-danger" onClick={handleLogout}>
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </div>

      <div className="dashboard-content">
        {/* Attendance Logs */}
        <div className="section attendance">
          <h3>Attendance Logs</h3>
          <table className="custom-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Status</th>
                <th>Clock In</th>
                <th>Clock Out</th>
              </tr>
            </thead>
            <tbody>
              {attendanceData.length === 0 ? (
                <tr><td colSpan="4">No attendance data available</td></tr>
              ) : (
                attendanceData.map((entry) => (
                  <tr key={entry.id}>
                    <td>{entry.name}</td>
                    <td>{entry.status}</td>
                    <td>{entry.clockIn}</td>
                    <td>{entry.clockOut}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Travel Logs */}
        <div className="section travel-logs">
          <h3>Travel Logs</h3>
          <table className="custom-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Distance (km)</th>
                <th>Fuel Cost</th>
                <th>Toll Cost</th>
              </tr>
            </thead>
            <tbody>
              {travelLogs.length === 0 ? (
                <tr><td colSpan="4">No travel logs available</td></tr>
              ) : (
                travelLogs.map((log) => (
                  <tr key={log.id}>
                    <td>{log.user}</td>
                    <td>{log.distance}</td>
                    <td>{log.fuelCost}</td>
                    <td>{log.tollCost}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Leave Requests */}
        <div className="section leave-requests">
          <h3>Leave Requests</h3>
          <table className="custom-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Leave Type</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {leaveRequests.length === 0 ? (
                <tr><td colSpan="4">No leave requests available</td></tr>
              ) : (
                leaveRequests.map((request) => (
                  <tr key={request.id}>
                    <td>{request.user}</td>
                    <td>{request.type}</td>
                    <td>{request.status}</td>
                    <td>
                      {request.status === 'Pending' && (
                        <>
                          <button
                            onClick={() => handleApproveLeave(request.id)}
                            className="btn btn-success"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleDenyLeave(request.id)}
                            className="btn btn-danger"
                          >
                            Deny
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Manage Users */}
        <div className="section manage-users">
          <h3>Manage Users</h3>
          <div className="add-user-form">
            <input
              type="text"
              placeholder="Name"
              value={newUserName}
              onChange={handleNewUserNameChange}
              className="form-input"
            />
            <input
              type="email"
              placeholder="Email"
              value={newUserEmail}
              onChange={handleNewUserEmailChange}
              className="form-input"
            />
            <button onClick={handleAddUser} className="btn btn-primary">
              Add User
            </button>
          </div>
          <table className="custom-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr><td colSpan="2">No users added</td></tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Navigation Links */}
        <div className="navigation-links">
          <h3>Navigation</h3>
          <ul>
            <li><a href="/manage-users"><FaUsers /> Manage Users</a></li>
            <li><a href="/attendance-logs"><FaCalendarCheck /> Attendance Logs</a></li>
            <li><a href="/travel-logs"><FaCalendar /> Travel Logs</a></li>
            <li><a href="/leave-requests"><FaCalendarCheck /> Leave Requests</a></li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
