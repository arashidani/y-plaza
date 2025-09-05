import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'

interface NumberInputProps {
  value: number
  onChange: (n: number) => void
  max?: number
  className?: string
}

export function NumberInput({
  value,
  onChange,
  max,
  className
}: NumberInputProps) {
  const options = Array.from({ length: max ?? 10 }, (_, i) => i + 1)

  return (
    <Select value={value.toString()} onValueChange={(v) => onChange(Number(v))}>
      <SelectTrigger className={`h-8 w-20 ${className ?? ''}`}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="max-h-60">
        {options.map((num) => (
          <SelectItem key={num} value={num.toString()}>
            {num}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
