import { Suspense } from 'react'

interface StreamingWrapperProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function StreamingWrapper({
  children,
  fallback
}: StreamingWrapperProps) {
  return (
    <Suspense
      fallback={
        fallback || (
          <div className="animate-pulse bg-gray-200 h-4 rounded"></div>
        )
      }
    >
      {children}
    </Suspense>
  )
}
