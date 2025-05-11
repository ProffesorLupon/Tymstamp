import React from 'react';

const TravelLogs = () => {
  // Placeholder data, can be replaced with props or API data
  const travelLogs = [];

  return (
    <div className="page-container">
      <h2>Travel Logs</h2>
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
  );
};

export default TravelLogs;
