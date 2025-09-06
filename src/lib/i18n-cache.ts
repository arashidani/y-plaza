import { cache } from 'react'
import { hasLocale } from 'next-intl'
import { routing } from '@/i18n/routing'
import { getMinimalMessages } from '@/lib/minimal-i18n'

// メッセージをキャッシュする関数
export const getCachedMessages = cache(async (locale: string) => {
  // サポートされている言語かチェック
  const validLocale = hasLocale(routing.locales, locale)
    ? locale
    : routing.defaultLocale

  try {
    const messages = (await import(`@/messages/${validLocale}.json`)).default
    return messages
  } catch (error) {
    console.error(`Failed to load messages for locale: ${validLocale}`, error)
    // フォールバックとしてデフォルト言語を試行
    if (validLocale !== routing.defaultLocale) {
      try {
        const fallbackMessages = (
          await import(`@/messages/${routing.defaultLocale}.json`)
        ).default
        return fallbackMessages
      } catch (fallbackError) {
        console.error('Failed to load fallback messages', fallbackError)
        // それでも失敗した場合は最小メッセージへフォールバック
        return getMinimalMessages(validLocale)
      }
    }
    // デフォルト言語での読み込み失敗時も最小メッセージへフォールバック
    return getMinimalMessages(validLocale)
  }
})

// ロケール検証もキャッシュ
export const validateLocale = cache((locale: string) => {
  return hasLocale(routing.locales, locale) ? locale : routing.defaultLocale
})
