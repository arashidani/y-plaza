'use client'

import { useEffect } from 'react'

export function CriticalCSS() {
  useEffect(() => {
    // 非クリティカルCSSの遅延読み込み
    const loadNonCriticalCSS = () => {
      // Intersection Observer APIを使用してビューポート外のコンテンツを遅延読み込み
      if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const element = entry.target as HTMLElement
              element.classList.add('loaded')
              observer.unobserve(element)
            }
          })
        })
        
        // 下部セクションを監視
        const sections = document.querySelectorAll('[data-lazy-load]')
        sections.forEach((section) => observer.observe(section))
      }
    }

    // リソースヒントを追加
    const addResourceHints = () => {
      const hints = [
        { rel: 'prefetch', href: '/api/calculator' },
        { rel: 'preload', href: '/flags/us.svg', as: 'image' },
        { rel: 'preload', href: '/flags/br.svg', as: 'image' },
      ]
      
      hints.forEach(({ rel, href, as }) => {
        const link = document.createElement('link')
        link.rel = rel
        link.href = href
        if (as) link.setAttribute('as', as)
        document.head.appendChild(link)
      })
    }

    // ページ読み込み完了後に実行
    if (document.readyState === 'complete') {
      loadNonCriticalCSS()
      addResourceHints()
    } else {
      window.addEventListener('load', () => {
        loadNonCriticalCSS()
        addResourceHints()
      })
    }
  }, [])

  return null
}