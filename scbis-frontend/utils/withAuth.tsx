'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useUserStore } from '@/store/authStore/useUserStore';

/**
 * Higher-Order Component for route protection
 * 
 * @param Component The component to wrap
 * @param requireAuth Whether to require authentication (default: true)
 * @returns Protected component
 */
export function withAuth(Component: React.ComponentType, requireAuth = true) {
  return function ProtectedRoute(props: any) {
    const router = useRouter();
    const user = useUserStore((state) => state.user);
    const isAuthenticated = !!user?.accessToken;

    useEffect(() => {
      // Check if we're on the client side
      if (typeof window === 'undefined') return;

      // If auth is required but user isn't authenticated
      if (requireAuth && !isAuthenticated) {
        router.push('/login');
      }
      
      // If auth is not required but user is authenticated (for login/signup pages)
      if (!requireAuth && isAuthenticated) {
        router.push('/policy-purchase/personal-information/personalDetails');
      }
    }, [isAuthenticated, router]);

    // Show nothing temporarily while redirecting
    if ((requireAuth && !isAuthenticated) || (!requireAuth && isAuthenticated)) {
      return null;
    }

    // If auth requirements are met, render the component
    return <Component {...props} />;
  };
}

export default withAuth; 