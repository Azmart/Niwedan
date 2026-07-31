export const MAX_LIVES = 5
export const normalize = (value = '') => value.normalize('NFKC').trim().replace(/\s+/g, ' ').toLocaleLowerCase()
export const matches = (value, accepted) => accepted.map(normalize).includes(normalize(value))
export const resetWakeRhythm = () => ({ groups: [], lastTap: 0, matched: false })
export function advanceWakeRhythm(state, now, wake) {
  const stale = state.lastTap && now - state.lastTap >= wake.resetAfter
  let groups = stale ? [] : [...state.groups]
  const boundary = groups.length && now - state.lastTap >= wake.groupIdle
  if (boundary && groups.at(-1) !== wake.pattern[groups.length - 1]) return { groups: [1], lastTap: now, matched: false }
  if (!groups.length || boundary) groups.push(1); else groups[groups.length - 1] += 1
  const incorrect = groups.length > wake.pattern.length || groups.some((count, index) => count > wake.pattern[index])
  const matched = !incorrect && groups.length === wake.pattern.length && groups.every((count, index) => count === wake.pattern[index])
  return incorrect ? resetWakeRhythm() : { groups, lastTap: now, matched }
}

export const initialGame = (replayCount = 0, active = false) => ({ index: 0, lives: MAX_LIVES, streak: 0, bonusLives: 0, livesLost: 0, attempts: 0, firstTry: 0, replayCount, runNumber: replayCount + 1, history: [], status: 'playing', trapSeen: [], preferences: {}, active })
const currentAttempts = (state, questionId) => state.history.filter(item => item.questionId === questionId && item.runNumber === state.runNumber)

function record(state, question, answer, correct, lifeLost, resolved) {
  const prior = currentAttempts(state, question.id); const first = prior.length === 0
  let lives = state.lives - Number(lifeLost); let streak = correct && first ? state.streak + 1 : correct ? state.streak : 0; let bonusLives = state.bonusLives
  if (correct && first && streak === 7) { if (lives < MAX_LIVES) { lives++; bonusLives++ } streak = 0 }
  const entry = { questionId: question.id, answer, correct, lifeLost, attemptNumber: prior.length + 1, runNumber: state.runNumber }
  const failed = lives <= 0
  return { ...state, lives, streak, bonusLives, livesLost: state.livesLost + Number(lifeLost), attempts: state.attempts + 1, firstTry: state.firstTry + Number(correct && first), history: [...state.history, entry], last: entry, status: failed ? 'gameover' : resolved ? 'resolved' : 'playing', replayCount: failed && state.status !== 'gameover' ? state.replayCount + 1 : state.replayCount, active: !failed }
}

export function answerGame(state, question, answer) {
  if (!question || state.status === 'gameover' || state.status === 'complete' || state.status === 'resolved') return state
  const prior = currentAttempts(state, question.id)
  if (question.type === 'trap') {
    const seen = [...new Set([...state.trapSeen, answer])]; const result = record({ ...state, trapSeen: seen }, question, answer, false, prior.length === 0, seen.length === question.options.length)
    return { ...result, trapSeen: seen.length === question.options.length ? [] : seen, last: { ...result.last, trapComplete: seen.length === question.options.length } }
  }
  const correct = question.type === 'preference' ? true : question.type.startsWith('text') ? matches(answer, question.accepted) : Number(answer) === question.answer
  const exhausted = question.type === 'text3' && prior.length === 2 && !correct
  const lifeLost = !correct && (question.type === 'text3' ? exhausted : prior.length === 0)
  const result = record(state, question, answer, correct, lifeLost, correct || exhausted || question.type === 'preference')
  return question.type === 'preference' ? { ...result, preferences: { ...result.preferences, [question.id]: answer } } : result
}

// Back shows the previous question in its already-resolved state with the answer
// she gave. It never re-opens a question for scoring: answerGame counts prior
// attempts from history, so a repeat answer costs no life and earns no streak.
export const stepBack = (state, previousQuestionId) => {
  if (state.index <= 0 || !['playing', 'resolved'].includes(state.status)) return state
  const prior = state.history.filter(item => item.questionId === previousQuestionId && item.runNumber === state.runNumber)
  return { ...state, index: state.index - 1, status: 'resolved', last: prior.at(-1) || null }
}
export const advanceResolved = (state, totalQuestions) => state.status !== 'resolved' ? state : state.index + 1 >= totalQuestions ? { ...state, status: 'complete', active: false } : { ...state, index: state.index + 1, status: 'playing', last: null }
const startNextRun = (state, replayCount) => ({ ...state, index: 0, lives: MAX_LIVES, streak: 0, trapSeen: [], status: 'playing', active: true, replayCount, runNumber: replayCount + 1, last: null })
export const restartAfterGameover = state => startNextRun(state, state.replayCount)
export const playAgain = () => initialGame(0, true)
export const refreshReplayTransition = (state, nextBootId) => state?.active && ['playing', 'resolved'].includes(state.status) && state.bootId !== nextBootId ? { ...startNextRun(state, state.replayCount + 1), bootId: nextBootId } : state
