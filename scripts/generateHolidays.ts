import { mkdirSync, writeFileSync } from 'fs'
import * as path from 'path'
import { getHolidaysOf } from 'japanese-holidays'

// 使い方: pnpm generate:holidays 2026
const year = parseInt(process.argv[2] || '', 10)
if (!year) {
  console.error('Usage: pnpm generate:holidays 2026')
  process.exit(1)
}

type JpHoliday = { month: number; date: number; name: string }
const raw = getHolidaysOf(year) as JpHoliday[]
const holidays = raw.map((h) => ({
  date: `${year}-${String(h.month).padStart(2, '0')}-${String(h.date).padStart(2, '0')}`,
  name: h.name
}))

// Keep stable order
holidays.sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0))

const out = {
  year,
  dates: holidays.map((h) => h.date),
  details: holidays
}

// src/data/holidays/<year>.json
const outDir = path.join(process.cwd(), 'src', 'data', 'holidays')
mkdirSync(outDir, { recursive: true })
const outPath = path.join(outDir, `${year}.json`)
writeFileSync(outPath, JSON.stringify(out, null, 2) + '\n')
console.log(`Generated ${outPath}`)
