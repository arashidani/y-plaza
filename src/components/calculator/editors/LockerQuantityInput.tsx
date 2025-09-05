'use client'

import { NumberInput } from '../NumberInput'
import { useTranslations } from 'next-intl'

interface LockerQuantityInputProps {
  value: number
  onChange: (v: number) => void
}

export function LockerQuantityInput({ value, onChange }: LockerQuantityInputProps) {
  const t = useTranslations('poolCalculator')
  return (
    <div className="flex items-center gap-3">
      <label className="text-sm font-medium">{t('lockerCount')}</label>
      <NumberInput value={value} onChange={onChange} />
    </div>
  )
}
