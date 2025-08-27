'use client'

import { useEffect } from 'react'

export function CriticalCSS() {
  useEffect(() => {
    // 非クリティカルCSSの遅延読み込み
    const loadNonCriticalCSS = () => {
      const links = document.querySelectorAll('link[data-defer-css]')
      links.forEach((link) => {
        const href = link.getAttribute('data-defer-css')
        if (href) {
          const newLink = document.createElement('link')
          newLink.rel = 'stylesheet'
          newLink.href = href
          document.head.appendChild(newLink)
        }
      })
    }

    // ページ読み込み完了後に実行
    if (document.readyState === 'complete') {
      loadNonCriticalCSS()
    } else {
      window.addEventListener('load', loadNonCriticalCSS)
      return () => window.removeEventListener('load', loadNonCriticalCSS)
    }
  }, [])

  return null
}