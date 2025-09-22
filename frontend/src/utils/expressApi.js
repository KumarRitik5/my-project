import axios from 'axios';

// Express Server API Configuration
const EXPRESS_API_BASE = 'http://localhost:5000/api';

// Create axios instance for Express server
const expressApi = axios.create({
  baseURL: EXPRESS_API_BASE,
});

// Add auth token to requests if available
expressApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
expressApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Express Server Auth API
export const expressAuthAPI = {
  // Register user
  register: (userData) => expressApi.post('/auth/register', userData),
  
  // Login user
  login: (email, password) => expressApi.post('/auth/login', { email, password }),
  
  // Get current user
  getMe: () => expressApi.get('/auth/me'),
  
  // Forgot Password (Secure version with password hashing)
  forgotPassword: (email, newPassword) => 
    expressApi.post('/auth/forgot-password', { email, newPassword }),
};

// Export the main API instance as well
export default expressApi;
