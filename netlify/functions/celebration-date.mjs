import { createCelebrationDateHandler } from '../../server/celebration-date.js'

export default createCelebrationDateHandler()

export const config = {
  path: '/api/celebration-date',
  method: 'POST',
  rateLimit: {
    windowLimit: 4,
    windowSize: 60,
    aggregateBy: ['ip', 'domain'],
  },
}
