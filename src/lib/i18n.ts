import { SUPPORTED_LOCALES, type Locale } from '@/constants/locales'

/**
 * 国際化対応のユーティリティ関数
 */

/**
 * 指定された文字列が有効なロケールかどうかを判定
 * @param locale 判定する文字列
 * @returns 有効なロケールの場合true
 */
export function isValidLocale(locale: string): locale is Locale {
  return SUPPORTED_LOCALES.includes(locale as Locale)
}

// Re-export constants for backward compatibility
export { SUPPORTED_LOCALES as locales } from '@/constants/locales'
export { LOCALE_DISPLAY_NAMES as localeNames } from '@/constants/locales'
export { LOCALE_FLAG_CODES as localeFlagCodes } from '@/constants/locales'
export { DEFAULT_LOCALE as defaultLocale } from '@/constants/locales'
export type { Locale } from '@/constants/locales'
