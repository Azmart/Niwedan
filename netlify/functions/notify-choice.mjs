import { createNotifyHandler } from '../../server/notify-choice.js'

export default createNotifyHandler()

export const config = {
  path: '/api/notify-choice',
  method: 'POST',
  rateLimit: {
    windowLimit: 4,
    windowSize: 60,
    aggregateBy: ['ip', 'domain'],
  },
}
