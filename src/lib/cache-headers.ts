import { NextResponse } from 'next/server'

export function setCacheHeaders(
  response: NextResponse,
  maxAge: number = 86400
) {
  response.headers.set(
    'Cache-Control',
    `public, max-age=${maxAge}, s-maxage=${maxAge}, stale-while-revalidate=${maxAge * 2}`
  )

  // CDN キャッシュ最適化
  response.headers.set('CDN-Cache-Control', `public, max-age=${maxAge * 7}`)

  // Next.js が自動生成する適切な ETag を使用

  return response
}

export function setStaticCacheHeaders(response: NextResponse) {
  // 静的リソース用の長期キャッシュ
  response.headers.set('Cache-Control', 'public, max-age=31536000, immutable')

  return response
}
