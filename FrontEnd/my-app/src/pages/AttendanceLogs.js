import React, { useState, useEffect } from 'react';
import apiService from '../api/apiService';
import '../Dashboard.css'; // Ensure the main dashboard styles are imported

const AttendanceLogs = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAttendance = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await apiService.get('/attendance/history');
        // The actual data is often nested in a 'data' property in paginated responses
        setAttendanceData(response.data.data || response.data);
      } catch (error) {
        console.error("Failed to fetch attendance logs:", error);
        setError('Could not retrieve attendance history. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, []);

  return (
    <>
      {error && <p className="error">{error}</p>}
      {loading ? (
        <p>Loading logs...</p>
      ) : (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Date</th>
              <th>Clock In</th>
              <th>Clock Out</th>
              <th>Worked Hours</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {attendanceData.length > 0 ? (
              attendanceData.map((entry) => (
                <tr key={entry.id}>
                  <td>{new Date(entry.clock_in_time).toLocaleDateString()}</td>
                  <td>{new Date(entry.clock_in_time).toLocaleTimeString()}</td>
                  <td>{entry.clock_out_time ? new Date(entry.clock_out_time).toLocaleTimeString() : 'N/A'}</td>
                  <td>{entry.worked_hours || 'N/A'}</td>
                  <td>
                    <span className={`badge ${
                        entry.status === 'present' ? 'status-present' :
                        entry.status === 'late' ? 'status-late' :
                        'status-default'
                    }`}>
                        {entry.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">No attendance data available.</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </>
  );
};

export default AttendanceLogs;
