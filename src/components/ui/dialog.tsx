'use client'

import * as React from 'react'
import { createPortal } from 'react-dom'
import { cn } from '@/lib/utils'

type DialogContextValue = {
  open: boolean
  setOpen: (v: boolean) => void
}

const DialogContext = React.createContext<DialogContextValue | null>(null)

export function Dialog({
  open,
  onOpenChange,
  children
}: React.PropsWithChildren<{
  open: boolean
  onOpenChange: (v: boolean) => void
}>) {
  const value = React.useMemo<DialogContextValue>(
    () => ({ open, setOpen: onOpenChange }),
    [open, onOpenChange]
  )
  return (
    <DialogContext.Provider value={value}>{children}</DialogContext.Provider>
  )
}

export function DialogTrigger({ children }: React.PropsWithChildren) {
  const ctx = React.useContext(DialogContext)
  if (!ctx) return null
  return (
    <button type="button" onClick={() => ctx.setOpen(true)}>
      {children}
    </button>
  )
}

export function DialogContent({
  children,
  className
}: React.PropsWithChildren<{ className?: string }>) {
  const ctx = React.useContext(DialogContext)
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') ctx?.setOpen(false)
    }
    if (ctx?.open) document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [ctx])

  if (!ctx?.open || !mounted) return null

  const body = (
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        if (e.target === e.currentTarget) ctx.setOpen(false)
      }}
    >
      <div
        className={cn(
          'bg-background text-foreground w-full max-w-md rounded-md border shadow-lg',
          className
        )}
      >
        {children}
      </div>
    </div>
  )

  return createPortal(body, document.body)
}

export function DialogHeader({
  children,
  className
}: React.PropsWithChildren<{ className?: string }>) {
  return <div className={cn('border-b px-4 py-3', className)}>{children}</div>
}

export function DialogFooter({
  children,
  className
}: React.PropsWithChildren<{ className?: string }>) {
  return (
    <div className={cn('flex justify-end gap-2 border-t px-4 py-3', className)}>
      {children}
    </div>
  )
}

export function DialogTitle({
  children,
  className
}: React.PropsWithChildren<{ className?: string }>) {
  return (
    <h2 className={cn('text-base font-semibold', className)}>{children}</h2>
  )
}

export function DialogDescription({
  children,
  className
}: React.PropsWithChildren<{ className?: string }>) {
  return (
    <div className={cn('space-y-2 px-4 py-3 text-sm', className)}>
      {children}
    </div>
  )
}

export function DialogClose({
  children,
  className
}: React.PropsWithChildren<{ className?: string }>) {
  const ctx = React.useContext(DialogContext)
  return (
    <button
      type="button"
      className={cn(
        'hover:bg-accent inline-flex items-center rounded-md border px-3 py-1.5 text-sm',
        className
      )}
      onClick={() => ctx?.setOpen(false)}
    >
      {children}
    </button>
  )
}
