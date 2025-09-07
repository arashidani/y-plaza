import { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import { generateLocaleParams } from '@/lib/static-params'
import { AdminEventForm } from './AdminEventForm'

export const runtime = 'nodejs'
export const dynamic = 'force-static'

interface PageProps {
  params: Promise<{ locale: string }>
}

export async function generateStaticParams() {
  return generateLocaleParams()
}

export async function generateMetadata({
  params
}: PageProps): Promise<Metadata> {
  const { locale } = await params
  const baseURL =
    process.env.NEXT_PUBLIC_SITE_URL || 'https://www.azarashi.work'
  return {
    title: '管理者ページ | 出雲ゆうプラザ',
    alternates: {
      canonical: `${baseURL}/${locale}/admin`
    }
  }
}

export default async function AdminPage({ params }: PageProps) {
  const { locale } = await params
  setRequestLocale(locale)
  return (
    <div className="container mx-auto max-w-4xl py-6">
      <h1 className="mb-6 text-2xl font-bold">管理者ページ</h1>
      <AdminEventForm />
    </div>
  )
}

