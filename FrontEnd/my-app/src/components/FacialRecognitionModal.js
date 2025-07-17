import React, { useRef, useEffect, useState } from 'react';
import '../styles/FacialRecognition.css';

/**
 * A modal component for capturing a user's photo for facial verification.
 * @param {object} props
 * @param {boolean} props.isOpen - Controls if the modal is visible.
 * @param {function} props.onClose - Function to call when the modal is closed.
 * @param {function} props.onCapture - Function to call with the captured image data.
 */
const FacialRecognitionModal = ({ isOpen, onClose, onCapture }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [error, setError] = useState('');

  // Effect to start and stop the camera stream
  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
    }

    // Cleanup function to stop the camera when the component unmounts
    return () => {
      stopCamera();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  /**
   * Starts the camera and requests permission from the user.
   */
  const startCamera = async () => {
    setError('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      setError('Could not access the camera. Please ensure you have given permission.');
    }
  };

  /**
   * Stops the active camera stream.
   */
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  /**
   * Captures a photo from the video stream.
   */
  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      // Set canvas dimensions to match the video feed
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Draw the current video frame onto the canvas
      const context = canvas.getContext('2d');
      context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
      
      // Convert the canvas image to a base64 data URL
      const imageDataUrl = canvas.toDataURL('image/jpeg');
      
      // Pass the captured image data to the parent component
      onCapture(imageDataUrl);
      onClose();
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="facial-rec-backdrop">
      <div className="facial-rec-content">
        <h3>Facial Verification</h3>
        <p>Please position your face in the center of the frame.</p>
        <div className="camera-container">
          {error ? (
            <div className="camera-error">{error}</div>
          ) : (
            <video ref={videoRef} autoPlay playsInline className="camera-feed" />
          )}
          <canvas ref={canvasRef} style={{ display: 'none' }} />
        </div>
        <div className="facial-rec-actions">
          <button onClick={handleCapture} className="btn-capture" disabled={!stream || error}>
            Capture & Clock In
          </button>
          <button onClick={onClose} className="btn-cancel">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default FacialRecognitionModal;
