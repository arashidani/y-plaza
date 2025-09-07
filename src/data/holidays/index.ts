import y2022 from './2022.json'
import y2023 from './2023.json'
import y2024 from './2024.json'
import y2025 from './2025.json'
import y2026 from './2026.json'

export type HolidaysYearData = {
  year: number
  dates: string[]
  details: {
    date: string
    name: string
  }[]
}

export const HOLIDAYS_BY_YEAR: Record<number, HolidaysYearData> = {
  [y2022.year]: y2022 as HolidaysYearData,
  [y2023.year]: y2023 as HolidaysYearData,
  [y2024.year]: y2024 as HolidaysYearData,
  [y2025.year]: y2025 as HolidaysYearData,
  [y2026.year]: y2026 as HolidaysYearData
}

/**
 * 効率的な祝日検索のためのSetを作成します
 *
 * @param year - 祝日を取得する年
 * @returns 指定された年の全ての祝日をYYYY-MM-DD形式で含むSet。
 *          指定された年のデータが存在しない場合は空のSetを返します。
 */
export function getHolidayDateSet(year: number): Set<string> {
  const d = HOLIDAYS_BY_YEAR[year]
  return new Set(d ? d.dates : [])
}
