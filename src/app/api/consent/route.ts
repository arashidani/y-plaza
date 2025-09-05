import { NextResponse } from 'next/server'

export async function POST() {
  const res = NextResponse.json({ message: 'consent accepted' })
  res.cookies.set('consent', 'true', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 365
  })
  return res
}
