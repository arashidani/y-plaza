// 将来的な国際化対応のための準備ファイル

export const locales = ['ja', 'en', 'pt'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'ja';

// ロケール判定関数（将来的にnext-intlで置き換え）
export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
}

// 現在は日本語固定
export function getCurrentLocale(): Locale {
  return defaultLocale;
}
