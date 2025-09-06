'use client'

import React from 'react'

type NavitimeParams = {
  departure: string
  arrival: string
  line: string
  updown: '0' | '1'
}

type Props = React.PropsWithChildren<{
  className?: string
  params: NavitimeParams
}>

export function NavitimeLink({ className, params, children }: Props) {
  // Build today's date on the client so static pages always use the current day
  const today = React.useMemo(() => {
    const d = new Date()
    // Format YYYY-MM-DD in local time
    const yyyy = d.getFullYear()
    const mm = String(d.getMonth() + 1).padStart(2, '0')
    const dd = String(d.getDate()).padStart(2, '0')
    return `${yyyy}-${mm}-${dd}`
  }, [])

  const href = `https://www.navitime.co.jp/diagram/depArrTimeList?departure=${params.departure}&arrival=${params.arrival}&line=${params.line}&updown=${params.updown}&hour=4&date=${today}`

  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
      {children}
    </a>
  )
}

