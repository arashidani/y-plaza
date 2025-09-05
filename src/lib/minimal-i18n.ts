import { cache } from 'react'
import { SUPPORTED_LOCALES, DEFAULT_LOCALE } from '@/constants/locales'

// 最小限のメッセージのみを含む軽量版
type MinimalMessages = {
  poolCalculator: {
    title: string
  }
  footer: {
    copyright: string
  }
}

// 軽量版メッセージ（Critical path用）
const MINIMAL_MESSAGES: Record<string, MinimalMessages> = {
  ja: {
    poolCalculator: {
      title: 'プール料金 計算ツール'
    },
    footer: {
      copyright: '© 2025 Unofficial You Plaza. All rights reserved.'
    }
  },
  en: {
    poolCalculator: {
      title: 'Pool Fee Calculator'
    },
    footer: {
      copyright: '© 2025 Unofficial You Plaza. All rights reserved.'
    }
  },
  pt: {
    poolCalculator: {
      title: 'Calculadora de Taxa da Piscina'
    },
    footer: {
      copyright: '© 2025 Unofficial You Plaza. All rights reserved.'
    }
  }
}

export const getMinimalMessages = cache((locale: string): MinimalMessages => {
  const validLocale = (SUPPORTED_LOCALES as readonly string[]).includes(locale)
    ? locale
    : DEFAULT_LOCALE
  return MINIMAL_MESSAGES[validLocale] || MINIMAL_MESSAGES[DEFAULT_LOCALE]
})
