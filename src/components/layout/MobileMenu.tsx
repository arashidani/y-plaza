'use client'

import { useState, useEffect, useCallback } from 'react'
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

  // Prevent body scroll when open (class-based, compensate scrollbar width)
  useEffect(() => {
    if (isRendered) {
      const scrollbar = window.innerWidth - document.documentElement.clientWidth
      document.documentElement.style.setProperty(
        '--removed-scrollbar-width',
        `${Math.max(0, scrollbar)}px`
      )
      document.body.classList.add('is-menu-open')
    } else {
      document.body.classList.remove('is-menu-open')
      document.documentElement.style.removeProperty('--removed-scrollbar-width')
    }
    return () => {
      document.body.classList.remove('is-menu-open')
      document.documentElement.style.removeProperty('--removed-scrollbar-width')
    }
  }, [isRendered])

  return (
    <>
      <button
        type="button"
        aria-label="Open menu"
        aria-expanded={isOpen}
        aria-controls="mobile-menu-panel"
        className="sm:hidden inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        onClick={openMenu}
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Overlay */}
      {isRendered && (
        <div
          className="fixed inset-0 z-[10000]"
          role="dialog"
          aria-modal="true"
          aria-labelledby="mobile-menu-title"
        >
          <div
            data-state={isOpen ? 'open' : 'closed'}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 data-[state=closed]:opacity-0"
            onClick={close}
            aria-hidden="true"
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
              'bg-background text-foreground shadow-2xl outline-none border-r',
              'flex flex-col will-change-transform',
              'transition-transform duration-300 ease-out',
              'data-[state=open]:translate-x-0',
              'data-[state=closed]:-translate-x-full'
            ].join(' ')}
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
