import React, { useState, useRef } from 'react';
import '../styles/FacialRecognition.css'; // Reusing some styles for consistency

/**
 * A modal for uploading a new reference photo for an employee.
 * @param {object} props
 * @param {boolean} props.isOpen - Controls if the modal is visible.
 * @param {function} props.onClose - Function to call when the modal is closed.
 * @param {function} props.onUpload - Function to call with the selected file.
 * @param {object} props.employee - The employee for whom the photo is being uploaded.
 */
const UploadPhotoModal = ({ isOpen, onClose, onUpload, employee }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef();

  if (!isOpen) {
    return null;
  }

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      // Create a preview of the selected image
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadClick = () => {
    if (selectedFile) {
      onUpload(selectedFile);
    }
  };

  return (
    <div className="facial-rec-backdrop">
      <div className="facial-rec-content">
        <h3>Upload Reference Photo</h3>
        <p>For: <strong>{employee?.user?.name}</strong></p>
        
        <div className="upload-container">
          <input
            type="file"
            accept="image/jpeg, image/png"
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
          <button onClick={() => fileInputRef.current.click()} className="btn-select-file">
            Choose Image
          </button>
          
          {preview && (
            <div className="image-preview-container">
              <p>Image Preview:</p>
              <img src={preview} alt="Preview" className="image-preview" />
            </div>
          )}
        </div>

        <div className="facial-rec-actions">
          <button onClick={handleUploadClick} className="btn-capture" disabled={!selectedFile}>
            Upload Photo
          </button>
          <button onClick={onClose} className="btn-cancel">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadPhotoModal;
