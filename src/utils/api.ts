import axios from 'axios';

const api = axios.create({
  // baseURL: 'http://localhost:8080', 
  baseURL: 'https://tea-ceremony-be-i86j.onrender.com/',
  withCredentials: true, // Allow cookies to be sent with requests
});

api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const { data } = await api.post('/refresh-token');
        api.defaults.headers.common['Authorization'] = `Bearer ${data.accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        console.error('Refresh token failed', refreshError);
        // Handle logout or redirect to login
      }
    }
    return Promise.reject(error);
  }
);

export default api;