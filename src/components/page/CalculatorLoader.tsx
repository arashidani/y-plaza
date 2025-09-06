'use client'

import dynamic from 'next/dynamic'
import React from 'react'

// Client-side loader that defers the heavy calculator
const Calculator = dynamic(
  () => import('@/components/calculator/Calculator').then((m) => m.Calculator),
  {
    ssr: false,
    loading: () => (
      <div aria-busy="true" className="mt-4 space-y-3" role="status">
        <div className="h-6 w-3/4 animate-pulse rounded bg-gray-200" />
        <div className="h-24 w-full animate-pulse rounded bg-gray-200" />
        <div className="h-24 w-full animate-pulse rounded bg-gray-200" />
      </div>
    )
  }
)

export function CalculatorLoader() {
  return <Calculator />
}

