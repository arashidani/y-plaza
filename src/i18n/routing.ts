import { defineRouting } from 'next-intl/routing'
import { createNavigation } from 'next-intl/navigation'
import { SUPPORTED_LOCALES } from '../constants/locales'
import { DEFAULT_LOCALE } from '../constants/locales'

// 利用可能な言語とデフォルト言語を設定
export const routing = defineRouting({
  locales: SUPPORTED_LOCALES,
  defaultLocale: DEFAULT_LOCALE,
  // 必要に応じてロケールプレフィックスを使用
  localePrefix: 'as-needed'
})

// ナビゲーション用のユーティリティを作成
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing)
