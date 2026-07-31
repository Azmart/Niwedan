import { createQuizEventHandler } from '../../server/quiz-event.js'

export default createQuizEventHandler()

export const config = {
  path: '/api/quiz-event',
  method: 'POST',
  rateLimit: {
    windowLimit: 90,
    windowSize: 900,
    aggregateBy: ['ip', 'domain'],
  },
}
