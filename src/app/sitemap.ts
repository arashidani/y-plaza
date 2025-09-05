import type { MetadataRoute } from 'next'
import { SUPPORTED_LOCALES } from '@/constants/locales'

// Generate a single root sitemap.xml including localized URLs
export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = (
    process.env.NEXT_PUBLIC_SITE_URL || 'https://www.azarashi.work'
  ).replace(/\/$/, '')

  // Known content pages per locale
  const paths = ['/', '/terms', '/privacy']

  const now = new Date()

  // Build alternates map for each path
  const makeAlternates = (basePath: string) => ({
    languages: Object.fromEntries(
      SUPPORTED_LOCALES.map((loc) => [
        loc,
        `${siteUrl}${loc === 'ja' ? '' : `/${loc}`}${basePath === '/' ? '' : basePath}`
      ])
    ) as Record<string, string>
  })

  const entries: MetadataRoute.Sitemap = []

  for (const p of paths) {
    for (const loc of SUPPORTED_LOCALES) {
      const localizedPath = `${loc === 'ja' ? '' : `/${loc}`}${p === '/' ? '' : p}`
      entries.push({
        url: `${siteUrl}${localizedPath}`,
        lastModified: now,
        changeFrequency: 'weekly',
        priority: p === '/' ? 1 : 0.6,
        alternates: makeAlternates(p)
      })
    }
  }

  return entries
}
