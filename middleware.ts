import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL('/calculate', request.url))
  }
}

// Only run on page routes, exclude API, static files, etc.
export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - /api routes
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}