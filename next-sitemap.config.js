/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://y-plaza.vercel.app',
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  changefreq: 'weekly',
  priority: 1.0,
  sitemapSize: 7000,
  exclude: ['/api/*', '/_not-found'],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: '/api/',
      },
    ],
    additionalSitemaps: [],
  },
  // 多言語サイトの設定
  transform: async (config, path) => {
    // デフォルトの変換ロジック
    return {
      loc: path,
      changefreq: config.changefreq,
      priority: config.priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
      alternateRefs: [
        {
          href: `${config.siteUrl}`,
          hreflang: 'ja',
        },
        {
          href: `${config.siteUrl}/en`,
          hreflang: 'en',
        },
        {
          href: `${config.siteUrl}/pt`,
          hreflang: 'pt',
        },
        {
          href: `${config.siteUrl}`,
          hreflang: 'x-default',
        },
      ] ?? [],
    }
  },
}