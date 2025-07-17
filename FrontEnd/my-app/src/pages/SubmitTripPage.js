import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import apiService from '../api/apiService';
import '../App.css';

const SubmitTripPage = () => {
  const [travelPurpose, setTravelPurpose] = useState('');
  const [travelStartLocation, setTravelStartLocation] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleTravelLogSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });
      const { latitude, longitude } = position.coords;

      await apiService.post('/trips/start', {
        purpose: travelPurpose,
        start_location: travelStartLocation,
        start_latitude: latitude,
        start_longitude: longitude,
      });
      setSuccess('Trip started successfully!');
      setTravelPurpose('');
      setTravelStartLocation('');
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to start trip. You may have an active trip already.';
      setError(errorMessage);
      console.error('Failed to start trip:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard">
      <h2 className="dashboard-header">Start a New Trip</h2>
      <div className="section travel-logs">
        {error && <p className="error">{error}</p>}
        {success && <p style={{ color: 'green' }}>{success}</p>}
        <form onSubmit={handleTravelLogSubmit}>
          <input type="text" placeholder="Purpose of Trip" value={travelPurpose} onChange={(e) => setTravelPurpose(e.target.value)} required />
          <input type="text" placeholder="Starting Location (e.g., Office)" value={travelStartLocation} onChange={(e) => setTravelStartLocation(e.target.value)} required />
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Starting...' : 'Start Trip'}
          </button>
        </form>
        <div style={{ marginTop: '1.5rem' }}>
          <Link to="/dashboard" style={{ textDecoration: 'none', color: '#00cec9' }}>Back to Dashboard</Link>
        </div>
      </div>
    </div>
  );
};

export default SubmitTripPage;
