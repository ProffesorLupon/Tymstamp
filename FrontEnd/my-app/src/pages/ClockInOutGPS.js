import React, { useState, useEffect } from 'react';
import apiService from '../api/apiService';
import FacialRecognitionModal from '../components/FacialRecognitionModal';
import '../App.css';

const Modal = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <p>{message}</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

const ClockInOutGPS = () => {
  const [todaysAttendance, setTodaysAttendance] = useState(null);
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalMessage, setModalMessage] = useState('');
  
  // State to control the new facial recognition modal
  const [isFaceModalOpen, setIsFaceModalOpen] = useState(false);

  const fetchTodaysAttendance = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await apiService.get('/attendance/today');
      
      if (data && data.id && data.clock_in_time) {
        setTodaysAttendance(data);
        setIsClockedIn(!data.clock_out_time);
      } else {
        setTodaysAttendance(null);
        setIsClockedIn(false);
      }
    } catch (err) {
      console.error("Failed to fetch today's attendance:", err);
      setTodaysAttendance(null);
      setIsClockedIn(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodaysAttendance();
  }, []);

  /**
   * This function is called AFTER the face has been captured.
   * It receives the captured image and sends it to the backend.
   * @param {string} faceImage - The base64 encoded image data from the camera.
   */
  const handleClockInWithFace = async (faceImage) => {
    setLoading(true);
    setError(null);
    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 10000 });
      });
      const { latitude, longitude } = position.coords;

      // In the future, this will call a new verification endpoint.
      // For now, it calls the original clock-in endpoint.
      await apiService.post('/attendance/clock-in', { 
        latitude, 
        longitude,
        face_image: faceImage // The captured image is sent with the request
      });

      setModalMessage('Successfully clocked in!');
      fetchTodaysAttendance();

    } catch (err) {
      handleApiError(err, 'in');
    }
  };

  
  //  Handles the clock-out process, which does not require facial recognition.
   
  const handleClockOut = async () => {
    setLoading(true);
    setError(null);
    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 10000 });
      });
      const { latitude, longitude } = position.coords;
      
      await apiService.post('/attendance/clock-out', { latitude, longitude });
      setModalMessage('Successfully clocked out!');
      fetchTodaysAttendance();
    } catch (err) {
      handleApiError(err, 'out');
    }
  };

  /**
   * Centralized error handler for API calls.
   * @param {Error} err - The error object.
   * @param {string} type - 'in' or 'out'.
   */
  const handleApiError = (err, type) => {
    let errorMessage = `Failed to clock ${type}.`;
    if (err.code && err.code === err.PERMISSION_DENIED) {
        errorMessage = "Geolocation permission denied. Please enable location services.";
    } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
    }
    setError(errorMessage);
    console.error(`Clock-${type} failed:`, err);
    setLoading(false);
  };

  const getStatusMessage = () => {
      if (loading) return "Loading status...";
      if (isClockedIn && todaysAttendance) {
          return `Clocked In at ${new Date(todaysAttendance.clock_in_time).toLocaleTimeString()}`;
      }
      return "Clocked Out";
  };

  return (
    <>
      <style>{/* The existing modal styles remain here */}</style>
      <Modal message={modalMessage} onClose={() => setModalMessage('')} />

      {/* The new Facial Recognition Modal */}
      <FacialRecognitionModal
        isOpen={isFaceModalOpen}
        onClose={() => setIsFaceModalOpen(false)}
        onCapture={handleClockInWithFace}
      />

      <div className="clock-in-out">
        <div className="clock-status">
            <p><strong>Current Status:</strong> {getStatusMessage()}</p>
        </div>

        {error && <div className="error">{error}</div>}

        <div className="clock-buttons">
          <button 
            onClick={isClockedIn ? handleClockOut : () => setIsFaceModalOpen(true)} 
            className={`clock-btn-enhanced ${isClockedIn ? 'out' : 'in'}`} 
            disabled={loading || (todaysAttendance && todaysAttendance.clock_out_time)}
          >
            {loading ? 'Processing...' : (isClockedIn ? 'Clock Out' : 'Clock In')}
          </button>
        </div>

        {todaysAttendance && todaysAttendance.clock_out_time && (
            <p style={{marginTop: '1.5rem', color: '#00cec9', textAlign: 'center'}}>
              You have already clocked in and out for today.
            </p>
        )}
      </div>
    </>
  );
};

export default ClockInOutGPS;
