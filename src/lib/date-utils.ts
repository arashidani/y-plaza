export function pad(n: number): string {
  return String(n).padStart(2, '0')
}

export function toDateString(d: Date): string {
  const y = d.getFullYear()
  const m = pad(d.getMonth() + 1)
  const day = pad(d.getDate())
  return `${y}-${m}-${day}`
}

