import { NextResponse } from 'next/server'

export async function POST() {
  const res = NextResponse.json({ message: 'consent rejected' })
  res.cookies.set('consent', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    sameSite: 'lax',
    maxAge: 0
  })
  return res
}

