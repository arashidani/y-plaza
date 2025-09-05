/**
 * JSON-LD構造化データの生成
 * SEO最適化のためのschema.org準拠データ
 */

export function webAppJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: '出雲ゆうプラザ 非公式 料金計算ツール',
    applicationCategory: 'WebApplication',
    description:
      '出雲ゆうプラザの料金区分（9〜6月/7・8月、イブニング、団体、回数券など）に対応した非公式の料金シミュレーター。プール・ジムの利用料金目安を自動計算します。',
    isAccessibleForFree: true,
    operatingSystem: 'Web',
    url: process.env.NEXT_PUBLIC_SITE_URL,
    author: {
      '@type': 'Person',
      name: 'You-Plaza Calculator Developer'
    },
    inLanguage: ['ja', 'en', 'pt'],
    keywords:
      '出雲ゆうプラザ, ゆうプラザ, 料金, 料金表, 入場料, 回数券, 団体料金, イブニング, プール, 温水プール, 室内プール, レジャープール, トレーニングジム, シルバー割引, 障害者割引, ロッカー代, 出雲, 島根, 計算ツール, シミュレーター, You Plaza Izumo, preço, piscina, ginásio, calculadora, Izumo, Shimane',
    about: {
      '@type': 'SportsActivityLocation',
      name: '出雲ゆうプラザ',
      address: '島根県出雲市西新町1丁目2547-2',
      url: 'https://y-plaza.sakura.ne.jp/'
    }
  }
}
