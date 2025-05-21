import axios from "axios";
import { useUserStore } from "@/store/authStore/useUserStore";

export const baseAPI = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
    "Access-Control-Allow-Origin": true,
  },
  withCredentials: false,
})

// Create a new service for auth operations
export const refreshToken = async () => {
  const user = useUserStore.getState().user;
  const refreshToken = user?.refreshToken;
  
  if (!refreshToken) {
    throw new Error('No refresh token available');
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ refreshToken })
    });

    const data = await response.json();

    if (response.ok) {
      // Update the user store with new tokens
      useUserStore.getState().setUser({
        ...user,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken
      });
      
      return data;
    } else {
      // If refresh fails, log the user out
      useUserStore.getState().resetUser();
      throw new Error(data.message || 'Failed to refresh token');
    }
  } catch (error) {
    // Reset user on any error
    useUserStore.getState().resetUser();
    throw error;
  }
};

// Update the auth schema to match backend expectations
export const modifyAuthSchema = () => {
  // This placeholder is for any future schema modifications needed
};