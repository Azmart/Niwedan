import { useEffect, useRef, useState } from 'react'

const FIRST_PLAY_SECONDS = 116

export default function MusicPlayer() {
  const audio = useRef(null)
  const withMusic = useRef(null)
  const hasStarted = useRef(false)
  const [isChoosing, setIsChoosing] = useState(true)
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    const dismiss = event => {
      if (event.key === 'Escape') setIsChoosing(false)
    }

    if (isChoosing) {
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', dismiss)
      return () => {
        document.body.style.overflow = previousOverflow
        window.removeEventListener('keydown', dismiss)
      }
    }

    document.body.style.overflow = previousOverflow
  }, [isChoosing])

  const play = () => {
    const player = audio.current
    if (!player) return

    if (!hasStarted.current) {
      try {
        player.currentTime = FIRST_PLAY_SECONDS
        hasStarted.current = true
      } catch {
        setIsPlaying(false)
        return
      }
    }

    player.play().catch(() => setIsPlaying(false))
  }

  const chooseMusic = () => {
    setIsChoosing(false)
    play()
  }

  const togglePlayback = () => {
    if (isPlaying) audio.current?.pause()
    else play()
  }

  return <>
    <audio
      ref={audio}
      preload="auto"
      loop
      onPlay={() => setIsPlaying(true)}
      onPause={() => setIsPlaying(false)}
      onEnded={() => setIsPlaying(false)}
      onError={() => setIsPlaying(false)}
    >
      <source src={`${import.meta.env.BASE_URL}music2.m4a`} type="audio/mp4" />
    </audio>

    {isChoosing && <div className="music-choice-backdrop">
      <section className="music-choice" role="dialog" aria-modal="true" aria-labelledby="music-choice-title">
        <p className="music-choice-eyebrow">A little atmosphere for your meadow</p>
        <i aria-hidden="true">✦</i>
        <h2 id="music-choice-title">Would you like this field with music?</h2>
        <p className="music-choice-ne" lang="ne">यो फूलबारी संगीतसँग हेर्ने?</p>
        <p className="music-choice-copy">Your choice—you can change it anytime.<br /><span lang="ne">तिमीलाई जे मन पर्छ—पछि पनि बदल्न सक्छौ।</span></p>
        <div className="music-choice-actions">
          <button ref={withMusic} className="music-choice-play" type="button" autoFocus onClick={chooseMusic}>
            With music <small lang="ne">संगीतसँग</small>
          </button>
          <button className="music-choice-quiet" type="button" onClick={() => setIsChoosing(false)}>
            Without music <small lang="ne">संगीतबिना</small>
          </button>
        </div>
        <small className="music-choice-note">Sound begins only after you choose.</small>
      </section>
    </div>}

    {!isChoosing && <button
      className={`music-toggle ${isPlaying ? 'is-playing' : ''}`}
      type="button"
      onClick={togglePlayback}
      aria-pressed={isPlaying}
      aria-label={isPlaying ? 'Pause meadow music' : 'Play meadow music'}
    >
      <span className="music-toggle-icon" aria-hidden="true">{isPlaying ? 'Ⅱ' : '▶'}</span>
      <span>{isPlaying ? 'Pause music' : 'Play music'}</span>
    </button>}
  </>
}
