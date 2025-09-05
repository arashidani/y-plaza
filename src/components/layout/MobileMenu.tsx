'use client'

import { useState, useEffect, useCallback } from 'react'
import { Link, usePathname } from '@/i18n/routing'
import { useTranslations } from 'next-intl'
import { Menu, X } from 'lucide-react'

export function MobileMenu() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const tHeader = useTranslations('header')
  const tFooter = useTranslations('footer')

  const close = useCallback(() => setOpen(false), [])

  // Close on route change
  useEffect(() => {
    close()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  // Escape to close
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  // Prevent body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <>
      <button
        type="button"
        aria-label="Open menu"
        aria-expanded={open}
        aria-controls="mobile-menu-panel"
        className="sm:hidden inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        onClick={() => setOpen(true)}
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-[10000]"
          role="dialog"
          aria-modal="true"
          aria-labelledby="mobile-menu-title"
        >
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={close}
            aria-hidden="true"
          />

          {/* Panel */}
          <div
            id="mobile-menu-panel"
            className="fixed inset-y-0 left-0 z-[10001] h-dvh max-h-dvh w-[85%] max-w-xs translate-x-0 text-foreground shadow-2xl outline-none transition-transform duration-300 ease-out will-change-transform border-r data-[state=closed]:-translate-x-full flex flex-col"
            style={{
              backgroundColor: 'var(--color-background, white)',
              color: 'var(--color-foreground, #111827)'
            }}
          >
            <div className="flex items-center justify-between border-b px-4 py-3">
              <h2 id="mobile-menu-title" className="text-base font-semibold">
                {tHeader('title')}
              </h2>
              <button
                type="button"
                aria-label="Close menu"
                className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                onClick={close}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav
              className="flex min-h-0 flex-1 flex-col gap-1 px-2 py-3 bg-background overflow-y-auto pt-[env(safe-area-inset-top)] pb-8 [padding-bottom:env(safe-area-inset-bottom)]"
              style={{ backgroundColor: 'var(--color-background, white)' }}
            >
              <Link
                href="/"
                onClick={close}
                className="block w-full rounded-md px-3 py-3 text-sm font-medium hover:bg-accent hover:text-foreground"
              >
                {tHeader('home')}
              </Link>
              <Link
                href="/privacy"
                onClick={close}
                className="block w-full rounded-md px-3 py-3 text-sm font-medium hover:bg-accent hover:text-foreground"
              >
                {tFooter('privacy')}
              </Link>
              <Link
                href="/terms"
                onClick={close}
                className="block w-full rounded-md px-3 py-3 text-sm font-medium hover:bg-accent hover:text-foreground"
              >
                {tFooter('terms')}
              </Link>
            </nav>
          </div>
        </div>
      )}
    </>
  )
}
