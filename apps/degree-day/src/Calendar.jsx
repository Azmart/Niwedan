import { useEffect, useRef, useState } from 'react'
import './Calendar.css'

const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const monthFormatter = new Intl.DateTimeFormat('en', { month: 'long', year: 'numeric' })
const dayFormatter = new Intl.DateTimeFormat('en', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })

function parseDate(value) {
  const [year, month, day] = value.split('-').map(Number)
  return new Date(year, month - 1, day, 12)
}

function dateKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

function monthKey(date) {
  return date.getFullYear() * 12 + date.getMonth()
}

export default function Calendar({ value, minimum, maximum, disabled, onChange, labelId }) {
  const [visibleMonth, setVisibleMonth] = useState(() => {
    const first = parseDate(minimum)
    return new Date(first.getFullYear(), first.getMonth(), 1, 12)
  })
  const [focusedDate, setFocusedDate] = useState(minimum)
  const focusAfterMove = useRef(false)
  const calendarRef = useRef(null)
  const minimumDate = parseDate(minimum)
  const maximumDate = parseDate(maximum)

  useEffect(() => {
    if (!focusAfterMove.current) return
    focusAfterMove.current = false
    calendarRef.current?.querySelector(`[data-date="${focusedDate}"]`)?.focus()
  }, [focusedDate, visibleMonth])

  function moveFocus(date) {
    const key = dateKey(date)
    if (key < minimum || key > maximum) return
    focusAfterMove.current = true
    setVisibleMonth(new Date(date.getFullYear(), date.getMonth(), 1, 12))
    setFocusedDate(key)
  }

  function handleDayKeyDown(event, date) {
    let target
    if (event.key === 'ArrowRight') target = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1, 12)
    if (event.key === 'ArrowLeft') target = new Date(date.getFullYear(), date.getMonth(), date.getDate() - 1, 12)
    if (event.key === 'ArrowDown') target = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 7, 12)
    if (event.key === 'ArrowUp') target = new Date(date.getFullYear(), date.getMonth(), date.getDate() - 7, 12)
    if (event.key === 'Home') target = new Date(date.getFullYear(), date.getMonth(), date.getDate() - date.getDay(), 12)
    if (event.key === 'End') target = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 6 - date.getDay(), 12)
    if (event.key === 'PageDown') target = new Date(date.getFullYear(), date.getMonth() + 1, Math.min(date.getDate(), new Date(date.getFullYear(), date.getMonth() + 2, 0).getDate()), 12)
    if (event.key === 'PageUp') target = new Date(date.getFullYear(), date.getMonth() - 1, Math.min(date.getDate(), new Date(date.getFullYear(), date.getMonth(), 0).getDate()), 12)
    if (!target) return
    event.preventDefault()
    moveFocus(target)
  }

  const firstWeekday = visibleMonth.getDay()
  const daysInMonth = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, 0).getDate()
  const cells = Array.from({ length: Math.ceil((firstWeekday + daysInMonth) / 7) * 7 }, (_, index) => {
    const dayNumber = index - firstWeekday + 1
    return dayNumber >= 1 && dayNumber <= daysInMonth ? new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), dayNumber, 12) : null
  })
  const selectedDate = value ? parseDate(value) : null
  const canGoPrevious = monthKey(visibleMonth) > monthKey(minimumDate)
  const canGoNext = monthKey(visibleMonth) < monthKey(maximumDate)

  function changeMonth(direction) {
    const next = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + direction, 1, 12)
    setVisibleMonth(next)
    const firstAllowed = Math.max(1, next.getFullYear() === minimumDate.getFullYear() && next.getMonth() === minimumDate.getMonth() ? minimumDate.getDate() : 1)
    setFocusedDate(dateKey(new Date(next.getFullYear(), next.getMonth(), firstAllowed, 12)))
  }

  return <div className="calendar" ref={calendarRef} aria-labelledby={labelId} aria-describedby="date-hint date-disclosure">
    <div className="calendar-head">
      <button type="button" className="calendar-nav" aria-label="Previous month" disabled={disabled || !canGoPrevious} onClick={() => changeMonth(-1)}>‹</button>
      <strong className="calendar-month" aria-live="polite">{monthFormatter.format(visibleMonth)}</strong>
      <button type="button" className="calendar-nav" aria-label="Next month" disabled={disabled || !canGoNext} onClick={() => changeMonth(1)}>›</button>
    </div>
    <div className="calendar-weekdays" aria-hidden="true">{weekdays.map(day => <span key={day}>{day.slice(0, 2)}</span>)}</div>
    <div className="calendar-days" role="group" aria-label={`Choose a date in ${monthFormatter.format(visibleMonth)}`}>
      {cells.map((day, index) => {
        if (!day) return <span className="calendar-empty" aria-hidden="true" key={`empty-${index}`} />
        const key = dateKey(day)
        const isSelected = key === value
        const outOfRange = key < minimum || key > maximum
        return <button key={key} type="button" data-date={key} className={`calendar-day${isSelected ? ' calendar-day--selected' : ''}`} disabled={disabled || outOfRange} tabIndex={key === focusedDate ? 0 : -1} aria-label={`${dayFormatter.format(day)}${isSelected ? ', selected' : ''}`} aria-pressed={isSelected} onFocus={() => setFocusedDate(key)} onKeyDown={event => handleDayKeyDown(event, day)} onClick={() => onChange(key)}>{day.getDate()}</button>
      })}
    </div>
    <p className="calendar-selection" aria-live="polite">{selectedDate ? `Suggested day: ${dayFormatter.format(selectedDate)}` : 'No day selected yet'}</p>
  </div>
}
