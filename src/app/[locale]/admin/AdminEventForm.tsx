'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AREA_CATEGORIES, CATEGORY_COLOR } from '@/constants/calendar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { EventFormSchema, type EventFormInput } from '@/lib/schemas/event'

const FIXED_COLORS = Array.from(new Set(Object.values(CATEGORY_COLOR)))

// 15分刻みの時刻選択肢を生成 (7:00-22:00)
const generateTimeOptions = () => {
  const options = []
  for (let hour = 7; hour <= 22; hour++) {
    const maxMinute = hour === 22 ? 0 : 60
    for (let minute = 0; minute < maxMinute; minute += 15) {
      const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
      options.push(timeString)
    }
  }
  // 22:00を手動で追加
  options.push('22:00')
  return options
}

const TIME_OPTIONS = generateTimeOptions()

// 曜日の選択肢
const DAYS_OF_WEEK = [
  { value: '0', label: '日曜日' },
  { value: '1', label: '月曜日' },
  { value: '2', label: '火曜日' },
  { value: '3', label: '水曜日' },
  { value: '4', label: '木曜日' },
  { value: '5', label: '金曜日' },
  { value: '6', label: '土曜日' }
]

export function AdminEventForm() {
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [useInstructor, setUseInstructor] = useState(false)

  const form = useForm<EventFormInput>({
    resolver: zodResolver(EventFormSchema),
    defaultValues: {
      inputMode: 'single',
      date: '',
      yearMonth: '',
      dayOfWeek: undefined,
      startsAt: 'none',
      endsAt: 'none',
      title: { ja: '', en: '', pt: '' },
      instructor: { ja: '', en: '', pt: '' },
      areaCategory: AREA_CATEGORIES[0],
      color: 'default',
      paid: false,
      published: true,
      source: null
    }
  })

  const inputMode = form.watch('inputMode')

  const reset = () => {
    form.reset()
    setUseInstructor(false)
  }

  const onSubmit = async (data: EventFormInput) => {
    setSubmitting(true)
    setResult(null)
    setError(null)
    try {
      const payload = {
        date: data.date,
        startsAt:
          data.startsAt && data.startsAt !== 'none' ? data.startsAt : null,
        endsAt: data.endsAt && data.endsAt !== 'none' ? data.endsAt : null,
        title: data.title,
        areaCategory: data.areaCategory,
        color: data.color && data.color !== 'default' ? data.color : null,
        paid: data.paid,
        published: data.published,
        instructor: useInstructor ? data.instructor : undefined,
        source: null
      }

      const res = await fetch('/api/admin/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      const result: unknown = await res.json()
      if (!res.ok) {
        const msg =
          typeof result === 'object' && result && 'error' in result
            ? String((result as { error: unknown }).error)
            : 'Request failed'
        throw new Error(msg)
      }
      if (data.inputMode === 'single') {
        const id =
          typeof result === 'object' && result && 'id' in result
            ? String((result as { id: unknown }).id)
            : ''
        setResult(`作成完了: ${id}`)
      } else {
        const count =
          typeof result === 'object' && result && 'count' in result
            ? Number((result as { count: unknown }).count)
            : 0
        const dates =
          typeof result === 'object' && result && 'dates' in result
            ? (result as { dates: unknown }).dates
            : []
        setResult(
          `一括作成完了: ${count}件のイベントを作成しました（日付: ${Array.isArray(dates) ? dates.join(', ') : ''}）`
        )
      }
      reset()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle>イベント作成（管理者）</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* 入力モード選択 */}
            <FormField
              control={form.control}
              name="inputMode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>作成モード</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="single">単発作成</SelectItem>
                      <SelectItem value="bulk">一括作成（月単位）</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 日付入力エリア */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {inputMode === 'single' ? (
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>日付</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ) : (
                <>
                  <FormField
                    control={form.control}
                    name="yearMonth"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>年月</FormLabel>
                        <FormControl>
                          <Input type="month" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="dayOfWeek"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>曜日</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="曜日を選択" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {DAYS_OF_WEEK.map((day) => (
                              <SelectItem key={day.value} value={day.value}>
                                {day.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="startsAt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>開始時刻（任意）</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value || 'none'}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="時刻を選択" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="max-h-60">
                          <SelectItem value="none">（未設定）</SelectItem>
                          {TIME_OPTIONS.map((time) => (
                            <SelectItem key={time} value={time}>
                              {time}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="endsAt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>終了時刻（任意）</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value || 'none'}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="時刻を選択" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="max-h-60">
                          <SelectItem value="none">（未設定）</SelectItem>
                          {TIME_OPTIONS.map((time) => (
                            <SelectItem key={time} value={time}>
                              {time}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div>
              <div className="mb-2 text-sm font-medium">タイトル</div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <FormField
                  control={form.control}
                  name="title.ja"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="日本語" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="title.en"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="English" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="title.pt"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Português" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm">
                <Checkbox
                  checked={useInstructor}
                  onCheckedChange={(checked) =>
                    setUseInstructor(checked === true)
                  }
                />
                講師（任意・多言語）を入力する
              </label>
              {useInstructor && (
                <div className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <FormField
                    control={form.control}
                    name="instructor.ja"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input placeholder="講師（日本語）" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="instructor.en"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input placeholder="Instructor (EN)" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="instructor.pt"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input placeholder="Instrutor (PT)" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <FormField
                control={form.control}
                name="areaCategory"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>エリアカテゴリ</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="エリアカテゴリを選択" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {AREA_CATEGORIES.map((c) => (
                          <SelectItem key={c} value={c}>
                            {c}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>カラー（固定候補・任意）</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value || 'default'}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="デフォルト" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="default">（デフォルト）</SelectItem>
                        {FIXED_COLORS.map((col) => (
                          <SelectItem key={col} value={col}>
                            {col}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex items-center gap-4">
                <FormField
                  control={form.control}
                  name="paid"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-y-0 space-x-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="text-sm font-normal">
                        有料
                      </FormLabel>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="published"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-y-0 space-x-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="text-sm font-normal">
                        公開
                      </FormLabel>
                    </FormItem>
                  )}
                />
              </div>
            </div>


            <div className="flex items-center gap-3">
              <Button type="submit" disabled={submitting}>
                {submitting
                  ? '送信中…'
                  : inputMode === 'bulk'
                    ? 'イベントを一括作成（毎週）'
                    : 'イベントを追加'}
              </Button>
              {result && (
                <span className="text-sm text-green-600">{result}</span>
              )}
              {error && <span className="text-sm text-red-600">{error}</span>}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
