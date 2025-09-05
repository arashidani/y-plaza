import { Link } from '@/i18n/routing'
import { getCachedMessages } from '@/lib/i18n-cache'

interface StaticFooterProps {
  locale: string
}

export async function StaticFooter({ locale }: StaticFooterProps) {
  const messages = await getCachedMessages(locale)
  const footerMessages = messages.footer || {}

  return (
    <footer className="bg-background border-t">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-between md:flex-row">
          <p className="text-muted-foreground mb-4 text-sm md:mb-0">
            {footerMessages.copyright ||
              '© 2025 Unofficial You Plaza. All rights reserved.'}
          </p>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <Link
              href="/privacy"
              className="text-muted-foreground hover:text-primary text-sm transition-colors"
            >
              {footerMessages.privacy || 'プライバシーポリシー'}
            </Link>
            <Link
              href="/terms"
              className="text-muted-foreground hover:text-primary text-sm transition-colors"
            >
              {footerMessages.terms || '利用規約'}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
