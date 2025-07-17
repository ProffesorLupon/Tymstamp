import React, { useRef, useEffect, useState } from 'react';
import '../styles/FacialRecognition.css'; // Reusing styles for a consistent look

/**
 * A generic modal component for capturing a photo using the device's camera.
 * @param {object} props
 * @param {boolean} props.isOpen - Controls if the modal is visible.
 * @param {function} props.onClose - Function to call when the modal is closed.
 * @param {function} props.onCapture - Function to call with the captured image data (base64).
 */
const CameraCaptureModal = ({ isOpen, onClose, onCapture }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [error, setError] = useState('');

  // Effect to start and stop the camera stream based on modal visibility.
  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
    }

    // Cleanup function to ensure the camera is turned off when the component unmounts.
    return () => {
      stopCamera();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  /**
   * Requests camera access and starts the video stream.
   */
  const startCamera = async () => {
    setError('');
    // Ensure we can access the user's camera.
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setError('Camera is not supported by this browser.');
        return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      setError('Could not access the camera. Please ensure you have given permission in your browser settings.');
    }
  };

  /**
   * Stops all tracks of the active camera stream.
   */
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  /**
   * Captures a still frame from the video feed and passes it to the parent.
   */
  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const context = canvas.getContext('2d');
      // Flip the image horizontally to match the mirrored video feed
      context.translate(video.videoWidth, 0);
      context.scale(-1, 1);
      context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
      
      // Convert the canvas image to a base64 data URL (JPEG format).
      const imageDataUrl = canvas.toDataURL('image/jpeg');
      
      onCapture(imageDataUrl);
      onClose(); // Close the modal after capture
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="facial-rec-backdrop">
      <div className="facial-rec-content">
        <h3>Capture Employee Photo</h3>
        <p>Please ask the employee to face the camera.</p>
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
            Take Photo
          </button>
          <button onClick={onClose} className="btn-cancel">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default CameraCaptureModal;
