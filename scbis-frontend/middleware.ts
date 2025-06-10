import { NextRequest, NextResponse } from 'next/server';

// Define which routes should be protected
const protectedRoutes = [
  '/policy-purchase',
  '/claim-submission',
  '/preview',
  '/notifications'
];

// Define which routes are public (login, signup, etc.)
const authRoutes = [
  '/login',
  '/signup',
  '/signup2',
  '/verification'
];

// Define special routes that should always be accessible
const specialRoutes = [
  '/access-denied',
  '/_next', // Allow Next.js resources
  '/favicon.ico'
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Special routes are always accessible
  if (specialRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }
  
  // Get auth token from cookies
  const authToken = request.cookies.get('auth_token')?.value;
  
  // Check if the path is protected
  const isPathProtected = protectedRoutes.some(route => 
    pathname.startsWith(route)
  );
  
  // Check if path is an auth route (login/signup pages)
  const isAuthRoute = authRoutes.some(route => pathname === route);

  // If the path is protected and user is not authenticated, redirect to access denied
  if (isPathProtected && !authToken) {
    const url = new URL('/access-denied', request.url);
    return NextResponse.redirect(url);
  }
  
  // If user is already authenticated and tries to access login/signup pages,
  // redirect them to the personal details page
  if (isAuthRoute && authToken) {
    const url = new URL('/', request.url);
    return NextResponse.redirect(url);
  }
  
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
