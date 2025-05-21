"use client";

import { useEffect, useState } from 'react';
import { useUserStore } from '@/store/authStore/useUserStore';
import { fetchUserData } from './userUtils';

interface WithUserDataOptions {
  // Whether to fetch user data on component mount
  fetchOnMount?: boolean;
  // Whether to show loading indicator while fetching
  showLoading?: boolean;
}

/**
 * A higher-order component that fetches the latest user data before rendering the component.
 * 
 * @param Component The component to wrap
 * @param options Configuration options
 * @returns A component with the latest user data
 */
export const withUserData = <P extends object>(
  Component: React.ComponentType<P>,
  options: WithUserDataOptions = { fetchOnMount: true, showLoading: true }
) => {
  return function WithUserDataWrapper(props: P) {
    const user = useUserStore((state) => state.user);
    const [isLoading, setIsLoading] = useState(!!options.fetchOnMount);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
      const loadUserData = async () => {
        if (!user?._id || !options.fetchOnMount) return;
        
        try {
          setIsLoading(true);
          await fetchUserData();
        } catch (err) {
          console.error("Error fetching user data:", err);
          setError("Failed to load the latest user data. Some information may be outdated.");
        } finally {
          setIsLoading(false);
        }
      };
      
      loadUserData();
    }, [user?._id]);

    if (isLoading && options.showLoading) {
      return (
        <div className="flex justify-center items-center min-h-[200px]">
          <div className="loading loading-spinner loading-md"></div>
        </div>
      );
    }

    return (
      <>
        {error && options.showLoading && (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-2 mb-4 text-sm">
            <p>{error}</p>
          </div>
        )}
        <Component {...props} />
      </>
    );
  };
}; 