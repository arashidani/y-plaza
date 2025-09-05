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
          <div className="h-4 animate-pulse rounded bg-gray-200"></div>
        )
      }
    >
      {children}
    </Suspense>
  )
}
