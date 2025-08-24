import { useState, useEffect } from 'react'
import { validateNumberInput } from '../models/validation'

interface NumberInputProps {
  value: number;
  onChange: (n: number) => void;
  min?: number;
  max?: number;
  className?: string;
  isGroup?: boolean;
}

export function NumberInput({ value, onChange, min = 1, max, className, isGroup = false }: NumberInputProps) {
  const [inputValue, setInputValue] = useState(value.toString())
  const [error, setError] = useState<string>()

  // 外部からのvalue変更を反映
  useEffect(() => {
    setInputValue(value.toString())
  }, [value])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value
    setInputValue(raw)
    
    // 空文字の場合はminを適用
    if (raw === '') {
      const fallbackValue = min ?? (isGroup ? 20 : 1)
      onChange(fallbackValue)
      setError(undefined)
      return
    }

    const numValue = Number(raw)
    
    // バリデーション
    const validation = validateNumberInput(numValue, isGroup)
    
    if (validation.success && validation.data !== undefined) {
      onChange(validation.data)
      setError(undefined)
    } else {
      setError(validation.error)
      // エラーの場合でも数値として有効であれば値を更新（UIの応答性のため）
      if (Number.isFinite(numValue)) {
        onChange(numValue)
      }
    }
  }

  const handleBlur = () => {
    // フォーカス離脱時に値を正規化
    if (inputValue === '' || !Number.isFinite(Number(inputValue))) {
      const fallbackValue = min ?? (isGroup ? 20 : 1)
      setInputValue(fallbackValue.toString())
      onChange(fallbackValue)
      setError(undefined)
    }
  }

  return (
    <div className="relative">
      <input
        type="number"
        min={min}
        max={max}
        value={inputValue}
        onChange={handleChange}
        onBlur={handleBlur}
        className={`w-20 rounded border px-2 py-1 text-sm ${
          error ? 'border-red-500' : ''
        } ${className ?? ''}`}
      />
      {error && (
        <div className="absolute top-full left-0 mt-1 text-xs text-red-600 whitespace-nowrap z-10">
          {error}
        </div>
      )}
    </div>
  )
}