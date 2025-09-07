import { z } from 'zod'
import { AREA_CATEGORIES } from '@/constants/calendar'

// 多言語テキストのスキーマ
export const LocalizedTextSchema = z.object({
  ja: z.string().min(1, { message: '日本語のタイトルは必須です' }),
  en: z.string().min(1, { message: 'English title is required' }),
  pt: z.string().min(1, { message: 'Português title é obrigatório' })
})

// 時刻の形式をバリデーション (HH:mm または HH:mm:ss)
const TimeSchema = z
  .string()
  .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/, {
    message: '時刻は HH:mm または HH:mm:ss 形式で入力してください'
  })
  .optional()
  .or(z.literal(''))

// イベント作成・更新用のスキーマ
export const CreateEventSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
    message: '日付は YYYY-MM-DD 形式で入力してください'
  }),
  startsAt: TimeSchema,
  endsAt: TimeSchema,
  title: LocalizedTextSchema,
  instructor: LocalizedTextSchema.optional(),
  areaCategory: z.enum(AREA_CATEGORIES, {
    message: 'エリアカテゴリを選択してください'
  }),
  color: z.string().optional(),
  paid: z.boolean().default(false),
  published: z.boolean().default(true),
  source: z.string().optional().nullable()
})

export type CreateEventInput = z.infer<typeof CreateEventSchema>
export type LocalizedText = z.infer<typeof LocalizedTextSchema>

// フォーム用のスキーマ（月選択と一括作成機能）
export const EventFormSchema = z
  .object({
    // 入力モード: single（単発）または bulk（一括作成）
    inputMode: z.enum(['single', 'bulk']),

    // 単発作成用の日付
    date: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, {
        message: '日付は YYYY-MM-DD 形式で入力してください'
      })
      .optional(),

    // 一括作成用の年月
    yearMonth: z
      .string()
      .regex(/^\d{4}-\d{2}$/, {
        message: '年月は YYYY-MM 形式で入力してください'
      })
      .optional(),

    // 曜日選択（一括作成時）
    dayOfWeek: z.enum(['0', '1', '2', '3', '4', '5', '6']).optional(),

    startsAt: z.string().optional(),
    endsAt: z.string().optional(),
    title: LocalizedTextSchema,
    instructor: LocalizedTextSchema.optional().or(
      z.object({
        ja: z.string(),
        en: z.string(),
        pt: z.string()
      })
    ),
    areaCategory: z.enum(AREA_CATEGORIES, {
      message: 'エリアカテゴリを選択してください'
    }),
    color: z.string().optional(),
    paid: z.boolean(),
    published: z.boolean(),
    source: z.string().optional().nullable()
  })
  .refine(
    (data) => {
      // 入力モードに応じた必須項目チェック
      if (data.inputMode === 'single') {
        return !!data.date
      } else if (data.inputMode === 'bulk') {
        return !!data.yearMonth && !!data.dayOfWeek
      }
      return true
    },
    {
      message: '必須項目を入力してください',
      path: ['date']
    }
  )
  .refine(
    (data) => {
      // 両方の時刻が設定されている場合のみバリデーション
      if (
        data.startsAt &&
        data.endsAt &&
        data.startsAt !== 'none' &&
        data.endsAt !== 'none'
      ) {
        const startTime = data.startsAt
        const endTime = data.endsAt

        // 同じ時刻の場合はエラー
        if (startTime === endTime) {
          return false
        }

        // 開始時刻が終了時刻より後の場合はエラー
        if (startTime >= endTime) {
          return false
        }
      }
      return true
    },
    {
      message: '終了時刻は開始時刻よりも後の時刻を選択してください',
      path: ['endsAt']
    }
  )

export type EventFormInput = z.infer<typeof EventFormSchema>
