import { createMissionUnlockHandler } from '../../server/mission-unlock.js'

export default createMissionUnlockHandler()

export const config = {
  path: '/api/mission-unlock',
  method: 'POST',
  rateLimit: {
    windowLimit: 30,
    windowSize: 900,
    aggregateBy: ['ip', 'domain'],
  },
}
