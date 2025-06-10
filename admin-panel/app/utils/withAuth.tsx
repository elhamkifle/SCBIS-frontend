   "use client";
   // admin-panel/app/utils/withAuth.tsx
   import { useRouter } from 'next/navigation';
   import { useEffect, useState } from 'react';
   import type { ComponentType, FC } from 'react';
import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

// Loading component for better UX
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
      <p className="mt-4 text-gray-600">Checking authentication...</p>
    </div>
  </div>
);

// Helper function to get and validate token
   const getAccessToken = (): string | null => {
     if (typeof window !== "undefined") {
       return localStorage.getItem('accessToken');
     }
     return null;
   };

// Helper function to check if token is expired (basic check)
const isTokenExpired = (token: string): boolean => {
  try {
    // Basic JWT structure check
    const parts = token.split('.');
    if (parts.length !== 3) return true;
    
    // Decode the payload
    const payload = JSON.parse(atob(parts[1]));
    
    // Check if token has expiration and if it's expired
    if (payload.exp) {
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp < currentTime;
    }
    
    // If no expiration, consider it valid for now
    return false;
  } catch (error) {
    // If we can't parse the token, consider it invalid
    console.warn('Invalid token format:', error);
    return true;
  }
};

// Helper function to clear auth data and redirect
const clearAuthAndRedirect = (router: AppRouterInstance, currentPath?: string) => {
  if (typeof window !== "undefined") {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    
    // Clear cookies
    document.cookie = 'accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    
    // Store current page for redirect after login (but not if it's already login)
    if (currentPath && currentPath !== '/login') {
      localStorage.setItem('redirectAfterLogin', currentPath);
    }
  }
  
  router.replace('/login');
};

   const withAuth = <P extends object>(WrappedComponent: ComponentType<P>): FC<P> => {
     const AuthComponent: FC<P> = (props) => {
       const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const [isLoading, setIsLoading] = useState(true);

       useEffect(() => {
      const checkAuthentication = () => {
        try {
         const token = getAccessToken();
          const currentPath = window.location.pathname;
          
         if (!token) {
            console.log('No authentication token found. Redirecting to login...');
            clearAuthAndRedirect(router, currentPath);
            return;
          }

          // Check if token is expired
          if (isTokenExpired(token)) {
            console.log('Authentication token has expired. Redirecting to login...');
            clearAuthAndRedirect(router, currentPath);
            return;
          }

          // Check if user data exists
          const userData = localStorage.getItem('user');
          if (!userData) {
            console.log('User data not found. Redirecting to login...');
            clearAuthAndRedirect(router, currentPath);
            return;
          }

          // All checks passed
           setIsAuthenticated(true);
        } catch (error) {
          console.error('Error during authentication check:', error);
          clearAuthAndRedirect(router);
        } finally {
          setIsLoading(false);
        }
      };

      checkAuthentication();
    }, [router]);

    // Show loading spinner while checking authentication
    if (isLoading || isAuthenticated === null) {
      return <LoadingSpinner />;
    }

    // If not authenticated, show loading (redirect should be in progress)
    if (!isAuthenticated) {
      return <LoadingSpinner />;
       }

       // If authenticated, render the wrapped component
    return <WrappedComponent {...props} />;
     };

     // Set a display name for easier debugging in React DevTools
     AuthComponent.displayName = `WithAuth(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

     return AuthComponent;
   };

   export default withAuth;