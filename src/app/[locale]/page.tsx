import React from 'react'
import { Metadata } from 'next'
import { PoolCalculatorClient } from '@/components/page/PoolCalculatorClient'
import { setRequestLocale } from 'next-intl/server'
import { generateLocaleParams } from '@/lib/static-params'

// Node.js Runtime (generateStaticParams使用のため)
export const runtime = 'nodejs'
export const dynamic = 'force-static'
// 24時間キャッシュ
export const revalidate = 86400

interface PageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({
  params
}: PageProps): Promise<Metadata> {
  const { locale } = await params
  const baseURL =
    process.env.NEXT_PUBLIC_SITE_URL || 'https://www.azarashi.work'
  // Always locale-prefixed for canonical consistency
  const currentURL = `${baseURL}/${locale}`

  return {
    alternates: {
      canonical: currentURL,
      languages: {
        ja: `${baseURL}/ja`,
        en: `${baseURL}/en`,
        pt: `${baseURL}/pt`,
        'x-default': baseURL
      }
    }
  }
}

export async function generateStaticParams() {
  return generateLocaleParams()
}

export default async function PoolCalculatorPage({ params }: PageProps) {
  const { locale } = await params
  setRequestLocale(locale)

  return <PoolCalculatorClient />
}
