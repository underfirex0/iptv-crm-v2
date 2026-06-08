import { NextResponse } from 'next/server'

export function middleware(request) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get('iptv_auth')?.value

  // Public routes — always allow
  const isPublic = pathname === '/login' || pathname.startsWith('/api/auth') || pathname.startsWith('/_next') || pathname === '/favicon.ico'
  if (isPublic) return NextResponse.next()

  // Not logged in → redirect to login
  if (!token) {
    const loginUrl = new URL('/login', request.url)
    return NextResponse.redirect(loginUrl)
  }

  // Verify token matches expected
  const adminPassword = process.env.ADMIN_PASSWORD || ''
  const secret        = process.env.AUTH_SECRET    || 'iptv-secret'
  const expected      = Buffer.from(`${adminPassword}:${secret}`).toString('base64')

  if (token !== expected) {
    const loginUrl = new URL('/login', request.url)
    const res = NextResponse.redirect(loginUrl)
    res.cookies.set('iptv_auth', '', { maxAge: 0, path: '/' })
    return res
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
