import { NextRequest, NextResponse } from 'next/server';

// Define which routes require user verification (in addition to authentication)
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

// Define which routes are accessible to unverified but authenticated users
const unverifiedUserRoutes = [
  '/dashboard', 
  '/policy-purchase/personal-information'
];

// Define which routes are public (login, signup, etc.)
const authRoutes = [
  '/login',
  '/signup',
  '/signup/page2',
  '/verification',
  '/forgot-password',
  '/reset-password'
];

// Define special routes that should always be accessible
const specialRoutes = [
  '/access-denied',
  '/_next', // Allow Next.js resources
  '/favicon.ico',
  '/', // Landing page
  '/landing-page'
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Special routes are always accessible
  if (specialRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }
  
  // Get auth token from cookies
  const authToken = request.cookies.get('auth_token')?.value;
  
  // Check if the path requires verified user
  const requiresVerification = verifiedUserRoutes.some(route => 
    pathname.startsWith(route)
  );
  
  // Check if path is accessible to unverified users 
  const allowedForUnverified = unverifiedUserRoutes.some(route => 
    pathname.startsWith(route)
  );
  
  // Check if path is an auth route (login/signup pages)
  const isAuthRoute = authRoutes.some(route => pathname === route);

  // If no auth token and trying to access protected content, redirect to access denied
  if ((requiresVerification || allowedForUnverified) && !authToken) {
    const url = new URL('/access-denied', request.url);
    return NextResponse.redirect(url);
  }
  
  // If user is already authenticated and tries to access login/signup pages,
  // redirect them to dashboard
  if (isAuthRoute && authToken) {
    const url = new URL('/dashboard', request.url);
    return NextResponse.redirect(url);
  }
  
  // For verified-only routes, we'll rely on client-side checking in the components
  // since we can't access user verification status from cookies in middleware
  // The Dashboard component will handle showing verification status for unverified users
  
  // Allow the request to continue
  return NextResponse.next();
}

// Configure the middleware to run only on specific paths
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     * - api routes
     */
    '/((?!api|_next/static|_next/image|public).*)',
  ],
};
