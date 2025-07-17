import React, { useState, useEffect } from 'react';
import apiService from '../api/apiService';
import '../Dashboard.css';

/**
 * A custom modal for ending a trip. It can either show an input form
 * or a simple message.
 */
const EndTripModal = ({ modalState, onClose, onSubmit, endLocation, setEndLocation }) => {
  if (!modalState.isOpen) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        {modalState.mode === 'form' ? (
          <>
            <h3>End Your Trip</h3>
            <p>Please enter your final destination to complete the trip.</p>
            <input
              type="text"
              placeholder="e.g., Client Office, Home"
              value={endLocation}
              onChange={(e) => setEndLocation(e.target.value)}
              className="travel-logs-input"
            />
            <div className="modal-actions">
              <button onClick={onSubmit} className="btn btn-primary">End Trip</button>
              <button onClick={onClose} className="btn btn-secondary">Cancel</button>
            </div>
          </>
        ) : (
          <>
            <p>{modalState.message}</p>
            <button onClick={onClose} className="btn btn-primary">Close</button>
          </>
        )}
      </div>
    </div>
  );
};


const TravelLogs = () => {
  const [travelLogs, setTravelLogs] = useState([]);
  const [activeTrip, setActiveTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // State for the new modal
  const [modalState, setModalState] = useState({ isOpen: false, mode: 'form', message: '' });
  const [endLocation, setEndLocation] = useState('');

  const fetchTravelLogs = async () => {
    setLoading(true);
    try {
      const response = await apiService.get('/trips');
      const allTrips = response.data.data || response.data;

      const active = allTrips.find(trip => trip.status === 'started');
      const completed = allTrips.filter(trip => trip.status !== 'started');

      setActiveTrip(active);
      setTravelLogs(completed);

    } catch (error) {
      console.error("Failed to fetch travel logs:", error);
      setError('Could not load travel logs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTravelLogs();
  }, []);
  
  // Opens the modal to get user input
  const openEndTripModal = () => {
    setModalState({ isOpen: true, mode: 'form', message: '' });
  };

  // Closes the modal and resets state
  const closeModal = () => {
    setModalState({ isOpen: false, mode: 'form', message: '' });
    setEndLocation('');
  };

  // Handles the submission of the end trip form
  const handleEndTripSubmit = async () => {
    if (!activeTrip) return;

    if (!endLocation) {
      setModalState({ isOpen: true, mode: 'message', message: 'End location is required to stop the trip.' });
      return;
    }

    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 10000 });
      });
      const { latitude, longitude } = position.coords;

      await apiService.post(`/trips/end`, {
        trip_id: activeTrip.id,
        end_location: endLocation,
        end_latitude: latitude,
        end_longitude: longitude,
      });

      setModalState({ isOpen: true, mode: 'message', message: 'Trip ended successfully!' });
      fetchTravelLogs(); // Refresh data in the background

    } catch (err) {
      console.error('Failed to end trip:', err);
      const errorMessage = err.response?.data?.message || 'Error: Could not end the trip.';
      setModalState({ isOpen: true, mode: 'message', message: errorMessage });
    }
  };
  
  if (loading) {
    return <p>Loading travel logs...</p>;
  }

  return (
    <>
      <style>{`
        .modal-backdrop {
          position: fixed; top: 0; left: 0; width: 100%; height: 100%;
          background-color: rgba(0, 0, 0, 0.6); display: flex;
          justify-content: center; align-items: center; z-index: 1000;
        }
        .modal-content {
          background-color: #fff; padding: 2rem; border-radius: 15px;
          box-shadow: 0 5px 15px rgba(0,0,0,0.3); text-align: center;
          max-width: 500px; width: 90%;
        }
        .modal-content h3 { font-size: 1.5rem; margin-bottom: 1rem; }
        .modal-content p { margin-bottom: 1.5rem; font-size: 1.1rem; color: #6c757d !important; }
        .travel-logs-input {
          width: 100%; padding: 0.8rem; margin-bottom: 1rem; border-radius: 8px;
          border: 1px solid #ccc;
        }
        .modal-actions { display: flex; justify-content: center; gap: 1rem; }
        .btn-secondary { background-color: #6c757d; color: white !important; }
        .btn-secondary:hover { background-color: #5a6268; }
      `}</style>
      
      <EndTripModal 
        modalState={modalState}
        onClose={closeModal}
        onSubmit={handleEndTripSubmit}
        endLocation={endLocation}
        setEndLocation={setEndLocation}
      />

      {error && <p className="error">{error}</p>}

      {activeTrip && (
        <div className="section active-trip">
          <h3>Active Trip</h3>
          <p><strong>Purpose:</strong> {activeTrip.purpose}</p>
          <p><strong>Started At:</strong> {new Date(activeTrip.start_time).toLocaleString()}</p>
          <p><strong>From:</strong> {activeTrip.start_location}</p>
          <button onClick={openEndTripModal} className="btn btn-danger">End Trip</button>
        </div>
      )}

      <div className="section">
        <h3>Completed Trips</h3>
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Date</th>
              <th>Purpose</th>
              <th>Route</th>
              <th>Distance (km)</th>
              <th>Duration</th>
            </tr>
          </thead>
          <tbody>
            {travelLogs.length === 0 ? (
              <tr><td colSpan="5">No completed travel logs.</td></tr>
            ) : (
              travelLogs.map((log) => (
                <tr key={log.id}>
                  <td>{new Date(log.start_time).toLocaleDateString()}</td>
                  <td>{log.purpose}</td>
                  <td>{log.start_location} to {log.end_location}</td>
                  <td>{log.distance ? parseFloat(log.distance).toFixed(2) : 'N/A'}</td>
                  <td>
                    {log.start_time && log.end_time
                      ? `${Math.round((new Date(log.end_time) - new Date(log.start_time)) / 60000)} mins`
                      : 'N/A'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default TravelLogs;
