import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'
import createMDX from '@next/mdx'

const withNextIntl = createNextIntlPlugin()
const withMDX = createMDX({
  extension: /\.mdx?$/
})

const nextConfig: NextConfig = {
  output: 'standalone',
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],

  // コンパイラ最適化
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production'
  },

  // 実験的機能
  experimental: {
    scrollRestoration: true,
    optimizeServerReact: true,
    webpackBuildWorker: true
  },

  // サーバー外部パッケージ
  serverExternalPackages: ['react-markdown', 'remark-gfm'],

  // Turbopack設定
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js'
      }
    }
  },

  // パフォーマンス最適化
  poweredByHeader: false,
  compress: true,

  // 強化されたキャッシュ設定
  async headers() {
    return [
      {
        // CSSは長期キャッシュ＆immutableで再訪問の読み込みを最小化
        source: '/:path*.css',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      },
      {
        // Next.js のビルド出力（将来のパス差異にも対応）
        source: '/_next/static/css/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      },
      {
        // 一部構成で CSS が /chunks 配下になるケースに対応
        source: '/chunks/:path*.css',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      },
      {
        source: '/flags/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          },
          {
            key: 'CDN-Cache-Control',
            value: 'public, max-age=63072000'
          }
        ]
      },
      {
        source: '/:path*\\.(svg|ico|png|jpg|jpeg|gif|webp|woff|woff2)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          },
          {
            key: 'CDN-Cache-Control',
            value: 'public, max-age=63072000'
          }
        ]
      },
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          }
        ]
      },
      {
        source: '/sitemap.xml',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/xml'
          },
          {
            key: 'Cache-Control',
            value:
              'public, max-age=86400, s-maxage=86400, stale-while-revalidate=172800'
          }
        ]
      },
      {
        source: '/robots.txt',
        headers: [
          {
            key: 'Content-Type',
            value: 'text/plain'
          },
          {
            key: 'Cache-Control',
            value:
              'public, max-age=86400, s-maxage=86400, stale-while-revalidate=172800'
          }
        ]
      },
      {
        source: '/ads.txt',
        headers: [
          {
            key: 'Content-Type',
            value: 'text/plain'
          },
          {
            key: 'Cache-Control',
            value:
              'public, max-age=86400, s-maxage=86400, stale-while-revalidate=172800'
          }
        ]
      }
    ]
  },

  // Docker環境でのホットリロード対応
  ...(process.env.NODE_ENV === 'development' && {
    webpack: (config: import('webpack').Configuration) => {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300
      }
      return config
    }
  })
}

export default withNextIntl(withMDX(nextConfig))
