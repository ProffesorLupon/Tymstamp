import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiService from '../api/apiService';
import '../App.css';

const TeamAttendancePage = () => {
  const [teamAttendance, setTeamAttendance] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeamAttendance = async () => {
      setLoading(true);
      try {
        const response = await apiService.get('/manager/team-attendance');
        setTeamAttendance(response.data.data);
      } catch (error) {
        console.error("Failed to fetch team attendance:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeamAttendance();
  }, []);

  return (
    <>
      {loading ? (
        <p>Loading team attendance...</p>
      ) : (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Employee</th>
              <th>Date</th>
              <th>Clock In</th>
              <th>Clock Out</th>
              <th>Worked Hours</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {teamAttendance.length > 0 ? (
              teamAttendance.map((log) => (
                <tr key={log.id}>
                  <td>{log.employee.user.name}</td>
                  <td>{new Date(log.clock_in_time).toLocaleDateString()}</td>
                  <td>{new Date(log.clock_in_time).toLocaleTimeString()}</td>
                  <td>{log.clock_out_time ? new Date(log.clock_out_time).toLocaleTimeString() : 'N/A'}</td>
                  <td>{log.worked_hours || 'N/A'}</td>
                  <td>
                    {/* Corrected 'entry' to 'log' here */}
                    <span className={`badge ${
                        log.status === 'present' ? 'status-approved' :
                        log.status === 'late' ? 'status-late' :
                        'status-default'
                    }`}>
                        {log.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="6">No attendance records found for your team.</td></tr>
            )}
          </tbody>
        </table>
      )}
    </>
  );
};

export default TeamAttendancePage;
