'use client';

import { useLanguageStore } from '@/store/languageStore';

interface LayoutClientProps {
  children: React.ReactNode;
}

export function LayoutClient({ children }: LayoutClientProps) {
  const { currentLocale } = useLanguageStore();

  return (
    <html lang={currentLocale}>
      {children}
    </html>
  );
}