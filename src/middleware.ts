import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'

export default auth((req) => {
  const { pathname } = req.nextUrl

  if (pathname.startsWith('/admin')) {
    if (!req.auth) {
      return NextResponse.redirect(new URL('/auth/login', req.url))
    }
    if (req.auth.user.role !== 'admin') {
      return NextResponse.redirect(new URL('/', req.url))
    }
  }

  if ((pathname.startsWith('/auth') && pathname !== '/auth/callback') && req.auth) {
    return NextResponse.redirect(new URL('/', req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/admin/:path*', '/auth/:path*']
}