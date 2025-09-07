// moved from src/mocks/events.ts
import { type AreaCategory } from '@/constants/calendar'

export type LocalizedText = {
  ja: string
  en: string
  pt: string
}

export type FirestoreEvent = {
  id: string
  date: string
  starts_at?: string | null
  ends_at?: string | null
  title: LocalizedText
  instructor?: LocalizedText | null
  areaCategory: AreaCategory
  color?: string | null
  published: boolean
  source?: unknown | null
  created_at?: string
  updated_at?: string
}

// Production data source to be connected here.
export async function getEvents(): Promise<FirestoreEvent[]> {
  // TODO: fetch from a real backend (API/DB)
  return []
}
