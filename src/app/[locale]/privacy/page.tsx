'use client'

import { type Locale } from '@/constants/locales'
import { MDXProvider } from '@mdx-js/react'
import { useParams } from 'next/navigation'
import JaPrivacyPolicy from '@/content/privacy-policy-ja.md'
import EnPrivacyPolicy from '@/content/privacy-policy-en.md'
import PtPrivacyPolicy from '@/content/privacy-policy-pt.md'

const privacyPolicies = {
  ja: JaPrivacyPolicy,
  en: EnPrivacyPolicy,
  pt: PtPrivacyPolicy,
} as const

const mdxComponents = {
  h1: ({ children }: { children: React.ReactNode }) => (
    <h1 className="text-3xl font-bold mb-6 text-primary">{children}</h1>
  ),
  h2: ({ children }: { children: React.ReactNode }) => (
    <h2 className="text-2xl font-semibold mt-8 mb-4 text-primary">{children}</h2>
  ),
  p: ({ children }: { children: React.ReactNode }) => (
    <p className="mb-4 leading-relaxed text-foreground">{children}</p>
  ),
  ol: ({ children }: { children: React.ReactNode }) => (
    <ol className="list-decimal list-inside mb-4 space-y-2 ml-4">{children}</ol>
  ),
  li: ({ children }: { children: React.ReactNode }) => (
    <li className="text-foreground">{children}</li>
  ),
  hr: () => <hr className="my-8 border-border" />,
}

export default function PrivacyPage() {
  const params = useParams()
  const locale = params.locale as Locale
  const PrivacyPolicyComponent = privacyPolicies[locale]

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="prose prose-gray dark:prose-invert max-w-none">
        <MDXProvider components={mdxComponents}>
          <PrivacyPolicyComponent />
        </MDXProvider>
      </div>
    </div>
  )
}
