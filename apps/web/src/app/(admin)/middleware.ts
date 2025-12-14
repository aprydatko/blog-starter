import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'

// This middleware protects admin routes
// It will redirect to the login page if the user is not authenticated
// and trying to access any /admin/* routes
export const config = {
  matcher: ['/admin/:path*'], // Match all admin routes
}

export default auth(req => {
  const isLoggedIn = !!req.auth // Check if the user is authenticated
  const isAdminRoute = req.nextUrl.pathname.startsWith('/admin') // Check if the route is an admin route

  // Redirect to login if not authenticated and trying to access admin routes
  if (isAdminRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL('/login', req.nextUrl.origin)) // Redirect to login
  }

  return NextResponse.next() // Continue the request if authenticated
})
