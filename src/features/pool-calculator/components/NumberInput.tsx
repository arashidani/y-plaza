import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface NumberInputProps {
  value: number;
  onChange: (n: number) => void;
  min?: number;
  max?: number;
  className?: string;
  isGroup?: boolean;
}

export function NumberInput({ value, onChange, min = 1, max, className, isGroup = false }: NumberInputProps) {
  // 選択肢の範囲を決定
  const getOptions = () => {
    // グループの場合でも1から選択可能に（団体料金は20名以上で適用される旨の警告は別途表示）
    const actualMin = min ?? 1
    // 通常は19まで、グループは50まで
    const actualMax = max ?? (isGroup ? 50 : 19)
    
    const options = []
    for (let i = actualMin; i <= actualMax; i++) {
      options.push({ value: i.toString(), label: i.toString() })
    }
    
    return options
  }

  const options = getOptions()
  
  // 現在の値がオプションにない場合は追加
  if (!options.find(opt => opt.value === value.toString())) {
    options.push({ value: value.toString(), label: value.toString() })
    options.sort((a, b) => Number(a.value) - Number(b.value))
  }

  return (
    <Select value={value.toString()} onValueChange={(v) => onChange(Number(v))}>
      <SelectTrigger className={`w-20 h-8 ${className ?? ''}`}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="max-h-60">
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}