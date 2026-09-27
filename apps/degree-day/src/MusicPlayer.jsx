import { useRef, useState } from 'react'
import { content } from './content.js'

export default function MusicPlayer() {
  const audioRef = useRef(null)
  const firstStartDone = useRef(false)
  const firstStartPending = useRef(false)
  const [playing, setPlaying] = useState(false)
  const music = content.music
  if (!music.available) return null

  const seekToOpening = () => {
    const audio = audioRef.current
    if (!audio || firstStartDone.current) return
    if (audio.readyState < 1) { firstStartPending.current = true; return }
    try { audio.currentTime = 11; firstStartDone.current = true; firstStartPending.current = false }
    catch { firstStartPending.current = true }
  }
  const toggle = async () => {
    const audio = audioRef.current
    if (!audio) return
    if (!audio.paused) { audio.pause(); return }
    seekToOpening()
    try { await audio.play() } catch { setPlaying(false) }
  }
  const replayFromBeginning = () => {
    const audio = audioRef.current
    if (!audio) return
    setPlaying(false)
    try { audio.currentTime = 0 } catch { /* The media may not be seekable yet. */ }
    audio.play().catch(() => setPlaying(false))
  }

  return <>
    <audio ref={audioRef} preload="metadata" onLoadedMetadata={() => { if (firstStartPending.current) seekToOpening() }} onEnded={replayFromBeginning} onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onError={() => setPlaying(false)}>
      <source src={`${import.meta.env.BASE_URL}${music.file}`} type="audio/mp4" />
    </audio>
    <button className="music-toggle" type="button" onClick={toggle} aria-pressed={playing} aria-label={`${playing ? music.pauseEn : music.playEn} / ${playing ? music.pauseNe : music.playNe}`}>
      <span className="music-icon" aria-hidden="true">{playing ? 'Ⅱ' : '♪'}</span>
      <span>{playing ? music.pauseEn : music.playEn}<small lang="ne">{playing ? music.pauseNe : music.playNe}</small></span>
    </button>
  </>
}
