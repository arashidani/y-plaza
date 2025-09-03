'use client'

import { Suspense, lazy } from 'react'

// 動的インポートでAnalyticsとSpeedInsightsを遅延読み込み
const Analytics = lazy(() => 
  import('@vercel/analytics/next').then(module => ({ default: module.Analytics }))
)

const SpeedInsights = lazy(() => 
  import('@vercel/speed-insights/next').then(module => ({ default: module.SpeedInsights }))
)

export function LazyAnalytics() {
  return (
    <Suspense fallback={null}>
      <Analytics />
      <SpeedInsights />
    </Suspense>
  )
}