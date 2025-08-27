import { useState, useMemo } from 'react'
import type { Line, LineType } from '../models/types'
import { calcLineTotal } from '../utils/calculations'
import { generateId } from '../utils/id'
import { getDefaultPoolTariff } from '../utils/timeBasedDefaults'

export function usePoolCalculator() {
  const [lines, setLines] = useState<Line[]>([
    { id: generateId(), type: 'pool', tariff: getDefaultPoolTariff(), entries: [{ category: 'adult', count: 1, disabledDiscount: false }] },
  ])
  
  const [enabledTypes, setEnabledTypes] = useState<Set<LineType>>(new Set(['pool']))

  const toggleType = (type: LineType) => {
    setEnabledTypes(prev => {
      const newSet = new Set(prev)
      if (newSet.has(type)) {
        newSet.delete(type)
        // 該当する行を削除
        setLines(currentLines => currentLines.filter(line => line.type !== type))
      } else {
        newSet.add(type)
        // 該当する行がまだ存在しない場合のみ追加
        setLines(currentLines => {
          const hasExisting = currentLines.some(line => line.type === type)
          if (!hasExisting) {
            const id = generateId()
            // プール利用者・会員がいるかチェック（現在の行から）
            const hasPoolOrMember = currentLines.some(line => line.type === 'pool' || line.type === 'membership')
            
            const next: Line =
              type === 'pool'
                ? { id, type: 'pool', tariff: getDefaultPoolTariff(), entries: [{ category: 'adult', count: 1, disabledDiscount: false }] }
                : type === 'gym'
                ? { id, type: 'gym', who: hasPoolOrMember ? 'member_or_pool_user' : 'adult', count: 1 }
                : type === 'locker'
                ? { id, type: 'locker', count: 1 }
                : type === 'membership'
                ? { id, type: 'membership', category: 'adult', duration: '30d', count: 1, disabledDiscount: false }
                : { id, type: 'coupon', category: 'adult', books: 1 }
            return [...currentLines, next]
          }
          return currentLines
        })
      }
      return newSet
    })
  }

  const updateLine = (id: string, updatedLine: Line) => {
    setLines(prev => prev.map(line => line.id === id ? { ...updatedLine, id } : line))
  }

  const deleteLine = (id: string) => {
    const lineToDelete = lines.find(line => line.id === id)
    if (!lineToDelete) return
    
    setLines(prev => prev.filter(line => line.id !== id))
    setEnabledTypes(prev => {
      const newSet = new Set(prev)
      newSet.delete(lineToDelete.type)
      return newSet
    })
  }

  const clear = () => {
    setLines([])
    setEnabledTypes(new Set())
  }

  const total = useMemo(() => lines.reduce((acc, ln) => acc + calcLineTotal(ln), 0), [lines])

  // プール利用者または会員がいるかチェック
  const hasPoolUserOrMember = useMemo(() => {
    const hasPoolUser = lines.some(line => line.type === 'pool')
    const hasMember = lines.some(line => line.type === 'membership')
    return hasPoolUser || hasMember
  }, [lines])

  const subtotal = useMemo(() => {
    return {
      pool: lines.filter((l) => l.type === 'pool').reduce((a, b) => a + calcLineTotal(b), 0),
      gym: lines.filter((l) => l.type === 'gym').reduce((a, b) => a + calcLineTotal(b), 0),
      locker: lines.filter((l) => l.type === 'locker').reduce((a, b) => a + calcLineTotal(b), 0),
      membership: lines.filter((l) => l.type === 'membership').reduce((a, b) => a + calcLineTotal(b), 0),
      coupon: lines.filter((l) => l.type === 'coupon').reduce((a, b) => a + calcLineTotal(b), 0),
    }
  }, [lines])

  return {
    lines,
    enabledTypes,
    total,
    subtotal,
    hasPoolUserOrMember,
    toggleType,
    updateLine,
    deleteLine,
    clear,
  }
}