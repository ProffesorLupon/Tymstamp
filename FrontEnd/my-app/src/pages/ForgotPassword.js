import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import apiService from '../api/apiService';
import '../App.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await apiService.post('/forgot-password', { email });
      setMessage(response.data.message);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'An error occurred. Please try again.';
      setError(errorMessage);
      console.error('Forgot password failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h2>Forgot Password</h2>
        <p style={{ marginBottom: '1rem', color: '#6c757d' }}>Enter your email and we'll send you a link to reset your password.</p>
        
        {message && <div style={{ color: 'green', marginBottom: '1rem' }}>{message}</div>}
        {error && <div className="error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Sending...' : 'Send Password Reset Link'}
          </button>
        </form>
        <div style={{ marginTop: '1.5rem' }}>
          <Link to="/login" style={{ textDecoration: 'none', color: '#00cec9' }}>Back to Login</Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
