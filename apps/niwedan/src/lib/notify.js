// The endpoint owns the Discord webhook secret. This stays deliberately
// best-effort so an unavailable notification service never affects her choice.
const CHOICES = new Set(['granted', 'hd'])

export function notify(choice) {
  if (!CHOICES.has(choice)) return

  fetch('/api/notify-choice', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ choice }),
  }).catch(() => {}) // never let a failed ping break the page
}
