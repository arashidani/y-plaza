import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { type Locale, DEFAULT_LOCALE } from '@/constants/locales';
import { isValidLocale } from '@/lib/i18n';

interface LanguageStore {
  currentLocale: Locale;
  setLocale: (locale: Locale) => void;
  initializeLocale: () => void;
}

export const useLanguageStore = create<LanguageStore>()(
  persist(
    (set, get) => ({
      currentLocale: DEFAULT_LOCALE,
      setLocale: (locale: Locale) => {
        set({ currentLocale: locale });
        // TODO: i18nライブラリのrouter.push等を呼ぶ
        console.log('Locale changed to:', locale);
      },
      initializeLocale: () => {
        // ブラウザの言語設定から初期値を決定
        if (typeof window !== 'undefined') {
          const browserLocale = navigator.language.split('-')[0];
          if (isValidLocale(browserLocale)) {
            set({ currentLocale: browserLocale });
          }
        }
      },
    }),
    {
      name: 'language-storage',
      partialize: (state) => ({ currentLocale: state.currentLocale }),
    }
  )
);
