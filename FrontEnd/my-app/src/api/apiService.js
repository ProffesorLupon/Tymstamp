import axios from 'axios';

/**
 * Create an Axios instance with a base URL and default headers.
 * The base URL should point to your Laravel backend's API endpoint.
 * It's configured to pull the URL from environment variables, falling back to a local default.
 */
const apiService = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000/api', // Default for local development
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

/**
 * 
 * This function retrieves the token from localStorage and adds it to the
 * Authorization header as a Bearer token. This is crucial for accessing

 * protected API endpoints in the Laravel backend.
 */
apiService.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiService;
