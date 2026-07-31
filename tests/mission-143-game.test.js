import assert from 'node:assert/strict'
import test from 'node:test'
import { gameContent } from '../apps/mission-143/src/data/gameContent.js'
import {
  MAX_LIVES,
  advanceResolved,
  advanceWakeRhythm,
  answerGame,
  initialGame,
  matches,
  refreshReplayTransition,
  restartAfterGameover,
  resetWakeRhythm,
  stepBack,
} from '../apps/mission-143/src/gameEngine.js'

const question = id => gameContent.questions.find(item => item.id === id)
const choice = (id, answer, feedback = undefined) => ({ id, type: 'choice', answer, options: ['no', 'yes'], feedback })

test('name matching uses NFKC, case folding, and collapsed whitespace aliases', () => {
  // gameContent.people carries no real aliases (they are gated server-side), so
  // this test exercises matches() itself against a literal alias list.
  const aliases = ['Person A', 'Persona']
  assert.equal(matches('  PERSON   A  ', aliases), true)
  assert.equal(matches('ＰＥＲＳＯＮＡ', aliases), true)
  assert.equal(matches('person b', aliases), false)
})

test('the 1-4-3 wake rhythm recognizes separated groups', () => {
  const wake = gameContent.wake
  let rhythm = resetWakeRhythm()
  for (const at of [0, 900, 1000, 1100, 1200, 2000, 2100, 2200]) rhythm = advanceWakeRhythm(rhythm, at, wake)
  assert.equal(rhythm.matched, true)
  assert.deepEqual(rhythm.groups, [1, 4, 3])
})

test('the wake rhythm resets an incorrect group and after inactivity', () => {
  const wake = gameContent.wake
  let rhythm = resetWakeRhythm()
  rhythm = advanceWakeRhythm(rhythm, 0, wake)
  rhythm = advanceWakeRhythm(rhythm, 100, wake)
  assert.deepEqual(rhythm.groups, [])
  rhythm = advanceWakeRhythm(rhythm, 200, wake)
  rhythm = advanceWakeRhythm(rhythm, 200 + wake.resetAfter + 1, wake)
  assert.deepEqual(rhythm.groups, [1])
  assert.equal(rhythm.matched, false)
})

test('a pause after an incomplete group starts a fresh 1-4-3 attempt', () => {
  const wake = gameContent.wake
  let rhythm = resetWakeRhythm()
  rhythm = advanceWakeRhythm(rhythm, 0, wake)
  rhythm = advanceWakeRhythm(rhythm, 700, wake)
  rhythm = advanceWakeRhythm(rhythm, 800, wake)
  rhythm = advanceWakeRhythm(rhythm, 900, wake)
  rhythm = advanceWakeRhythm(rhythm, 1700, wake)
  assert.deepEqual(rhythm.groups, [1])
  assert.equal(rhythm.lastTap, 1700)
})

test('an ordinary question loses one life on only the first wrong attempt', () => {
  let game = initialGame(0, true)
  const q = question('nickname')
  game = answerGame(game, q, 0)
  assert.equal(game.lives, MAX_LIVES - 1)
  assert.equal(game.last.lifeLost, true)
  game = answerGame(game, q, 2)
  assert.equal(game.lives, MAX_LIVES - 1)
  assert.equal(game.last.lifeLost, false)
  game = answerGame(game, q, 1)
  assert.equal(game.status, 'resolved')
})

test('typed three-attempt answers reveal and lose a life only on the third failure', () => {
  let game = initialGame(0, true)
  const q = question('dessert')
  game = answerGame(game, q, 'wrong one')
  assert.equal(game.status, 'playing')
  assert.equal(game.lives, MAX_LIVES)
  game = answerGame(game, q, 'wrong two')
  assert.equal(game.status, 'playing')
  game = answerGame(game, q, 'wrong three')
  assert.equal(game.status, 'resolved')
  assert.equal(game.last.lifeLost, true)
  assert.equal(game.lives, MAX_LIVES - 1)
})

test('the special-people trap costs one first life and resolves only after all options', () => {
  let game = initialGame(0, true)
  const q = question('special-people')
  for (const answer of [0, 1, 2]) game = answerGame(game, q, answer)
  assert.equal(game.status, 'playing')
  assert.equal(game.lives, MAX_LIVES - 1)
  game = answerGame(game, q, 3)
  assert.equal(game.status, 'resolved')
  assert.equal(game.last.trapComplete, true)
  assert.equal(game.lives, MAX_LIVES - 1)
})

test('seven first-try wins restore a life, reset the streak, and can repeat', () => {
  let game = { ...initialGame(0, true), lives: 4 }
  for (let index = 0; index < 7; index += 1) {
    game = answerGame(game, choice(`first-${index}`, 1), 1)
    game = advanceResolved(game, 100)
  }
  assert.equal(game.lives, 5)
  assert.equal(game.bonusLives, 1)
  assert.equal(game.streak, 0)

  game = answerGame(game, choice('reset', 1), 0)
  assert.equal(game.streak, 0)
  assert.equal(game.lives, 4)
  for (let index = 0; index < 7; index += 1) {
    game = answerGame(game, choice(`second-${index}`, 1), 1)
    game = advanceResolved(game, 100)
  }
  assert.equal(game.lives, 5)
  assert.equal(game.bonusLives, 2)
})

test('restarts preserve campaign history while each run gets fresh scoring', () => {
  const q = question('nickname')
  let game = { ...initialGame(0, true), lives: 1, bootId: 'first-boot' }
  game = answerGame(game, q, 0)
  assert.equal(game.status, 'gameover')
  assert.equal(game.replayCount, 1)
  assert.equal(game.last.runNumber, 1)
  assert.equal(answerGame(game, q, 2).replayCount, 1)
  const restart = restartAfterGameover(game)
  assert.equal(restart.replayCount, 1)
  assert.equal(restart.runNumber, 2)
  assert.equal(restart.history.length, 1)
  assert.equal(restart.attempts, 1)
  const secondRun = answerGame(restart, q, 0)
  assert.equal(secondRun.last.attemptNumber, 1)
  assert.equal(secondRun.last.runNumber, 2)
  const refreshed = refreshReplayTransition({ ...restart, bootId: 'old-boot' }, 'new-boot')
  assert.equal(refreshed.replayCount, 2)
  assert.equal(refreshed.runNumber, 3)
  assert.equal(refreshed.history.length, 1)
  assert.equal(refreshReplayTransition(refreshed, 'new-boot'), refreshed)
})

test('stepping back reviews the previous answer and cannot farm lives', () => {
  const q = question('nickname')
  let game = initialGame(0, true)
  game = answerGame(game, q, 0)
  assert.equal(game.lives, MAX_LIVES - 1)
  game = answerGame(game, q, 1)
  game = advanceResolved(game, 100)
  assert.equal(game.index, 1)

  const back = stepBack(game, 'nickname')
  assert.equal(back.index, 0)
  assert.equal(back.status, 'resolved')
  assert.equal(back.last.questionId, 'nickname')
  assert.equal(back.lives, MAX_LIVES - 1)

  // Coming forward and answering again must not cost another life or add streak.
  const forward = advanceResolved(back, 100)
  assert.equal(forward.index, 1)
  const replayed = answerGame({ ...forward, index: 0 }, q, 0)
  assert.equal(replayed.lives, MAX_LIVES - 1)
  assert.equal(replayed.last.lifeLost, false)

  assert.equal(stepBack(initialGame(0, true), 'nickname').index, 0)
  const done = { ...game, status: 'complete' }
  assert.equal(stepBack(done, 'nickname'), done)
})

test('preference answers resolve without cost and are retained for results', () => {
  const game = answerGame(initialGame(0, true), question('would-rather'), 3)
  assert.equal(game.status, 'resolved')
  assert.equal(game.lives, MAX_LIVES)
  assert.equal(game.preferences['would-rather'], 3)
})
