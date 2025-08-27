import Link from 'next/link'
import { ReactNode } from 'react'

interface AccessibleLinkProps {
  href: string
  children: ReactNode
  className?: string
  ariaLabel?: string
  isExternal?: boolean
}

export function AccessibleLink({ 
  href, 
  children, 
  className = '', 
  ariaLabel,
  isExternal = false 
}: AccessibleLinkProps) {
  const baseClasses = 'text-blue-700 hover:text-blue-800 underline hover:no-underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 rounded-sm font-medium transition-colors'
  
  if (isExternal) {
    return (
      <a
        href={href}
        className={`${baseClasses} ${className}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={ariaLabel}
      >
        {children}
      </a>
    )
  }

  return (
    <Link
      href={href}
      className={`${baseClasses} ${className}`}
      aria-label={ariaLabel}
    >
      {children}
    </Link>
  )
}