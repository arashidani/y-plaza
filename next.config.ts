import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'
import createMDX from '@next/mdx'
import remarkGfm from 'remark-gfm'

const withNextIntl = createNextIntlPlugin()
const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [remarkGfm],
  },
})

const nextConfig: NextConfig = {
  output: 'standalone',
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
  
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
