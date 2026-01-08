import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Create response
  const response = NextResponse.next();

  // Security Headers
  
  // DNS Prefetch Control - Allow DNS prefetching for performance
  response.headers.set('X-DNS-Prefetch-Control', 'on');
  
  // Strict Transport Security (HSTS) - Force HTTPS for 1 year including subdomains
  response.headers.set(
    'Strict-Transport-Security',
    'max-age=31536000; includeSubDomains'
  );
  
  // X-Frame-Options - Prevent clickjacking by disallowing iframe embedding
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  
  // X-Content-Type-Options - Prevent MIME type sniffing
  response.headers.set('X-Content-Type-Options', 'nosniff');
  
  // X-XSS-Protection - Enable browser's XSS filter (legacy browsers)
  response.headers.set('X-XSS-Protection', '1; mode=block');
  
  // Referrer-Policy - Control referrer information
  response.headers.set(
    'Referrer-Policy',
    'strict-origin-when-cross-origin'
  );
  
  // Permissions-Policy - Restrict browser features
  // Note: interest-cohort (FLoC) is deprecated and causes errors in some browsers
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=()'
  );

  // Content Security Policy (CSP) - Comprehensive security policy
  // Note: Adjust based on your needs, especially for analytics/third-party scripts
  // Allow localhost for development debugging
  const isDevelopment = process.env.NODE_ENV === 'development';
  const cspDirectives = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "img-src 'self' data: https: blob:",
    "font-src 'self' https://fonts.gstatic.com",
    isDevelopment 
      ? "connect-src 'self' http://localhost:* http://127.0.0.1:* https://www.google-analytics.com https://analytics.google.com"
      : "connect-src 'self' https://www.google-analytics.com https://analytics.google.com",
    "media-src 'self' blob:",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'self'",
    "upgrade-insecure-requests",
  ].join('; ');
  
  response.headers.set('Content-Security-Policy', cspDirectives);

  return response;
}

// Configure which routes the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     * - public folder files (images, videos, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:jpg|jpeg|gif|png|svg|ico|webp|mp4|webm)).*)',
  ],
};
