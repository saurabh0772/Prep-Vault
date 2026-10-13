import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://rate-limiter-gateway-y5ff.onrender.com',
  withCredentials: true, // Cookie ke liye chahiye
});

// Har request pe 3 cheez jayegi: x-api-key + Bearer Token + Credentials
axiosInstance.interceptors.request.use((config) => {
  // 1. API Key (env se le, hardcoded nahi)
  config.headers['x-api-key'] = import.meta.env.VITE_API_KEY || 'free_m3hh7c0zm9';

  // 2. Auth Token (Safari fix)
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default axiosInstance;