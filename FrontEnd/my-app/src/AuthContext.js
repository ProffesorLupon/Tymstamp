import React, { createContext, useContext, useState, useEffect } from 'react';
import apiService from './api/apiService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('authToken'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // On initial load, check if a token exists and try to fetch user data
    const authToken = localStorage.getItem('authToken');
    if (authToken) {
      setToken(authToken);
      // You might want to add a '/api/user' endpoint check here to verify the token
      // and fetch the user data if the page is reloaded.
      const storedUser = localStorage.getItem('user');
      if(storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    // The login function now makes a POST request to the backend
    const response = await apiService.post('/login', { email, password });
    const { user, access_token } = response.data;

    // Store the token and user data in localStorage and state
    localStorage.setItem('authToken', access_token);
    localStorage.setItem('user', JSON.stringify(user));
    setToken(access_token);
    setUser(user);
    return user; // Return user object on successful login
  };

  const logout = () => {
    // Clear user data and token from state and localStorage
    apiService.post('/logout').finally(() => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        setUser(null);
        setToken(null);
    });
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
