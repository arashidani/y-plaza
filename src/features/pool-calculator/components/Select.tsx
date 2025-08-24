interface SelectProps<T extends string> {
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
  className?: string;
}

export function Select<T extends string>({ value, onChange, options, className }: SelectProps<T>) {
  return (
    <select 
      value={value} 
      onChange={(e) => onChange(e.target.value as T)} 
      className={'w-full rounded border px-2 py-1 text-sm ' + (className ?? '')}
    > 
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  )
}