import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Rate limiting storage (in production use Redis or database)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

// Rate limit configuration
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 20; // Max requests per minute per IP

// Trusted IPs that bypass rate limiting (your own servers)
const TRUSTED_IPS = ['127.0.0.1', '::1', 'localhost'];

function getClientIP(request: NextRequest): string {
  // Try to get real IP from headers (when behind proxy)
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }
  
  const realIP = request.headers.get('x-real-ip');
  if (realIP) {
    return realIP;
  }
  
  return request.ip || 'unknown';
}

function isRateLimited(ip: string): boolean {
  // Skip rate limiting for trusted IPs
  if (TRUSTED_IPS.includes(ip)) {
    return false;
  }
  
  const now = Date.now();
  const record = rateLimitMap.get(ip);
  
  if (!record || now > record.resetTime) {
    // First request or window expired
    rateLimitMap.set(ip, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW
    });
    return false;
  }
  
  if (record.count >= MAX_REQUESTS_PER_WINDOW) {
    // Rate limited
    return true;
  }
  
  // Increment counter
  record.count++;
  rateLimitMap.set(ip, record);
  return false;
}

function getSecurityHeaders(response: NextResponse): NextResponse {
  // Add security headers
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  
  // Content Security Policy
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self' data:; connect-src 'self' https://api.telegram.org;"
  );
  
  return response;
}

export function middleware(request: NextRequest) {
  const ip = getClientIP(request);
  const path = request.nextUrl.pathname;
  
  // Check rate limit for API routes and auth pages
  if (path.startsWith('/api/') || path === '/login' || path === '/register' || path === '/forgot-password') {
    if (isRateLimited(ip)) {
      const response = NextResponse.json(
        { error: 'Слишком много запросов. Попробуйте позже.' },
        { status: 429 }
      );
      response.headers.set('Retry-After', '60');
      return getSecurityHeaders(response);
    }
  }
  
  // Block suspicious paths
  const suspiciousPatterns = [
    /\.\./,  // Directory traversal
    /\.env/,
    /\.git/,
    /wp-admin/,
    /wp-login/,
    /phpMyAdmin/,
    /\.php/,
    /\~/
  ];
  
  for (const pattern of suspiciousPatterns) {
    if (pattern.test(path)) {
      return NextResponse.json(
        { error: 'Доступ запрещён' },
        { status: 403 }
      );
    }
  }
  
  // For all other requests, add security headers
  const response = NextResponse.next();
  return getSecurityHeaders(response);
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*$).*)'
  ]
};