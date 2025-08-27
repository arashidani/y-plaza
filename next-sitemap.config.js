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
  },
  // 多言語サイトの設定
  transform: async (config, path) => {
    const locales = ['ja', 'en', 'pt']
    const defaultLocale = 'ja'
    const siteUrl = config.siteUrl

    const pathSegments = path.split('/').filter(Boolean)
    let pathWithoutLocale = path

    // パスから言語コードを除去して、ベースパスを取得
    if (locales.includes(pathSegments[0]) && pathSegments[0] !== defaultLocale) {
      pathWithoutLocale = '/' + pathSegments.slice(1).join('/')
    }

    // 各言語版のalternate refsを動的生成
    const alternateRefs = locales.map(locale => {
      const localePath = locale === defaultLocale ? '' : `/${locale}`
      const pagePath = pathWithoutLocale === '/' ? '' : pathWithoutLocale
      return {
        href: `${siteUrl}${localePath}${pagePath}`,
        hreflang: locale,
      }
    })

    // x-defaultは日本語版（デフォルト言語）を指定
    alternateRefs.push({
      href: `${siteUrl}${pathWithoutLocale === '/' ? '' : pathWithoutLocale}`,
      hreflang: 'x-default',
    })

    return {
      loc: path,
      changefreq: config.changefreq,
      priority: config.priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
      alternateRefs,
    }
  },
}