import axios from 'axios';

const isLocal = import.meta.env.VITE_LOCAL === 'true';
const baseURL = isLocal
  ? 'http://localhost:5000/api'
  : 'https://backend-1089363263041.us-central1.run.app/api';

const api = axios.create({
  baseURL
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// If the server rejects a token as expired/invalid, clear auth state and redirect to login.
// Only triggers when a token is present (avoids redirect loops on login-page 401s from wrong credentials).
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const token = localStorage.getItem('token');
      if (token) {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('cart');
        window.location.href = '/auth';
      }
    }
    return Promise.reject(error);
  }
);

export default api;