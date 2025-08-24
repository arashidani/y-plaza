/**
 * JSON-LD構造化データの生成
 * SEO最適化のためのschema.org準拠データ
 */

export function webAppJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    // TODO: アプリケーション名を設定
    name: '',
    applicationCategory: 'WebApplication',
    // TODO: アプリケーション説明を設定
    description: '',
    isAccessibleForFree: true,
    operatingSystem: 'Web',
    url: process.env.NEXT_PUBLIC_SITE_URL || '',
    author: {
      '@type': 'Person',
      // TODO: 作成者名を設定
      name: '',
    },
    inLanguage: ['ja', 'en', 'pt'],
    // TODO: キーワードを設定
    keywords: '',
  }
}
