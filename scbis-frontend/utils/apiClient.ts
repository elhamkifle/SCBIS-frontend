import axios from "axios";
import { refreshToken } from "./axiosInstance";
import { useUserStore } from "@/store/authStore/useUserStore";

// Create a new axios instance for authenticated requests
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  // baseURL: 'http://localhost:3001',
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json"
  }
});

// Add request interceptor to include authorization header
apiClient.interceptors.request.use(
  (config) => {
    const user = useUserStore.getState().user;
    if (user?.accessToken) {
      config.headers.Authorization = `Bearer ${user.accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor to handle token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 (Unauthorized) and we haven't tried to refresh yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Attempt to refresh token
        await refreshToken();
        
        // Update authorization header with new token
        const user = useUserStore.getState().user;
        if (user?.accessToken) {
          originalRequest.headers.Authorization = `Bearer ${user.accessToken}`;
        }
        
        // Retry the original request
        return apiClient(originalRequest);
      } catch (refreshError) {
        // If refresh fails, redirect to login
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default apiClient; 