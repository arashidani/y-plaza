import { generateLocaleParams } from '@/lib/static-params'
import { setRequestLocale } from 'next-intl/server'
import { getCachedMarkdown } from '@/lib/file-cache'
import ReactMarkdown from 'react-markdown'

// Node.js Runtime (ファイルシステム使用のため)
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

export default async function PrivacyPage({ params }: PageProps) {
  const { locale } = await params
  setRequestLocale(locale)

  const content = await getCachedMarkdown(locale, 'privacy')

  return (
    <div className="container mx-auto max-w-4xl px-4">
      <div className="prose prose-gray dark:prose-invert [&_h1]:text-primary [&_h2]:text-primary [&_p]:text-foreground [&_li]:text-foreground [&_hr]:border-border max-w-none [&_h1]:mb-6 [&_h1]:text-3xl [&_h1]:font-bold [&_h2]:mt-8 [&_h2]:mb-4 [&_h2]:text-2xl [&_h2]:font-semibold [&_hr]:my-8 [&_ol]:mb-4 [&_ol]:ml-4 [&_ol]:list-inside [&_ol]:list-decimal [&_ol]:space-y-2 [&_p]:mb-4 [&_p]:leading-relaxed">
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
    </div>
  )
}
