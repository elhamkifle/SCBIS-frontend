import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useUserStore } from '@/store/authStore/useUserStore';
import { usePathname } from 'next/navigation';
import { fetchUserData } from './userUtils';

// Routes that require user verification
const verifiedUserRoutes = [
  '/policy-purchase/vehicle-information',
  '/policy-purchase/purchase', 
  '/policy-purchase/policy-selection',
  '/policy-purchase/success',
  '/claim-submission',
  '/policydetails',
  '/claim-details', 
  '/my-policies',
  '/policy-details',
  '/policy-information',
  '/purchaseRequestReview',
  '/purchaseRequestApproved',
  '/purchaseRequestDeclined', 
  '/notifications',
  '/test-policy-selection'
];

export function useAuth(requireAuth = true) {
  const router = useRouter();
  const pathname = usePathname();
  const user = useUserStore((state) => state.user);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Check both the Zustand store and cookies
  const hasCookieAuth = typeof document !== 'undefined' && 
    document.cookie.split(';').some(c => c.trim().startsWith('auth_token='));
  
  // User is authenticated if either the store has user data or cookie exists
  const isAuthenticated = !!user?.accessToken || hasCookieAuth;
  const isVerified = user?.userVerified === true;
  
  // Check if current route requires verification
  const currentRouteRequiresVerification = verifiedUserRoutes.some(route => 
    pathname.startsWith(route)
  );

  useEffect(() => {
    // Set a small delay to allow store hydration
    const timer = setTimeout(async () => {
      // If we're on the access-denied page, don't redirect
      if (pathname === '/access-denied') {
        setIsLoading(false);
        return;
      }
      
      // If authentication is required but user is not authenticated
      if (requireAuth && !isAuthenticated) {
        router.push('/access-denied');
      } else if (!requireAuth && isAuthenticated) {
        // If user is authenticated but trying to access auth pages
        router.push('/dashboard');
      } else if (isAuthenticated && user?._id) {
        // If user is authenticated, refresh user data from the backend
        try {
          const userData = await fetchUserData();
          if (userData === null) {
            // User is no longer authenticated, handle gracefully
          }
        } catch (err) {
          console.error("Failed to refresh user data:", err);
          setError("Failed to refresh user data. Some information may be outdated.");
        }
        
        // Check verification status for routes that require it
        if (currentRouteRequiresVerification && !isVerified) {
          router.push('/dashboard'); // Redirect to dashboard where they'll see verification status
        }
      }
      
      setIsLoading(false);
    }, 100); // Small delay to allow store hydration
    
    return () => clearTimeout(timer);
  }, [requireAuth, isAuthenticated, router, pathname, user, isVerified, currentRouteRequiresVerification]);

  return { isAuthenticated, user, isLoading, error, isVerified };
}

// Additional auth utilities

export function getAuthCookie() {
  if (typeof document === 'undefined') return null;
  
  const cookies = document.cookie.split(';');
  const authCookie = cookies.find(cookie => cookie.trim().startsWith('auth_token='));
  
  return authCookie ? authCookie.split('=')[1] : null;
}

export function getRefreshCookie() {
  if (typeof document === 'undefined') return null;
  
  const cookies = document.cookie.split(';');
  const refreshCookie = cookies.find(cookie => cookie.trim().startsWith('refresh_token='));
  
  return refreshCookie ? refreshCookie.split('=')[1] : null;
}

export function clearAuthCookies() {
  document.cookie = 'auth_token=; path=/; max-age=0; SameSite=Lax';
  document.cookie = 'refresh_token=; path=/; max-age=0; SameSite=Lax';
} 