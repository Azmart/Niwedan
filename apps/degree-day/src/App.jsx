import { useLayoutEffect, useState } from 'react'
import { content } from './content.js'
import MusicPlayer from './MusicPlayer.jsx'
import VisualStory from './VisualStory.jsx'
import HandwrittenLetter from './HandwrittenLetter.jsx'
import CeremonyScene from './CeremonyScene.jsx'
import CelebrationInvitation from './CelebrationInvitation.jsx'
import { endingContent } from './endingContent.js'

export default function App() {
  const [replayKey, setReplayKey] = useState(0)

  useLayoutEffect(() => {
    if (replayKey === 0) return
    window.scrollTo({ top: 0, behavior: 'instant' })
    document.getElementById('hero-title')?.focus({ preventScroll: true })
  }, [replayKey])

  function replay() {
    setReplayKey(key => key + 1)
  }

  return <div className="degree-app" key={replayKey}>
    <a className="skip-link" href="#main">{content.nav.skipEn} <span lang="ne">· {content.nav.skipNe}</span></a>
    <MusicPlayer />
    <header className="site-header page-shell">
      <a className="home-link" href="/" aria-label="Back to the gallery">
        <span aria-hidden="true">↖</span><span>{content.nav.homeEn}<small lang="ne">{content.nav.homeNe}</small></span>
      </a>
      <span className="site-mark" aria-hidden="true">✿ <span>FOR मेसी</span></span>
    </header>
    <main id="main"><VisualStory /><HandwrittenLetter /><CeremonyScene /><CelebrationInvitation />
      <section className="replay-section" aria-label="Replay the celebration">
        <div className="page-shell replay-inner"><span aria-hidden="true">✿</span><button className="invitation-replay" type="button" onClick={replay}>↺ {endingContent.invitation.replayEn}</button></div>
      </section>
    </main>
    <footer className="site-footer page-shell"><p>Made for मेसी, with love. <span lang="ne">तिम्रो मुस्कानका लागि।</span></p><span>✿</span></footer>
  </div>
}
