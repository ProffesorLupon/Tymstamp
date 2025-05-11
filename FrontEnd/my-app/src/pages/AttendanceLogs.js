import React from 'react';

const AttendanceLogs = () => {
  // Placeholder data, can be replaced with props or API data
  const attendanceData = [];

  return (
    <div className="page-container">
      <h2>Attendance Logs</h2>
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
  );
};

export default AttendanceLogs;
