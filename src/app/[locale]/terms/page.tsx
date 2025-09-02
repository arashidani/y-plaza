import { type Locale, SUPPORTED_LOCALES } from '@/constants/locales'
import { setRequestLocale } from 'next-intl/server'
import JaTermsOfService from '@/content/terms-of-service-ja.md'
import EnTermsOfService from '@/content/terms-of-service-en.md'
import PtTermsOfService from '@/content/terms-of-service-pt.md'

interface PageProps {
  params: Promise<{ locale: string }>
}

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }))
}

export default async function TermsPage({ params }: PageProps) {
  const { locale } = await params
  setRequestLocale(locale)
  
  const termsOfServices = {
    ja: JaTermsOfService,
    en: EnTermsOfService,
    pt: PtTermsOfService,
  } as const
  
  const TermsOfServiceComponent = termsOfServices[locale as Locale]

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="prose prose-gray dark:prose-invert max-w-none [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:mb-6 [&_h1]:text-primary [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:mt-8 [&_h2]:mb-4 [&_h2]:text-primary [&_p]:mb-4 [&_p]:leading-relaxed [&_p]:text-foreground [&_ol]:list-decimal [&_ol]:list-inside [&_ol]:mb-4 [&_ol]:space-y-2 [&_ol]:ml-4 [&_li]:text-foreground [&_hr]:my-8 [&_hr]:border-border">
        <TermsOfServiceComponent />
      </div>
    </div>
  )
}