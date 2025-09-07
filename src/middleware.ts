import { NextRequest, NextResponse } from 'next/server'

function unauthorized() {
  return new NextResponse('Authentication required.', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="Admin", charset="UTF-8"' }
  })
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const isAdminPage =
    /\/(ja|en|pt)\/admin(\/.*)?$/.test(pathname) ||
    /^\/admin(\/.*)?$/.test(pathname)
  const isAdminApi = /^\/api\/admin(\/.*)?$/.test(pathname)
  if (!isAdminPage && !isAdminApi) return NextResponse.next()

  const user = process.env.BASIC_AUTH_USER
  const pass = process.env.BASIC_AUTH_PASS
  if (!user || !pass) {
    // If credentials not configured, block access by default
    return unauthorized()
  }

  const auth = req.headers.get('authorization')
  if (!auth?.startsWith('Basic ')) return unauthorized()
  const b64 = auth.slice(6)
  try {
    const [u, p] = Buffer.from(b64, 'base64').toString().split(':')
    if (u === user && p === pass) return NextResponse.next()
    return unauthorized()
  } catch {
    return unauthorized()
  }
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/ja/admin/:path*',
    '/en/admin/:path*',
    '/pt/admin/:path*',
    '/api/admin/:path*'
  ]
}
