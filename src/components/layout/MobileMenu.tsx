'use client'

import { useState, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { Link, usePathname } from '@/i18n/routing'
import { useTranslations } from 'next-intl'
import { Menu, X } from 'lucide-react'

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const [isRendered, setIsRendered] = useState(false)
  const pathname = usePathname()
  const tHeader = useTranslations('header')
  const tFooter = useTranslations('footer')

  const close = useCallback(() => setIsOpen(false), [])
  const openMenu = useCallback(() => {
    setIsRendered(true)
    // Next frame to allow transition from closed -> open
    requestAnimationFrame(() => setIsOpen(true))
  }, [])

  // Close on route change
  useEffect(() => {
    close()
  }, [pathname, close])

  // Escape to close
  useEffect(() => {
    if (!isRendered) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [isRendered])

  // Prevent body scroll when open (class-based, no layout reads)
  useEffect(() => {
    if (isRendered) {
      document.body.classList.add('is-menu-open')
    } else {
      document.body.classList.remove('is-menu-open')
    }
    return () => {
      document.body.classList.remove('is-menu-open')
    }
  }, [isRendered])

  return (
    <>
      <button
        type="button"
        aria-label="Open menu"
        aria-expanded={isOpen}
        aria-controls="mobile-menu-panel"
        className="text-muted-foreground hover:bg-accent hover:text-foreground focus:ring-ring inline-flex items-center justify-center rounded-md p-2 focus:ring-2 focus:ring-offset-2 focus:outline-none sm:hidden"
        onClick={openMenu}
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Overlay */}
      {isRendered &&
        createPortal(
          <div
            className="fixed inset-0 z-[10000]"
            role="dialog"
            aria-modal="true"
            aria-labelledby="mobile-menu-title"
            style={{ contain: 'layout paint' }}
          >
            <div
              data-state={isOpen ? 'open' : 'closed'}
              className="absolute inset-0 bg-black/60 transition-opacity duration-300 data-[state=closed]:opacity-0"
              onClick={close}
              aria-hidden="true"
              style={{ contain: 'layout paint' }}
            />

            {/* Panel */}
            <div
              id="mobile-menu-panel"
              data-state={isOpen ? 'open' : 'closed'}
              onTransitionEnd={() => {
                if (!isOpen) setIsRendered(false)
              }}
              className={[
                'fixed inset-y-0 left-0 z-[10001]',
                'h-dvh max-h-dvh w-[85%] max-w-xs',
                'bg-background text-foreground border-r shadow-2xl outline-none',
                'flex flex-col will-change-transform',
                'transition-transform duration-300 ease-out',
                'data-[state=open]:translate-x-0',
                'data-[state=closed]:-translate-x-full'
              ].join(' ')}
              style={{ contain: 'layout paint' }}
            >
              <div className="flex items-center justify-between border-b px-4 py-3">
                <h2 id="mobile-menu-title" className="text-base font-semibold">
                  {tHeader('title')}
                </h2>
                <button
                  type="button"
                  aria-label="Close menu"
                  className="text-muted-foreground hover:bg-accent hover:text-foreground focus:ring-ring inline-flex items-center justify-center rounded-md p-2 focus:ring-2 focus:ring-offset-2 focus:outline-none"
                  onClick={close}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <nav className="bg-background flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto px-2 py-3 pt-[env(safe-area-inset-top)] [padding-bottom:env(safe-area-inset-bottom)] pb-8">
                <Link
                  href="/"
                  onClick={close}
                  className="hover:bg-accent hover:text-foreground block w-full rounded-md px-3 py-3 text-sm font-medium"
                >
                  {tHeader('home')}
                </Link>
                <Link
                  href="/privacy"
                  onClick={close}
                  className="hover:bg-accent hover:text-foreground block w-full rounded-md px-3 py-3 text-sm font-medium"
                >
                  {tFooter('privacy')}
                </Link>
                <Link
                  href="/terms"
                  onClick={close}
                  className="hover:bg-accent hover:text-foreground block w-full rounded-md px-3 py-3 text-sm font-medium"
                >
                  {tFooter('terms')}
                </Link>
                <Link
                  href="/access"
                  onClick={close}
                  className="hover:bg-accent hover:text-foreground block w-full rounded-md px-3 py-3 text-sm font-medium"
                >
                  {tHeader('access')}
                </Link>
              </nav>
            </div>
          </div>,
          document.body
        )}
    </>
  )
}
