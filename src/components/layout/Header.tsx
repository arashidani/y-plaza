'use client';

import { useEffect } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { type Locale } from '@/constants/locales';
import { locales, localeNames, localeFlagCodes } from '@/lib/i18n';
import { useLanguageStore } from '@/store/languageStore';
import { Globe } from 'lucide-react';
import ReactCountryFlag from 'react-country-flag';
import Link from 'next/link';

export function Header() {
  const { currentLocale, setLocale, initializeLocale } = useLanguageStore();

  useEffect(() => {
    initializeLocale();
  }, [initializeLocale]);

  const handleLanguageChange = (value: Locale) => {
    setLocale(value);
  };

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-4 flex items-center justify-center relative">
        <Link href="/" className="text-2xl font-bold text-primary hover:text-primary/80 transition-colors">
          Y-Plaza Unofficial
        </Link>
        
        <div className="absolute right-0 flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Globe className="h-4 w-4 text-muted-foreground" />
            <Select value={currentLocale} onValueChange={handleLanguageChange}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="言語選択">
                  <div className="flex items-center gap-2">
                    <ReactCountryFlag
                      countryCode={localeFlagCodes[currentLocale]}
                      svg
                      style={{
                        width: '1rem',
                        height: '0.75rem',
                      }}
                    />
                    {localeNames[currentLocale]}
                  </div>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {locales.map((locale) => (
                  <SelectItem key={locale} value={locale}>
                    <div className="flex items-center gap-2">
                      <ReactCountryFlag
                        countryCode={localeFlagCodes[locale]}
                        svg
                        style={{
                          width: '1rem',
                          height: '0.75rem',
                        }}
                      />
                      {localeNames[locale]}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </header>
  );
}