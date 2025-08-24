// サポートしている言語
export const SUPPORTED_LOCALES = ['ja', 'en', 'pt'] as const

// ロケールの型定義
export type Locale = (typeof SUPPORTED_LOCALES)[number];

// デフォルト言語
export const DEFAULT_LOCALE: Locale = 'ja'

// ロケール表示名
export const LOCALE_DISPLAY_NAMES: Record<Locale, string> = {
  ja: '日本語',
  en: 'English',
  pt: 'Português',
} as const

// 国旗コード
export const LOCALE_FLAG_CODES: Record<Locale, string> = {
  ja: 'JP',
  en: 'US',
  pt: 'BR',
} as const
