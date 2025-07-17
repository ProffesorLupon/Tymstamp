import React, { useState, useEffect } from 'react';
import apiService from '../api/apiService';
import UploadPhotoModal from '../components/UploadPhotoModal';
import CameraCaptureModal from '../components/CameraCaptureModal'; // Import the new camera modal
import '../styles/ManagerUsers.css';
import '../App.css';

const ManageUsers = () => {
  // State for the form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('employee');
  const [position, setPosition] = useState('');
  const [managerId, setManagerId] = useState('');
  const [faceImage, setFaceImage] = useState(null); // State to hold the captured photo (base64)
  
  // State for UI feedback
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  
  // State for data
  const [users, setUsers] = useState([]);
  const [managers, setManagers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  // State for modals
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isCaptureModalOpen, setIsCaptureModalOpen] = useState(false); // State for the new camera modal
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const response = await apiService.get('/admin/users');
      setUsers(response.data.data || response.data);
    } catch (err) {
      console.error("Failed to fetch users:", err);
      setError("Could not load the list of existing users.");
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [managersResponse, usersResponse] = await Promise.all([
            apiService.get('/admin/managers'),
            apiService.get('/admin/users')
        ]);
        setManagers(managersResponse.data);
        setUsers(usersResponse.data.data || usersResponse.data);
      } catch (err) {
        setError("Could not load initial page data.");
      } finally {
        setLoadingUsers(false);
      }
    };
    fetchInitialData();
  }, []);

  const handleAddUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      // The captured face image will be sent along with other user details.
      const response = await apiService.post('/admin/users', { 
        name, email, password, password_confirmation: password, 
        role, position, manager_id: managerId || null,
        face_image: faceImage // Include the captured photo
      });
      setSuccess(`User "${response.data.user.name}" created successfully!`);
      // Reset form fields after successful creation
      setName(''); setEmail(''); setPassword(''); setRole('employee'); 
      setPosition(''); setManagerId(''); setFaceImage(null);
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create user.');
    } finally {
      setLoading(false);
    }
  };

  const openUploadModal = (employee) => {
    setSelectedEmployee(employee);
    setIsUploadModalOpen(true);
  };

  const handlePhotoUpload = async (file) => {
    if (!selectedEmployee) return;
    const formData = new FormData();
    formData.append('face_image', file);
    setLoading(true);
    try {
      await apiService.post(`/admin/employees/${selectedEmployee.id}/upload-face`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setSuccess('Photo uploaded successfully!');
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || 'Photo upload failed.');
    } finally {
      setLoading(false);
      setIsUploadModalOpen(false);
      setSelectedEmployee(null);
    }
  };

  return (
    <>
      <UploadPhotoModal isOpen={isUploadModalOpen} onClose={() => setIsUploadModalOpen(false)} onUpload={handlePhotoUpload} employee={selectedEmployee} />
      
      {/* Add the new CameraCaptureModal to the page */}
      <CameraCaptureModal isOpen={isCaptureModalOpen} onClose={() => setIsCaptureModalOpen(false)} onCapture={setFaceImage} />

      <div className="section">
        <h3>Add New User</h3>
        {error && <p className="error">{error}</p>}
        {success && <p style={{ color: 'green', marginBottom: '1rem' }}>{success}</p>}
        <form onSubmit={handleAddUser} className="manage-users-form">
          {/* Form fields remain the same */}
          <div>
            <label>Full Name</label>
            <input type="text" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div>
            <label>Email</label>
            <input type="email" placeholder="user@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <label>Password</label>
            <input type="password" placeholder="********" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <div>
            <label>Position</label>
            <input type="text" placeholder="e.g., Software Developer" value={position} onChange={(e) => setPosition(e.target.value)} required />
          </div>
          <div>
            <label>Role</label>
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="employee">Employee</option>
              <option value="manager">Manager</option>
              <option value="hr">HR</option>
            </select>
          </div>
          <div>
            <label>Reports To (Manager)</label>
            <select value={managerId} onChange={(e) => setManagerId(e.target.value)}>
              <option value="">-- No Manager --</option>
              {managers.map(manager => (
                <option key={manager.employee.id} value={manager.employee.id}>
                  {manager.name} ({manager.role})
                </option>
              ))}
            </select>
          </div>

          {/* New section for capturing the reference photo */}
          <div>
            <label>Reference Photo</label>
            <div className="photo-capture-area">
              <div className="photo-preview">
                {faceImage ? <img src={faceImage} alt="Employee" /> : <div className="no-photo">No Photo</div>}
              </div>
              <button type="button" onClick={() => setIsCaptureModalOpen(true)} className="btn-action">
                Take Photo
              </button>
            </div>
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Creating User...' : 'Create User'}
          </button>
        </form>
      </div>

      <div className="section">
        <h3>Existing Users</h3>
        {/* The user table remains the same */}
        {loadingUsers ? <p>Loading users...</p> : (
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Photo</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? users.map(user => (
                <tr key={user.id}>
                  <td>
                    <img 
                      src={user.employee.face_image_path ? `${apiService.defaults.baseURL.replace('/api', '')}/storage/${user.employee.face_image_path}` : '/images/default-avatar.png'} 
                      alt={user.name} 
                      className="user-avatar"
                      onError={(e) => { e.target.onerror = null; e.target.src = '/images/default-avatar.png'; }}
                    />
                  </td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>
                    <button onClick={() => openUploadModal(user.employee)} className="btn-action">
                      Upload Photo
                    </button>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan="5">No users found.</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
};

export default ManageUsers;
