import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { intro } from '../data/content.js'

const START_AT = 94 // 1:34 — where the song begins the first time

/**
 * First-visit gate lets her choose music or silence. After entering, a floating
 * button (always present) toggles the music. The song starts at 1:34 the first
 * time it plays, then loops from the start via the native `loop` attribute.
 */
export default function MusicPlayer() {
  const audioRef = useRef(null)
  const startedRef = useRef(false)
  const [entered, setEntered] = useState(false)
  const [playing, setPlaying] = useState(false)

  const startFromCue = () => {
    const a = audioRef.current
    if (!a) return
    startedRef.current = true
    a.currentTime = START_AT
    a.play().then(() => setPlaying(true)).catch(() => {
      startedRef.current = false
    })
  }

  const enter = (withMusic) => {
    setEntered(true)
    if (withMusic) startFromCue()
  }

  const toggle = () => {
    const a = audioRef.current
    if (!a) return
    if (!startedRef.current) return startFromCue() // first play → from 1:34
    if (a.paused) a.play().then(() => setPlaying(true)).catch(() => {})
    else {
      a.pause()
      setPlaying(false)
    }
  }

  // Lock scroll + allow Escape (= enter silently) while the gate is open.
  useEffect(() => {
    if (entered) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e) => e.key === 'Escape' && setEntered(true)
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      document.removeEventListener('keydown', onKey)
    }
  }, [entered])

  return (
    <>
      <audio ref={audioRef} src={`${import.meta.env.BASE_URL}music.m4a`} loop preload="auto" />

      {/* First-visit gate */}
      <AnimatePresence>
        {!entered && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center p-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="intro-title"
          >
            <div className="absolute inset-0 bg-ink-900/80 backdrop-blur-xl" />
            <motion.div
              className="glass-strong relative z-10 w-full max-w-lg p-8 text-center sm:p-10"
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 220, damping: 22 }}
            >
              <p className="font-mono text-[0.62rem] uppercase tracking-[0.28em] text-sky-light/70">
                {intro.eyebrow}
              </p>

              <div
                className="mx-auto my-6 grid h-16 w-16 place-items-center rounded-full bg-romance-gradient text-3xl text-white shadow-glow-rose animate-glow-pulse"
                aria-hidden="true"
              >
                ♪
              </div>

              <h2
                id="intro-title"
                className="font-display text-3xl font-semibold leading-tight text-balance sm:text-4xl"
              >
                {intro.titleEn}
              </h2>
              <p className="ne-serif mt-2 text-xl text-sky-light/80">
                {intro.titleNe}
              </p>

              <p className="mx-auto mt-4 max-w-sm text-sm leading-relaxed text-cream/70">
                {intro.subEn}
                <span className="ne mt-1 block text-cream/50">{intro.subNe}</span>
              </p>

              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <button
                  onClick={() => enter(true)}
                  autoFocus
                  className="btn-primary w-full sm:w-auto"
                >
                  <span className="flex flex-col items-center leading-tight">
                    <span>
                      <span aria-hidden="true" className="mr-1.5">▶</span>
                      {intro.withMusicEn}
                    </span>
                    <span className="ne text-[0.7rem] font-normal opacity-80">
                      {intro.withMusicNe}
                    </span>
                  </span>
                </button>
                <button
                  onClick={() => enter(false)}
                  className="btn-ghost w-full sm:w-auto"
                >
                  <span className="flex flex-col items-center leading-tight">
                    <span>{intro.silentEn}</span>
                    <span className="ne text-[0.7rem] font-normal opacity-70">
                      {intro.silentNe}
                    </span>
                  </span>
                </button>
              </div>

              <p className="mt-6 font-mono text-[0.58rem] uppercase tracking-[0.16em] text-cream/40">
                {intro.noteEn}
              </p>
              <p className="ne mt-1 text-xs text-cream/40">{intro.noteNe}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Always-present floating toggle (after entering) */}
      {entered && (
        <button
          onClick={toggle}
          aria-label={playing ? 'Pause music' : 'Play music'}
          aria-pressed={playing}
          className="fixed bottom-5 right-5 z-50 grid h-12 w-12 place-items-center rounded-full border border-white/15 bg-ink-800/70 text-cream shadow-glass backdrop-blur-xl transition hover:scale-105 hover:border-white/30"
        >
          {playing ? (
            <span className="flex items-end gap-[3px]" aria-hidden="true">
              <span className="w-[3px] animate-[bounce_0.9s_ease-in-out_infinite] rounded bg-romance-rose" style={{ height: 10 }} />
              <span className="w-[3px] animate-[bounce_0.7s_ease-in-out_infinite] rounded bg-sky-cyan" style={{ height: 16 }} />
              <span className="w-[3px] animate-[bounce_1.1s_ease-in-out_infinite] rounded bg-romance-rose" style={{ height: 7 }} />
            </span>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M9 18V6l10-2v12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="6.5" cy="18" r="2.5" stroke="currentColor" strokeWidth="1.6" />
              <circle cx="16.5" cy="16" r="2.5" stroke="currentColor" strokeWidth="1.6" />
              <path d="M3 3l18 18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          )}
        </button>
      )}
    </>
  )
}
