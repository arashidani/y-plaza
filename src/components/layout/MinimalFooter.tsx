import { getMinimalMessages } from '@/lib/minimal-i18n'

interface MinimalFooterProps {
  locale: string
}

export function MinimalFooter({ locale }: MinimalFooterProps) {
  const messages = getMinimalMessages(locale)
  
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-4">
        <p className="text-sm text-muted-foreground text-center">
          {messages.footer.copyright}
        </p>
      </div>
    </footer>
  )
}