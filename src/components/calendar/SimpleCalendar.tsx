'use client'

import { useMemo, useState, useEffect, useCallback } from 'react'
import { HOLIDAY_RED, WEEKEND_BLUE } from '@/constants/calendar'
import { useTranslations } from 'next-intl'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose
} from '@/components/ui/dialog'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import timeGridPlugin from '@fullcalendar/timegrid'

type CalendarEvent = {
  id?: string
  title: string
  start: string | Date
  end?: string | Date
  allDay?: boolean
  backgroundColor?: string
  borderColor?: string
  display?: 'auto' | 'background' | 'inverse-background' | 'none' | 'list-item'
  extendedProps?: Record<string, unknown>
}

type Props = {
  locale: string
  className?: string
  onSelect?: (date: Date) => void
  events?: CalendarEvent[]
  closedDateSet?: Set<string>
  holidayDateSet?: Set<string>
}
type ActiveEvent = {
  title: string
  start: Date | null
  end: Date | null
  description?: string
  instructor?: string
  areaCategory?: string
}

export function SimpleCalendar({
  locale,
  className,
  events: inputEvents,
  closedDateSet,
  holidayDateSet
}: Props) {
  const t = useTranslations('calendar')
  const fcLocale = useMemo(() => (locale === 'pt' ? 'pt-br' : locale), [locale])
  const now = useMemo(() => new Date(), [])
  const fallbackEvents = useMemo(
    () => [
      {
        id: 'evt-1',
        title: 'Sample Event',
        start: new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate()
        ).toISOString()
      },
      {
        id: 'evt-2',
        title: 'Another Event',
        start: new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() + 3
        ).toISOString()
      }
    ],
    [now]
  )

  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    if (typeof window === 'undefined') return
    const mq = window.matchMedia('(max-width: 640px)')
    const onChange = () => setIsMobile(mq.matches)
    onChange()
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  const [activeEvent, setActiveEvent] = useState<ActiveEvent | null>(null)
  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveEvent(null)
    }
    if (activeEvent) document.addEventListener('keydown', onEsc)
    return () => document.removeEventListener('keydown', onEsc)
  }, [activeEvent])

  const applyWeekendColor = useCallback((el: HTMLElement, dow: number) => {
    if (dow === 0) el.style.color = HOLIDAY_RED
    if (dow === 6) el.style.color = WEEKEND_BLUE
  }, [])

  const toDateString = useCallback((d: Date) => {
    const pad = (n: number) => String(n).padStart(2, '0')
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
  }, [])

  return (
    <div className={className}>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={
          isMobile
            ? {
                left: 'prev,next',
                center: 'title',
                right: 'today,dayGridMonth,timeGridWeek'
              }
            : {
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek'
              }
        }
        buttonText={
          isMobile ? { month: 'M', week: 'W', today: 'T' } : undefined
        }
        titleFormat={isMobile ? { year: 'numeric', month: 'short' } : undefined}
        locale={fcLocale}
        selectable={false}
        selectMirror={false}
        dayMaxEvents
        events={inputEvents ?? fallbackEvents}
        height="auto"
        dayHeaderClassNames={(arg) => {
          const dow = arg.date.getDay()
          return dow === 0 ? ['fc-sun'] : dow === 6 ? ['fc-sat'] : []
        }}
        slotMinTime="07:00:00"
        slotMaxTime="22:00:00"
        scrollTime="07:00:00"
        views={{
          timeGridWeek: { allDaySlot: true },
          timeGridDay: { allDaySlot: false }
        }}
        // Disable background slot selection; only event clicks trigger UI
        dayHeaderContent={(info) => {
          const viewType = info.view.type
          // Month (dayGrid*): show weekday short
          if (viewType.startsWith('dayGrid')) {
            return new Intl.DateTimeFormat(fcLocale, {
              weekday: 'short'
            }).format(info.date)
          }
          // Week/Day (timeGrid*): render as two lines => first: M/D, second: (weekday)
          if (viewType.startsWith('timeGrid')) {
            const wd = new Intl.DateTimeFormat(fcLocale, {
              weekday: 'short'
            }).format(info.date)
            const md = new Intl.DateTimeFormat(fcLocale, {
              month: 'numeric',
              day: 'numeric'
            }).format(info.date)
            // Mobile: force explicit line break to avoid overlap
            if (isMobile) {
              return (
                <span className="fc-header-stack">
                  {md}
                  <br />({wd})
                </span>
              )
            }
            // Desktop: stacked spans
            return (
              <span className="fc-header-stack">
                <span className="fc-date">{md}</span>
                <span className="fc-dow">({wd})</span>
              </span>
            )
          }
          return undefined
        }}
        eventClick={(arg) => {
          arg.jsEvent.preventDefault()
          const ex = (
            arg.event as unknown as { extendedProps?: Record<string, unknown> }
          ).extendedProps
          const desc =
            typeof ex?.description === 'string' ? ex.description : undefined
          const instructor =
            typeof ex?.instructor === 'string' ? ex.instructor : undefined
          const areaCategory =
            typeof ex?.areaCategory === 'string' ? ex.areaCategory : undefined
          setActiveEvent({
            title: arg.event.title || 'Event',
            start: arg.event.start,
            end: arg.event.end,
            description: desc,
            instructor,
            areaCategory
          })
        }}
        dayHeaderDidMount={(arg) => {
          const dow = arg.date.getDay()
          const viewType = (arg as unknown as { view?: { type?: string } })
            ?.view?.type
          const el = arg.el.querySelector(
            '.fc-col-header-cell-cushion'
          ) as HTMLElement | null
          const spanDow = arg.el.querySelector('.fc-dow') as HTMLElement | null
          const spanDate = arg.el.querySelector(
            '.fc-date'
          ) as HTMLElement | null

          const pad = (n: number) => String(n).padStart(2, '0')
          const ds = `${arg.date.getFullYear()}-${pad(arg.date.getMonth() + 1)}-${pad(arg.date.getDate())}`
          const isHoliday = holidayDateSet?.has(ds) ?? false

          // In week/day views (timeGrid or dayGridWeek), header corresponds to specific dates
          if (viewType && viewType !== 'dayGridMonth' && isHoliday) {
            // Add class for robust CSS override
            arg.el.classList.add('fc-holiday')
            if (el) el.style.color = HOLIDAY_RED
            if (spanDow) spanDow.style.color = HOLIDAY_RED
            if (spanDate) spanDate.style.color = HOLIDAY_RED
            return
          }

          // Default weekend coloring
          if (el) applyWeekendColor(el, dow)
          if (spanDow) applyWeekendColor(spanDow, dow)
          if (spanDate) applyWeekendColor(spanDate, dow)
        }}
        dayCellDidMount={(arg) => {
          const dow = arg.date.getDay()
          const num = arg.el.querySelector(
            '.fc-daygrid-day-number'
          ) as HTMLElement | null
          if (num) {
            const pad = (n: number) => String(n).padStart(2, '0')
            const ds = `${arg.date.getFullYear()}-${pad(arg.date.getMonth() + 1)}-${pad(arg.date.getDate())}`
            const isHoliday = holidayDateSet?.has(ds) ?? false
            if (isHoliday) {
              num.style.color = HOLIDAY_RED
            } else {
              applyWeekendColor(num, dow)
            }
          }

          // Add small closed badge without overlapping the date number
          if (closedDateSet && closedDateSet.has(toDateString(arg.date))) {
            const badge = document.createElement('span')
            badge.className = 'fc-closed-badge'
            badge.textContent = t('closedDay')
            arg.el.appendChild(badge)
          }
        }}
      />
      <style jsx global>{`
        /* Minimal layout (applies to all sizes) */
        .fc .fc-daygrid-day-top {
          display: flex;
          justify-content: flex-end;
          align-items: center;
          background: transparent;
        }
        .fc .fc-daygrid-day-events {
          margin-top: 0.125rem;
        }
        /* Always stack header for timeGrid (week/day) */
        .fc .fc-timegrid .fc-col-header-cell .fc-col-header-cell-cushion {
          display: inline-flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
          text-align: center;
        }
        .fc .fc-col-header-cell-cushion .fc-dow {
          font-size: 0.85rem;
          line-height: 1.1;
          white-space: nowrap;
        }
        .fc .fc-col-header-cell-cushion .fc-date {
          font-size: 0.85rem;
          line-height: 1.1;
          white-space: nowrap;
        }
        /* Weekend coloring via classNames (desktop & mobile) */
        .fc .fc-col-header .fc-sun .fc-col-header-cell-cushion,
        .fc .fc-col-header .fc-sun .fc-dow,
        .fc .fc-col-header .fc-sun .fc-date {
          color: ${HOLIDAY_RED};
        }
        .fc .fc-col-header .fc-sat .fc-col-header-cell-cushion,
        .fc .fc-col-header .fc-sat .fc-dow,
        .fc .fc-col-header .fc-sat .fc-date {
          color: ${WEEKEND_BLUE};
        }
        /* Ensure weekday text is readable in both themes */
        .fc .fc-col-header-cell-cushion .fc-dow,
        .fc .fc-col-header-cell-cushion .fc-date {
          color: var(--foreground);
        }
        .fc .fc-header-stack {
          line-height: 1.1;
          display: inline-block;
        }

        /* Holiday coloring for week/day headers */
        .fc .fc-col-header .fc-holiday .fc-col-header-cell-cushion,
        .fc .fc-col-header .fc-holiday .fc-dow,
        .fc .fc-col-header .fc-holiday .fc-date {
          color: ${HOLIDAY_RED} !important;
        }

        /* Do not tint the time axis (labels) with background events */
        .fc .fc-timegrid-slot.fc-timegrid-slot-label {
          background: var(--background) !important;
        }

        /* Closed badge styling */
        .fc .fc-daygrid-day {
          position: relative;
        }
        .fc .fc-closed-badge {
          position: absolute;
          left: 4px;
          bottom: 3px;
          font-size: 10px;
          line-height: 1;
          color: var(--foreground);
          background: rgba(17, 24, 39, 0.08);
          padding: 1px 4px;
          border-radius: 3px;
          pointer-events: none;
        }

        /* Improve contrast for headers in both themes */
        .fc .fc-col-header,
        .fc .fc-col-header-cell {
          background-color: var(--background) !important;
        }
        .fc .fc-col-header-cell-cushion {
          background: transparent !important;
        }
        /* Unify borders with theme */
        .fc-theme-standard td,
        .fc-theme-standard th {
          border-color: var(--border);
        }

        /* Mobile-only reductions */
        @media (max-width: 640px) {
          .fc .fc-toolbar-chunk button {
            padding: 0.25rem 0.5rem;
            font-size: 0.75rem;
          }
          .fc .fc-toolbar-title {
            font-size: 0.875rem;
          }
          .fc .fc-daygrid-day-number {
            font-size: 0.7rem;
            padding: 2px 4px;
            display: inline-block;
          }
          .fc .fc-daygrid-event {
            display: block;
            font-size: 0.65rem;
            line-height: 1.1;
            padding: 1px 2px;
            border-radius: 2px;
            border: 1px solid rgba(0, 0, 0, 0.06);
          }
          /* Make week/day header smaller on mobile */
          .fc .fc-timegrid .fc-col-header-cell .fc-col-header-cell-cushion {
            gap: 1px;
          }
          .fc .fc-col-header-cell-cushion .fc-dow {
            font-size: 0.65rem;
            color: var(--foreground);
          }
          .fc .fc-col-header-cell-cushion .fc-date {
            font-size: 0.6rem;
            color: var(--foreground);
          }
          .fc .fc-header-stack {
            line-height: 1;
          }
        }
      `}</style>

      <Dialog
        open={!!activeEvent}
        onOpenChange={(v) => !v && setActiveEvent(null)}
      >
        <DialogContent>
          {activeEvent && (
            <>
              <DialogHeader>
                <DialogTitle>{activeEvent.title}</DialogTitle>
              </DialogHeader>
              <DialogDescription>
                {activeEvent.areaCategory && (
                  <div>
                    <span className="text-muted-foreground mr-1">
                      {t('category')}:
                    </span>
                    <span>{activeEvent.areaCategory}</span>
                  </div>
                )}
                <div>
                  <span className="text-muted-foreground mr-1">
                    {t('start')}:
                  </span>
                  <span>
                    {activeEvent.start
                      ? new Intl.DateTimeFormat(fcLocale, {
                          dateStyle: 'medium',
                          timeStyle: 'short'
                        }).format(activeEvent.start)
                      : '—'}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground mr-1">
                    {t('end')}:
                  </span>
                  <span>
                    {activeEvent.end
                      ? new Intl.DateTimeFormat(fcLocale, {
                          dateStyle: 'medium',
                          timeStyle: 'short'
                        }).format(activeEvent.end)
                      : '—'}
                  </span>
                </div>
                {activeEvent.instructor && (
                  <div>
                    <span className="text-muted-foreground mr-1">
                      {t('instructor')}:
                    </span>
                    <span>{activeEvent.instructor}</span>
                  </div>
                )}
                {activeEvent.description && (
                  <div className="text-muted-foreground">
                    {activeEvent.description}
                  </div>
                )}
              </DialogDescription>
              <DialogFooter>
                <DialogClose>{t('close')}</DialogClose>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
