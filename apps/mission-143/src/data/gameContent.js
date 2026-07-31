// Real names, aliases, and photo/meme URLs are never shipped in this file - they
// only exist server-side and reach the client through applyUnlock() below, after
// the player proves they know the nickname via POST /api/mission-unlock.
const people = { a: { name: 'Someone' }, s: { name: 'You' } }

export const gameContent = {
  title: 'Mission 143',
  people,
  wake: { pattern: [1, 4, 3], groupIdle: 650, resetAfter: 3000 },
  audio: {
    background: '/apps/mission-143/audio/background.m4a',
    reveal: '/apps/mission-143/audio/reveal.m4a',
    revealStart: 31,
    revealEnd: 45,
  },
  media: {
    photo: [{ src: '', alt: '' }, { src: '', alt: '' }, { src: '', alt: '' }, { src: '', alt: '' }],
    meme: [{ src: '', alt: '' }, { src: '', alt: '' }, { src: '', alt: '' }, { src: '', alt: '' }],
    dress: [{ src: '', alt: '' }, { src: '', alt: '' }, { src: '', alt: '' }, { src: '', alt: '' }],
  },
  copy: {
    available: 'LAB ONLINE', enter: 'Enter the lab', musicTitle: 'Before we begin', musicBody: 'Should the lab have its soundtrack tonight?', withMusic: 'Play with music', withoutMusic: 'Continue quietly',
    wakeTitle: 'A tiny robot is sleeping on duty.', wakeBody: 'Tap its console in a 1 · 4 · 3 rhythm. Small pauses between the groups help it listen.', wakeProgress: 'Wake pattern', wakeEmpty: 'waiting for taps', typingLine: 'Checking the nickname memory bank...',
    robot: { sleep: 'Zzz... security mode is taking a nap.', wake: 'Knock knock. Who is there?', shock: 'Ohhh, it is {name}!', happy: 'Excellent. Mission energy detected.', disappointed: 'I can wait. The mission will still be here.', gameover: 'Systems dimmed. Let us try once more.', celebrate: 'Mission complete. Tiny gears are cheering.' },
    identityTitle: 'Identity check', identityBody: 'Type your name exactly as PERSON_A knows it.', identityLabel: 'Your name', identityButton: 'Confirm identity', identityPending: 'Checking...', identityWrong: "Hmm, that doesn't look right. Have you entered your correct name?", identityUnavailable: 'The lab door is not responding right now. Please try again in a moment.', identityHello: 'Hello there, beautiful. Super excited to have you in this app today.',
    rulesTitle: 'The tiny but important rules', rules: ['You begin with 5 lives.', 'A first wrong answer can cost one life.', 'Seven first-try wins in a row restore one life.', 'If lives reach zero, the mission restarts.', 'Sharing is always your choice.'],
    readyTitle: 'Are you excited and ready?', ready: 'Let’s go', notReady: 'Not yet', notReadyReply: 'No rush. The robot will be here when you are ready.',
    consentTitle: 'Choose your privacy setting', consentBody: 'If you share attempts, raw typed answers, selections, attempts, lives, and replay count are sent to PERSON_A through Discord. Previously sent messages cannot be recalled.', share: 'Share attempts', private: 'Play privately', stopSharing: 'Stop sharing', sharingUnavailable: 'Sharing is unavailable. This run is now private.',
    lives: 'Lives', streak: 'Streak', bonus: 'Extra life restored.', wrong: 'Oops, wrong answer. You lost one life. Try the other choices, no more life will be lost here.', retry: 'Try again', continue: 'Continue', back: 'Back', reveal: 'Answer revealed', gameOverTitle: 'Out of lives', gameOverBody: 'The robot saved your intro settings. Your next run begins at the first question.', restart: 'Restart mission', attemptSummary: 'Attempts and outcomes', success: 'Correct', lostLife: 'Life lost', noLifeLost: 'No life lost',
    resultsTitle: 'Mission accomplished', resultsBody: 'You reached the end of this very specific little universe.', playAgain: 'Play again', history: 'Mission record', preference: 'Your choice', audioMissing: 'Audio is not available right now, so the mission continues quietly.', audioResume: 'Music is ready when you are.', resumeMusic: 'Resume music', toggleOn: 'Music on', toggleOff: 'Music off', mute: 'Mute music', unmute: 'Play music',
    placeholderImage: 'Private image placeholder', allAbove: 'All of the above', correct: 'Correct.', typedHint: 'One word answer', answer: 'Answer', submit: 'Submit', questionOf: 'Question {current} of {total}', completed: 'Completed', attempt: 'Attempt', attempts: 'Attempts', firstTry: 'First-try wins', livesLost: 'Lives lost', bonusLives: 'Bonus lives', replays: 'Replays', status: 'Mission status',
  },
  questions: [
    // Mr. A stays literal here: substituting the real name would print the answer
    // inside its own question.
    { id: 'person-a', type: 'text', prompt: 'Today Mr. A is sharing something. Do you know who Mr. A is?', label: 'Type the name', accepted: [], feedback: 'Correct. PERSON_A has arrived.' },
    { id: 'special-people', type: 'trap', prompt: 'Mr. PERSON_A has special people. Do you know who that is?', options: ['Lionel Messi', 'PERSON_S', 'Mom', 'None of above'], feedback: 'The correct answer is all of the above. Sorry about the lost life. Be careful with your remaining lives.' },
    { id: 'nickname', type: 'choice', prompt: 'Speaking of special people, they all have nicknames. You better remember yours. Please select your correct nickname.', options: ['Messi', 'मेसी', 'Both', 'None of above'], answer: 1, feedback: 'Correct. Fun fact: PERSON_A still has not received a cute nickname from PERSON_S. 🥲. Anyways we continue.' },
    { id: 'nepali-song', type: 'choice', prompt: 'What is PERSON_A’s favourite Nepali song?', options: ['Resham by Nepathya', 'Ritu haru ma timi', 'Kaha hola ghara bara', 'Kammar Mathi Patuki'], answer: 3 },
    { id: 'dessert', type: 'text3', prompt: 'What is PERSON_A’s favourite dessert?', label: 'Type your answer in one word', accepted: [], reveal: 'PERSON_S' },
    { id: 'favourite-part', type: 'choice', prompt: 'Which part of PERSON_S does PERSON_A like the most?', options: ['Nashila Ankha', 'Komal Oth', 'Potila gala', 'Long legs'], answer: 0, feedback: 'Even though PERSON_A likes all of them, the starry eyes are favourite.' },
    { id: 'favourite-photo', type: 'choice', prompt: 'Which of the following is PERSON_A’s favourite photo?', options: ['PERSON_S in red', 'PERSON_S in black and white', 'PERSON_S sleepy', 'PERSON_S in white dress'], answer: 2, media: 'photo' },
    { id: 'favourite-meme', type: 'choice', prompt: 'Which is PERSON_A’s favourite meme?', options: ['Akshay Kumar smile', 'Bhagam Bhag ehh', 'Spongebob how do we tell', 'Looking at other girl'], answer: 1, media: 'meme' },
    { id: 'transport', type: 'choice', prompt: 'When PERSON_A goes on a date with PERSON_S, what transport are they taking?', options: ['Taxi', 'Bus', 'PERSON_S’s scooter', 'Walking'], answer: 2 },
    { id: 'line', type: 'choice', prompt: 'What is PERSON_S ko line that PERSON_A likes the most?', options: ['Kya jhyau laagyo yrr', 'Fittikai man xaina', 'Ma ta handinxu hola', 'Time nai hudaina'], answer: 0 },
    { id: 'birthday', type: 'choice', prompt: 'PERSON_A ko birthday kahile ho?', options: ['Falgun 6', 'Falgun 7', 'Falgun 8', 'Falgun 9'], answer: 3 },
    { id: 'shy', type: 'choice', prompt: 'What does PERSON_A want to do but is too shy to do?', options: ['Get couples tshirt', 'Get matching tattoos', 'Dance with PERSON_S if others are watching', 'Kiss outdoors'], answer: 2, feedback: 'Correct. And he will not do it even if she requests or gets mad.' },
    { id: 'second-nickname', type: 'text3', prompt: 'PERSON_S ko second nickname k ho PERSON_A le kahile kahi bhanne gareko?', label: 'Written answer', accepted: ['masterni'], reveal: 'Masterni', audioReveal: true },
    { id: 'dress', type: 'choice', prompt: 'PERSON_A ko favourite dress kun ho PERSON_S le lagaune?', options: ['Hariyo Saari', 'White Gown', 'White Frock and nilo seto butta vako top', 'Pahelo kurtha rato pacheura'], answer: 0, media: 'dress', feedback: 'Correct. Only skin might be even more fav.' },
    { id: 'gift', type: 'choice', prompt: 'What do you think will PERSON_A give you as a gift during first meeting?', options: ['A top', 'Messi ko jersey', 'A cute monkey doll', 'A cute toy'], answer: 1 },
    { id: 'would-rather', type: 'preference', prompt: 'Would you rather PERSON_A:', options: ['Send a bouquet of roses and chocolates to your office', 'Order you food', 'Buy you a dress', 'Not waste money and instead invest'], feedback: 'Every answer is correct. Good choice.' },
    { id: 'favourite-habit', type: 'choice', prompt: 'What habit of PERSON_S is PERSON_A ko fav?', options: ['Sending reels', 'Sending secret audio clips guf ko bich', 'Rant about kun chai pakhe kta/kt', 'Outfit check'], answer: 1 },
    { id: 'least-habit', type: 'choice', prompt: 'What habit of PERSON_S is PERSON_A ko least fav?', options: ['Sending banger selfies and videos in view once', 'Kalesh karna cause she wants to', 'Daaru pina', 'Man laageko msg reply garyo, man nalageko ignore garne'], answer: 0 },
    { id: 'first-meeting', type: 'preference', prompt: 'How would PERSON_S like the first meeting with PERSON_A to go?', options: ['PERSON_S travels to PERSON_A and surprises him', 'PERSON_A travels to PERSON_S and surprises her', 'Either informs the other and goes for a proper classic dinner date', 'Siddai Japan ma'], feedback: 'There is no correct answer here. Lets see what fate brings.' },
  ],
}

// Module-level runtime state deliberately holds the unlocked names/media/aliases
// instead of threading them through every render site: this module is a
// singleton for the page's lifetime, and applyUnlock is always called (from a
// persisted session or a fresh /api/mission-unlock response) before the screens
// that read runtime are rendered.
let runtime = { names: { a: people.a.name, s: people.s.name }, media: null }

export const applyUnlock = payload => {
  if (!payload) return
  if (payload.names) runtime.names = { a: payload.names.a || runtime.names.a, s: payload.names.s || runtime.names.s }
  if (payload.media) runtime.media = payload.media
  if (payload.aliases) {
    const personA = gameContent.questions.find(question => question.id === 'person-a')
    const dessert = gameContent.questions.find(question => question.id === 'dessert')
    if (personA && Array.isArray(payload.aliases.a)) personA.accepted = payload.aliases.a
    if (dessert && Array.isArray(payload.aliases.s)) dessert.accepted = payload.aliases.s
  }
}

export const withNames = value => String(value).replaceAll('PERSON_A', runtime.names.a).replaceAll('PERSON_S', runtime.names.s)
export const unlockedMedia = key => runtime.media?.[key] || gameContent.media[key]
