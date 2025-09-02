import React from 'react'
import { Metadata } from 'next'
import { PoolCalculatorClient } from '@/components/page/PoolCalculatorClient'
import { setRequestLocale } from 'next-intl/server'
import { SUPPORTED_LOCALES } from '@/constants/locales'

export const revalidate = 60

interface PageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params
  const baseURL = process.env.NEXT_PUBLIC_SITE_URL || 'https://y-plaza.vercel.app'
  const currentURL = locale === 'ja' ? baseURL : `${baseURL}/${locale}`

  return {
    alternates: {
      canonical: currentURL,
      languages: {
        'ja': baseURL,
        'en': `${baseURL}/en`,
        'pt': `${baseURL}/pt`,
        'x-default': baseURL,
      },
    },
  }
}

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }))
}

export default async function PoolCalculatorPage({ params }: PageProps) {
  const { locale } = await params
  setRequestLocale(locale)

  return <PoolCalculatorClient />
}