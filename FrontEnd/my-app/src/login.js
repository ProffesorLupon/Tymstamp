// login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css'; // Import the necessary CSS

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Login check for admin credentials
    if (username === 'admin' && password === 'admin') {
      navigate('/admindashboard', { state: { username } }); // Redirect to AdminDashboard with username
    } else if (username === 'employee' && password === 'employee') {
      navigate('/dashboard', { state: { username } }); // Redirect to Employee Dashboard with username
    } else {
      setError('Invalid credentials. Try admin/admin or employee/employee.'); // Error message on invalid login
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h2>Login</h2>
                {error && <div className="error">{error}</div>}
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
