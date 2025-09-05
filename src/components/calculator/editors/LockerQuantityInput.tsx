'use client'

import { NumberInput } from '../NumberInput'

interface LockerQuantityInputProps {
  value: number
  onChange: (v: number) => void
}

export function LockerQuantityInput({ value, onChange }: LockerQuantityInputProps) {
  return (
    <div className="flex items-center gap-3">
      <label className="text-sm font-medium">個数</label>
      <NumberInput value={value} onChange={onChange} />
    </div>
  )
}

