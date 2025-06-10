import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define public routes that don't require authentication
const publicRoutes = ['/login'];

// Define protected routes that require authentication
const protectedRoutes = [
  '/',
  '/settings',
  '/claims',
  '/userManagement',
  '/policyManagement',
  '/purchaseRequests',
  '/premiumCalculation'
];

// Helper function to check if token is expired
function isTokenExpired(token: string): boolean {
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
  } catch {
    // If we can't parse the token, consider it invalid
    return true;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if the current path is a protected route
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname === route || pathname.startsWith(route + '/')
  );
  
  // Check if the current path is a public route
  const isPublicRoute = publicRoutes.some(route => 
    pathname === route || pathname.startsWith(route + '/')
  );

  // Get the access token from cookies or headers
  const accessToken = request.cookies.get('accessToken')?.value || 
                     request.headers.get('authorization')?.replace('Bearer ', '');

  // If it's a protected route and no token exists, redirect to login
  if (isProtectedRoute && !accessToken) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If it's a protected route and token exists but is expired, redirect to login
  if (isProtectedRoute && accessToken && isTokenExpired(accessToken)) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    
    // Create response to clear the expired token
    const response = NextResponse.redirect(loginUrl);
    response.cookies.delete('accessToken');
    
    return response;
  }

  // If user is authenticated and trying to access login page, redirect to dashboard
  if (isPublicRoute && accessToken && !isTokenExpired(accessToken) && pathname === '/login') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
}; 