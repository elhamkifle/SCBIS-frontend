   "use client";
   // admin-panel/app/utils/withAuth.tsx
   import { useRouter } from 'next/navigation';
   import { useEffect, useState } from 'react';
   import type { ComponentType, FC } from 'react';

   // Re-using the logic to get token, assuming it's accessible.
   // You might want to centralize this function if used in multiple places.
   const getAccessToken = (): string | null => {
     if (typeof window !== "undefined") {
       return localStorage.getItem('accessToken');
     }
     return null;
   };
   const withAuth = <P extends object>(WrappedComponent: ComponentType<P>): FC<P> => {
     const AuthComponent: FC<P> = (props) => {
       const router = useRouter();
       const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null); // null initially, then true/false

       useEffect(() => {
         const token = getAccessToken();
         if (!token) {
           // If no token, redirect to login page
           // Ensure your login page is at '/login' or adjust the path
           router.replace('/login'); 
         } else {
           // If token exists, user is considered authenticated for client-side routing
           // You might want to add token validation here if needed (e.g., check expiry)
           setIsAuthenticated(true);
         }
       }, [router]); // Added router to dependency array as it's used in effect

       // Optionally, render a loading state while checking authentication
       if (isAuthenticated === null) {
         return <div>Loading...</div>; // Or a proper loading spinner component
       }

       // If authenticated, render the wrapped component
       return isAuthenticated ? <WrappedComponent {...props} /> : null; 
       // If not authenticated, redirection should have started, 
       // returning null or a loader is fine.
     };

     // Set a display name for easier debugging in React DevTools
     AuthComponent.displayName = `WithAuth(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

     return AuthComponent;
   };

   export default withAuth;