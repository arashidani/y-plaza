import { generateLocaleParams } from '@/lib/static-params'
import { setRequestLocale } from 'next-intl/server'
import { TestCalculator } from '@/components/calculator/TestCalculator'

export const runtime = 'nodejs'
export const dynamic = 'force-static'
// 24時間キャッシュ
export const revalidate = 86400

interface PageProps {
  params: Promise<{ locale: string }>
}

export async function generateStaticParams() {
  return generateLocaleParams()
}

export default async function SamplePage({ params }: PageProps) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-8">
        <div>
          <TestCalculator />
        </div>
      </div>
    </div>
  )
}
