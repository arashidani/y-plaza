import { NextRequest, NextResponse } from 'next/server'
import { FieldValue } from 'firebase-admin/firestore'
import { initializeFirebase } from '@/lib/firebase'
import { EventFormSchema } from '@/lib/schemas/event'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

function toTimeStr(value?: string | null): string | null {
  if (!value) return null
  // Accept both HH:mm and HH:mm:ss from client, normalize to HH:mm:ss
  const m = value.match(/^(\d{2}):(\d{2})(?::(\d{2}))?$/)
  if (!m) return null
  const hh = m[1]
  const mm = m[2]
  const ss = m[3] ?? '00'
  return `${hh}:${mm}:${ss}`
}

// 指定した年月と曜日の日付を全て取得
function getDatesForYearMonthAndDayOfWeek(
  yearMonth: string,
  dayOfWeek: string
): string[] {
  const [year, month] = yearMonth.split('-').map(Number)
  const targetDayOfWeek = parseInt(dayOfWeek)
  const dates: string[] = []

  // その月の最後の日を取得
  const lastDay = new Date(year, month, 0).getDate()

  for (let day = 1; day <= lastDay; day++) {
    const date = new Date(year, month - 1, day)
    if (date.getDay() === targetDayOfWeek) {
      const dateStr = date.toISOString().split('T')[0]
      dates.push(dateStr)
    }
  }

  return dates
}

export async function POST(req: NextRequest) {
  try {
    // Firebase初期化
    const db = initializeFirebase()

    const body = await req.json()

    // Zodスキーマでバリデーション
    const validationResult = EventFormSchema.safeParse(body)

    if (!validationResult.success) {
      const errors = validationResult.error.issues
        .map((err) => `${err.path.join('.')}: ${err.message}`)
        .join(', ')

      return NextResponse.json(
        { error: `Validation failed: ${errors}` },
        { status: 400 }
      )
    }

    const {
      inputMode,
      date,
      yearMonth,
      dayOfWeek,
      startsAt,
      endsAt,
      title,
      instructor,
      areaCategory,
      color,
      paid = false,
      published = true,
      source = null
    } = validationResult.data

    const starts_at = toTimeStr(startsAt)
    const ends_at = toTimeStr(endsAt)

    // 作成するイベントの基本データ
    const eventData = {
      starts_at,
      ends_at,
      title,
      instructor:
        instructor && (instructor.ja || instructor.en || instructor.pt)
          ? instructor
          : null,
      areaCategory,
      color: color ?? null,
      paid: !!paid,
      published: !!published,
      source: source ?? null,
      created_at: FieldValue.serverTimestamp(),
      updated_at: FieldValue.serverTimestamp()
    }

    if (inputMode === 'single') {
      // 単発作成
      const ref = await db.collection('events').add({
        ...eventData,
        date
      })
      return NextResponse.json({ id: ref.id, count: 1 })
    } else {
      // 一括作成
      const dates = getDatesForYearMonthAndDayOfWeek(yearMonth!, dayOfWeek!)
      const createdIds: string[] = []

      for (const eventDate of dates) {
        const ref = await db.collection('events').add({
          ...eventData,
          date: eventDate
        })
        createdIds.push(ref.id)
      }

      return NextResponse.json({
        ids: createdIds,
        count: createdIds.length,
        dates: dates
      })
    }
  } catch (err: unknown) {
    console.error('Create event failed', err)
    return NextResponse.json(
      { error: 'Internal error creating event' },
      { status: 500 }
    )
  }
}
