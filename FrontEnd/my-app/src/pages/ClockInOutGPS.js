import React, { useState, useEffect } from 'react';
import '../App.css'; // Corrected path to App.css

const ClockInOutGPS = () => {
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [clockInOutLog, setClockInOutLog] = useState([
    { employee: 'John Doe', clockIn: '2025-05-07 08:00 AM', clockOut: '2025-05-07 05:00 PM', status: 'Clocked Out', clockInLocation: null, clockOutLocation: '40.7128,-74.0060' },
    { employee: 'Jane Smith', clockIn: '2025-05-07 09:00 AM', clockOut: null, status: 'Clocked In', clockInLocation: '34.0522,-118.2437', clockOutLocation: null }
  ]);
  const [error, setError] = useState(null);
  const [currentPosition, setCurrentPosition] = useState(null);

  const getCurrentPosition = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by your browser'));
      } else {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const coords = position.coords.latitude + ',' + position.coords.longitude;
            resolve(coords);
          },
          (err) => {
            reject(err);
          }
        );
      }
    });
  };

  useEffect(() => {
    // Get current position on component mount
    getCurrentPosition()
      .then((coords) => setCurrentPosition(coords))
      .catch((err) => setError('Failed to get GPS location: ' + err.message));
  }, []);

  const handleClockIn = async () => {
    try {
      const location = await getCurrentPosition();
      const newLog = {
        employee: 'Admin', // You can dynamically assign this
        clockIn: new Date().toLocaleString(),
        clockOut: null,
        status: 'Clocked In',
        clockInLocation: location,
        clockOutLocation: null
      };
      setClockInOutLog([...clockInOutLog, newLog]);
      setIsClockedIn(true);
      setError(null);
    } catch (err) {
      setError('Failed to get GPS location: ' + err.message);
    }
  };

  const handleClockOut = async () => {
    try {
      const location = await getCurrentPosition();
      const updatedLogs = clockInOutLog.map(log => {
        if (log.status === 'Clocked In' && !log.clockOut) {
          log.clockOut = new Date().toLocaleString();
          log.status = 'Clocked Out';
          log.clockOutLocation = location;
        }
        return log;
      });
      setClockInOutLog(updatedLogs);
      setIsClockedIn(false);
      setError(null);
    } catch (err) {
      setError('Failed to get GPS location: ' + err.message);
    }
  };

  return (
    <div className="clock-in-out">
      <div className="clock-header">
        <h3>GPS-based Clock In / Clock Out</h3>
        <p style={{ color: '#000000', fontWeight: 'bold' }}>Manage employee attendance with GPS location</p>
        {currentPosition && <p style={{ color: '#000000', fontWeight: 'bold' }}>Your current location: {currentPosition}</p>}
      </div>

      {error && <div className="error-message">{error}</div>}

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
              <th>Clock In Location</th>
              <th>Clock Out</th>
              <th>Clock Out Location</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {clockInOutLog.map((log, index) => (
              <tr key={index}>
                <td>{log.employee}</td>
                <td>{log.clockIn}</td>
                <td>{log.clockInLocation || 'N/A'}</td>
                <td>{log.clockOut || 'N/A'}</td>
                <td>{log.clockOutLocation || 'N/A'}</td>
                <td>{log.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClockInOutGPS;
