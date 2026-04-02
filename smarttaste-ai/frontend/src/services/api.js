/**
 * API Service Configuration
 * Handles all HTTP requests to the backend
 */
import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
  updatePassword: (data) => api.put('/auth/updatepassword', data)
};

// Restaurant API calls
export const restaurantAPI = {
  getAll: (params) => api.get('/restaurants', { params }),
  getById: (id) => api.get(`/restaurants/${id}`),
  getReviews: (id) => api.get(`/restaurants/${id}/reviews`),
  getWaitTime: (id) => api.get(`/restaurants/${id}/wait-time`)
};

// AI API calls
export const aiAPI = {
  getRecommendation: (mood) => api.post('/ai/recommend', { mood }),
  analyzeVoice: (text) => api.post('/ai/voice-analyze', { text }),
  chat: (message, context) => api.post('/ai/chat', { message, context })
};

export default api;
