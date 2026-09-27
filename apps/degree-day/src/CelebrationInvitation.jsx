import { useEffect, useRef, useState } from 'react'
import Calendar from './Calendar.jsx'
import { endingContent } from './endingContent.js'

function localDateString(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

function dateRangeLocal() {
  const today = new Date()
  today.setHours(12, 0, 0, 0)
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  const latest = new Date(today)
  latest.setFullYear(latest.getFullYear() + 2)
  return { minimum: localDateString(tomorrow), maximum: localDateString(latest) }
}

function isAllowedDate(value, minimum, maximum) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || value < minimum || value > maximum) return false
  const [year, month, day] = value.split('-').map(Number)
  const parsed = new Date(year, month - 1, day)
  return parsed.getFullYear() === year && parsed.getMonth() === month - 1 && parsed.getDate() === day
}

export default function CelebrationInvitation() {
  const copy = endingContent.invitation
  const [date, setDate] = useState('')
  const [range, setRange] = useState(dateRangeLocal)
  const [status, setStatus] = useState('idle')
  const controllerRef = useRef(null)

  useEffect(() => () => controllerRef.current?.abort(), [])

  async function submit(event) {
    event.preventDefault()
    if (status === 'sending' || status === 'success') return
    const currentRange = dateRangeLocal()
    setRange(currentRange)
    if (!isAllowedDate(date, currentRange.minimum, currentRange.maximum)) {
      setStatus('invalid')
      return
    }

    const controller = new AbortController()
    controllerRef.current = controller
    setStatus('sending')
    try {
      const response = await fetch('/api/celebration-date', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date }),
        signal: controller.signal,
      })
      if (response.status !== 204) throw new Error('Date was not delivered')
      setStatus('success')
    } catch (error) {
      if (error.name !== 'AbortError') setStatus('failure')
    } finally {
      if (controllerRef.current === controller) controllerRef.current = null
    }
  }

  return <section className="invitation-section" aria-labelledby="invitation-title">
    <div className="page-shell invitation-card">
      <div className="invitation-copy">
        <p className="invitation-eyebrow">{copy.eyebrowEn}</p>
        <h2 id="invitation-title">{copy.titleEn}</h2>
        <p>{copy.bodyEn}</p>
      </div>
      <form className="invitation-form" onSubmit={submit}>
        <span className="invitation-date-label" id="celebration-date-label">{copy.dateLabelEn}</span>
        <Calendar value={date} minimum={range.minimum} maximum={range.maximum} disabled={status === 'sending'} onChange={value => { setDate(value); setStatus('idle') }} labelId="celebration-date-label" />
        <p className="date-hint" id="date-hint">{copy.dateHintEn}</p>
        <p className="date-disclosure" id="date-disclosure">{copy.disclosureEn}</p>
        <p className={`date-status date-status--${status}`} id="date-status" role={status === 'failure' || status === 'invalid' ? 'alert' : 'status'} aria-live="polite">
          {status === 'success' && copy.successEn}
          {status === 'invalid' && copy.invalidEn}
          {status === 'failure' && copy.failureEn}
        </p>
        {status !== 'success' && <button className="invitation-send" type="submit" disabled={status === 'sending'}>{status === 'sending' ? copy.sendingEn : copy.sendEn}</button>}
      </form>
    </div>
  </section>
}
