'use client';

import { Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from './useAuth';

/**
 * Client-side Auth Wrapper Component
 * Use this inside page components to protect routes
 */
export function AuthWrapper({ 
  children, 
  requireAuth = true, 
  requireVerification = false 
}: {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireVerification?: boolean;
}) {
  const { isAuthenticated, isVerified, isLoading } = useAuth(requireAuth);

  // Show loading while checking authentication/verification
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-4" />
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  // If verification is required but user is not verified, show loading
  // (useAuth will handle the redirect to dashboard)
  if (requireVerification && isAuthenticated && !isVerified) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <AlertCircle className="w-8 h-8 text-yellow-600 mb-4" />
        <p className="text-gray-600">Redirecting to dashboard...</p>
      </div>
    );
  }

  // If all requirements are met, render children
  return <>{children}</>;
}

/**
 * Higher-Order Component for route protection
 * 
 * @param Component The component to wrap
 * @param requireAuth Whether to require authentication (default: true)
 * @param requireVerification Whether to require user verification (default: false)
 * @returns Protected component
 */
export function withAuth(Component: React.ComponentType, requireAuth = true, requireVerification = false) {
  return function ProtectedRoute(props: Record<string, unknown>) {
    const { isAuthenticated, isVerified, isLoading } = useAuth(requireAuth);

    // Show loading while checking authentication/verification
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      );
    }

    // If verification is required but user is not verified, show loading
    // (useAuth will handle the redirect to dashboard)
    if (requireVerification && isAuthenticated && !isVerified) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen">
          <AlertCircle className="w-8 h-8 text-yellow-600 mb-4" />
          <p className="text-gray-600">Redirecting to dashboard...</p>
        </div>
      );
    }

    // If all requirements are met, render the component
    return <Component {...props} />;
  };
}

export default AuthWrapper; 