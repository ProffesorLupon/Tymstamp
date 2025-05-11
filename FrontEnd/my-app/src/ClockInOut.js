import React, { useState } from 'react';
import './App.css'; // Assuming your CSS is in App.css

const ClockInOut = () => {
  // State to track the clock-in status and the logs
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [clockInOutLog, setClockInOutLog] = useState([
    { employee: 'John Doe', clockIn: '2025-05-07 08:00 AM', clockOut: '2025-05-07 05:00 PM', status: 'Clocked Out' },
    { employee: 'Jane Smith', clockIn: '2025-05-07 09:00 AM', clockOut: null, status: 'Clocked In' }
  ]);

  // Function to handle Clock In
  const handleClockIn = () => {
    const newLog = {
      employee: 'Admin', // You can dynamically assign this
      clockIn: new Date().toLocaleString(),
      clockOut: null,
      status: 'Clocked In'
    };
    setClockInOutLog([...clockInOutLog, newLog]);
    setIsClockedIn(true);
  };

  // Function to handle Clock Out
  const handleClockOut = () => {
    const updatedLogs = clockInOutLog.map(log => {
      if (log.status === 'Clocked In' && !log.clockOut) {
        log.clockOut = new Date().toLocaleString();
        log.status = 'Clocked Out';
      }
      return log;
    });
    setClockInOutLog(updatedLogs);
    setIsClockedIn(false);
  };

  return (
    <div className="clock-in-out">
      <div className="clock-header">
        <h3>Clock In / Clock Out</h3>
        <p>Manage employee attendance</p>
      </div>

      <div className="clock-status">
        <p>{isClockedIn ? 'You are clocked in. Please clock out at the end of your shift.' : 'Please clock in to start your shift.'}</p>
      </div>

      <div className="clock-buttons">
        <button onClick={handleClockIn} className="clock-btn" disabled={isClockedIn}>Clock In</button>
        <button onClick={handleClockOut} className="clock-btn" disabled={!isClockedIn}>Clock Out</button>
      </div>

      <div className="clock-log">
        <h4>Clock In / Out Log</h4>
        <table className="log-table">
          <thead>
            <tr>
              <th>Employee</th>
              <th>Clock In</th>
              <th>Clock Out</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {clockInOutLog.map((log, index) => (
              <tr key={index}>
                <td>{log.employee}</td>
                <td>{log.clockIn}</td>
                <td>{log.clockOut || 'N/A'}</td>
                <td>{log.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClockInOut;
