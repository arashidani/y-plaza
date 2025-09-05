import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET() {
  const cookieStore = cookies()
  const consent = (await cookieStore).get('consent')

  if (consent?.value !== 'true') {
    return NextResponse.json(
      { error: 'Cookie consent not given' },
      { status: 403 }
    )
  }

  return NextResponse.json({ data: 'secret data' })
}
