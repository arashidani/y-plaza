import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'
import createMDX from '@next/mdx'

const withNextIntl = createNextIntlPlugin()
const withMDX = createMDX({
  extension: /\.mdx?$/,
})

const nextConfig: NextConfig = {
  output: 'standalone',
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],

  // コンパイラ最適化
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // 実験的機能
  experimental: {
    scrollRestoration: true,
    optimizeServerReact: true,
    webpackBuildWorker: true,
  },

  // パフォーマンス最適化
  poweredByHeader: false,
  compress: true,
  
  // 静的ファイルのキャッシュ設定
  async headers() {
    return [
      {
        source: '/flags/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/:path*\\.svg',
        headers: [
          {
            key: 'Cache-Control', 
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/:path*\\.(ico|png|jpg|jpeg|gif|webp)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },

  // Docker環境でのホットリロード対応
  ...(process.env.NODE_ENV === 'development' && {
    webpack: (config: import('webpack').Configuration) => {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
      }
      return config
    },
  }),
}

export default withNextIntl(withMDX(nextConfig))
