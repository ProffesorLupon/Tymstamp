import React, { useState } from 'react';
import { FaClock, FaUsers, FaCalendar, FaCalendarCheck, FaSignOutAlt, FaBell } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './App.css';

const Dashboard = ({ isAdmin }) => {
  const navigate = useNavigate(); // Initialize useNavigate hook

  const [attendanceData, setAttendanceData] = useState([]);
  const [travelLogs, setTravelLogs] = useState([]);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [clockInTime, setClockInTime] = useState(null);
  const [clockOutTime, setClockOutTime] = useState(null);

  const [distance, setDistance] = useState('');
  const [fuelCost, setFuelCost] = useState('');
  const [tollCost, setTollCost] = useState('');

  const [leaveType, setLeaveType] = useState('');
  const [leaveReason, setLeaveReason] = useState('');
  const [leaveStartDate, setLeaveStartDate] = useState('');
  const [leaveEndDate, setLeaveEndDate] = useState('');

  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  const addNotification = (message) => {
    setNotifications((prev) => [
      ...prev,
      { id: prev.length + 1, message, date: new Date().toISOString() },
    ]);
  };

  const handleClockIn = () => {
    const now = new Date();
    const currentTime = now.toLocaleTimeString();
    const currentDate = now.toISOString().split('T')[0];

    setClockInTime(currentTime);
    setIsClockedIn(true);
    setClockOutTime(null);

    setAttendanceData((prevData) => [
      ...prevData,
      {
        id: prevData.length + 1,
        date: currentDate,
        status: 'Present',
        clockIn: currentTime,
        clockOut: '',
      },
    ]);

    addNotification("You have clocked in.");
  };

  const handleClockOut = () => {
    const currentTime = new Date().toLocaleTimeString();
    setClockOutTime(currentTime);
    setIsClockedIn(false);

    setAttendanceData((prevData) => {
      const updatedData = [...prevData];
      const lastIndex = updatedData.length - 1;
      if (updatedData[lastIndex]?.clockIn && !updatedData[lastIndex].clockOut) {
        updatedData[lastIndex].clockOut = currentTime;
      }
      return updatedData;
    });

    addNotification("You have clocked out.");
  };

  const handleTravelLogSubmit = (e) => {
    e.preventDefault();
    if (!distance || !fuelCost || !tollCost) {
      alert("Please fill in all fields");
      return;
    }

    const newTravelLog = {
      id: travelLogs.length + 1,
      date: new Date().toISOString().split('T')[0],
      distance: parseFloat(distance),
      fuelCost: parseFloat(fuelCost),
      tollCost: parseFloat(tollCost),
    };

    setTravelLogs((prevLogs) => [...prevLogs, newTravelLog]);
    setDistance('');
    setFuelCost('');
    setTollCost('');
    addNotification("New travel log added.");
  };

  const handleLeaveRequestSubmit = (e) => {
    e.preventDefault();
    if (!leaveType || !leaveReason || !leaveStartDate || !leaveEndDate) {
      alert("Please fill in all fields");
      return;
    }

    const newLeaveRequest = {
      id: leaveRequests.length + 1,
      type: leaveType,
      reason: leaveReason,
      status: 'Pending',
      startDate: leaveStartDate,
      endDate: leaveEndDate,
    };

    setLeaveRequests((prev) => [...prev, newLeaveRequest]);
    setLeaveType('');
    setLeaveReason('');
    setLeaveStartDate('');
    setLeaveEndDate('');
    addNotification("New leave request submitted.");
  };

  const handleApproveLeave = (id) => {
    setLeaveRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'Approved' } : r))
    );
    addNotification("Leave request approved.");
  };

  const handleDenyLeave = (id) => {
    setLeaveRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'Denied' } : r))
    );
    addNotification("Leave request denied.");
  };

  const handleLogout = () => {
    navigate('/'); // Redirect to homepage when logout is clicked
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>Dashboard</h2>
        <div className="logout-btn">
          <button className="btn btn-danger" onClick={handleLogout}>
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </div>

      <div className="dashboard-content">
        {/* Clock In/Out */}
        <div className="clock-in-out">
          <h3>Clock In/Out</h3>
          <p>{isClockedIn ? `Clocked In at: ${clockInTime}` : 'Not Clocked In'}</p>
          {clockOutTime && <p>Clocked Out at: {clockOutTime}</p>}
          <button
            onClick={isClockedIn ? handleClockOut : handleClockIn}
            className={`btn ${isClockedIn ? 'btn-danger' : 'btn-success'}`}
          >
            <FaClock /> {isClockedIn ? 'Clock Out' : 'Clock In'}
          </button>
        </div>

        {/* Attendance Logs */}
        <div className="section attendance">
          <h3>Attendance Logs</h3>
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Date</th>
                <th>Status</th>
                <th>Clock In</th>
                <th>Clock Out</th>
              </tr>
            </thead>
            <tbody>
              {attendanceData.length === 0 ? (
                <tr>
                  <td colSpan="4">No attendance records available</td>
                </tr>
              ) : (
                attendanceData.map((entry) => (
                  <tr key={entry.id}>
                    <td>{entry.date}</td>
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
          <form onSubmit={handleTravelLogSubmit}>
            <div>
              <label>Distance (km):</label>
              <input
                type="number"
                value={distance}
                onChange={(e) => setDistance(e.target.value)}
                required
              />
            </div>
            <div>
              <label>Fuel Cost:</label>
              <input
                type="number"
                value={fuelCost}
                onChange={(e) => setFuelCost(e.target.value)}
                required
              />
            </div>
            <div>
              <label>Toll Cost:</label>
              <input
                type="number"
                value={tollCost}
                onChange={(e) => setTollCost(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Add Travel Log
            </button>
          </form>
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Date</th>
                <th>Distance (km)</th>
                <th>Fuel Cost</th>
                <th>Toll Cost</th>
              </tr>
            </thead>
            <tbody>
              {travelLogs.length === 0 ? (
                <tr>
                  <td colSpan="4">No travel logs</td>
                </tr>
              ) : (
                travelLogs.map((log) => (
                  <tr key={log.id}>
                    <td>{log.date}</td>
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
          <form onSubmit={handleLeaveRequestSubmit}>
            <div>
              <label>Leave Type:</label>
              <select
                value={leaveType}
                onChange={(e) => setLeaveType(e.target.value)}
                required
              >
                <option value="">Select Leave Type</option>
                <option value="Sick">Sick</option>
                <option value="Vacation">Vacation</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label>Start Date:</label>
              <input
                type="date"
                value={leaveStartDate}
                onChange={(e) => setLeaveStartDate(e.target.value)}
                required
              />
            </div>
            <div>
              <label>End Date:</label>
              <input
                type="date"
                value={leaveEndDate}
                onChange={(e) => setLeaveEndDate(e.target.value)}
                required
              />
            </div>
            <div>
              <label>Reason:</label>
              <textarea
                value={leaveReason}
                onChange={(e) => setLeaveReason(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Submit Leave Request
            </button>
          </form>
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Leave Type</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {leaveRequests.map((request) => (
                <tr key={request.id}>
                  <td>{request.type}</td>
                  <td>{request.startDate}</td>
                  <td>{request.endDate}</td>
                  <td>{request.status}</td>
                  <td>
                    {isAdmin && request.status === 'Pending' && (
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
              ))}
            </tbody>
          </table>
        </div>

        {/* Notifications */}
        <div className="notification-btn">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="btn btn-info"
          >
            <FaBell /> Notifications
          </button>
          {showNotifications && (
            <div className="notifications">
              <h4>Notifications</h4>
              <ul>
                {notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <li key={notification.id}>
                      <p>{notification.message}</p>
                      <small>{notification.date}</small>
                    </li>
                  ))
                ) : (
                  <p>No notifications</p>
                )}
              </ul>
            </div>
          )}
        </div>

        {/* Quick Links */}
        <div className="quick-links">
          <h3>Quick Links</h3>
          <ul>
            <li>
              <FaClock /> Clock In/Out
            </li>
            <li>
              <FaCalendarCheck /> View Attendance Summary
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
