import { baseAPI } from './axiosInstance';
import { useUserStore } from '@/store/authStore/useUserStore';

/**
 * Fetch the current user's data from the backend and update the store
 * @returns The updated user data or null if user is not authenticated
 */
export const fetchUserData = async () => {
  const user = useUserStore.getState().user;
  
  if (!user || !user._id) {
    return null;
  }
  
  try {
    const response = await baseAPI.get(`/user/${user._id}`);
    
    if (response.status === 200) {
      // Update the user store with the latest data while preserving tokens
      useUserStore.getState().setUser({
        ...response.data,
        accessToken: user.accessToken,
        refreshToken: user.refreshToken
      });
      
      return response.data;
    } else {
      throw new Error('Failed to fetch user data');
    }
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error;
  }
};

/**
 * Update user data and then refresh the user store with the latest data
 * @param userData Partial user data to update
 * @returns The updated user data
 */
export const updateUserData = async (userData: Record<string, unknown>) => {
  const user = useUserStore.getState().user;
  
  if (!user || !user._id) {
    throw new Error('User not authenticated');
  }
  
  try {
    const response = await baseAPI.patch(`/user/${user._id}`, userData);
    
    if (response.status === 200) {
      // Update the user store with the latest data while preserving tokens
      useUserStore.getState().setUser({
        ...response.data,
        accessToken: user.accessToken,
        refreshToken: user.refreshToken
      });
      
      return response.data;
    } else {
      throw new Error('Failed to update user data');
    }
  } catch (error) {
    console.error('Error updating user data:', error);
    throw error;
  }
}; 