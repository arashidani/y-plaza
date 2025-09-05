import { SUPPORTED_LOCALES } from '@/constants/locales'

// 静的パラメータの生成を共通化
export function generateLocaleParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }))
}

// 全てのサポートされた言語でビルド時に静的生成
export const allLocaleParams = generateLocaleParams()
