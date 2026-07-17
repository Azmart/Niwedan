import { useRef, useState } from 'react'
import MusicPlayer from './MusicPlayer.jsx'

const MAX = 20
const STAR_MAX = 48
const types = ['rose', 'daisy', 'tulip', 'cosmos', 'poppy', 'bellflower', 'sunflower']
const spots = [[14,74],[30,68],[49,77],[67,65],[84,75],[22,82],[40,58],[57,82],[76,56],[91,66],[10,61],[34,88],[52,69],[70,86],[88,58],[18,53],[45,91],[62,53],[80,82],[94,88]]

function Stem({ leaves = true }) {
  return <><path className="stem-line" pathLength="1" d="M50 151 C49 127 53 109 50 88" />{leaves && <><path className="flower-leaf leaf-left" d="M49 121 C35 112 29 119 31 127 C39 130 45 127 49 121Z" /><path className="flower-leaf leaf-right" d="M51 112 C62 102 70 106 70 115 C63 120 56 117 51 112Z" /></>}</>
}

function FlowerArt({ type }) {
  if (type === 'rose') return <svg viewBox="0 0 100 160" role="img" aria-label="A red rose"><Stem /><path className="rose-leaf leaf-left" d="M48 105 C35 94 27 101 29 111 C37 115 44 112 48 105Z" /><g className="rose-head flower-head"><path className="rose-sepals" d="M36 71 L42 61 L50 74 L58 61 L65 71" /><path className="rose-cup" d="M29 59 C31 71 39 78 50 79 C61 78 70 72 72 59 C65 66 59 69 50 69 C41 69 35 66 29 59Z" /><path className="rose-outer rose-left" d="M50 70 C37 74 27 66 29 53 C30 43 39 38 46 43 C49 47 50 54 50 70Z" /><path className="rose-outer rose-right" d="M50 70 C63 74 73 66 71 53 C70 43 61 38 54 43 C51 47 50 54 50 70Z" /><path className="rose-outer rose-top" d="M36 52 C37 38 44 30 50 38 C56 30 63 38 64 52 C60 57 55 59 50 59 C45 59 40 57 36 52Z" /><path className="rose-middle rose-fold-left" d="M50 68 C41 67 36 60 39 52 C42 47 47 49 50 55Z" /><path className="rose-middle rose-fold-right" d="M50 68 C59 67 64 60 61 52 C58 47 53 49 50 55Z" /><path className="rose-inner" d="M50 64 C45 62 44 56 48 52 C52 49 57 52 57 56 C57 61 53 63 50 64Z" /><path className="rose-spiral" d="M53 60 C56 56 53 52 50 53 C47 54 47 58 50 59 C52 60 53 57 51 56" /></g><path className="thorn" d="M48 130 l-7 5 7 1M51 138 l7 4 -7 1" /></svg>
  if (type === 'daisy') return <svg viewBox="0 0 100 160" role="img" aria-label="A white daisy"><Stem /><g className="daisy-petals flower-head">{Array.from({ length: 12 }, (_, i) => <ellipse key={i} cx="50" cy="43" rx="8" ry="22" transform={`rotate(${i * 30} 50 61)`} />)}</g><circle className="daisy-center flower-center" cx="50" cy="61" r="12" /><circle className="daisy-dot flower-center" cx="47" cy="57" r="2" /></svg>
  if (type === 'tulip') return <svg viewBox="0 0 100 160" role="img" aria-label="A pink tulip"><Stem /><path className="tulip-head flower-head" d="M29 37 C38 38 39 29 50 38 C61 29 62 38 72 37 L70 68 C65 80 57 84 50 84 C43 84 35 80 30 68Z" /><path className="tulip-highlight flower-detail" d="M39 42 C43 53 46 56 50 58 C54 56 58 53 62 42" /></svg>
  if (type === 'cosmos') return <svg viewBox="0 0 100 160" role="img" aria-label="A pink cosmos flower"><Stem /><g className="cosmos-petals flower-head">{Array.from({ length: 8 }, (_, i) => <path key={i} d="M50 58 C34 50 28 37 36 30 C45 23 51 37 50 58Z" transform={`rotate(${i * 45} 50 58)`} />)}</g><circle className="cosmos-center flower-center" cx="50" cy="58" r="9" /></svg>
  if (type === 'poppy') return <svg viewBox="0 0 100 160" role="img" aria-label="An orange poppy"><Stem leaves={false} /><path className="poppy-leaf leaf-left" d="M49 120 C40 108 32 111 29 122 C37 128 43 126 49 120Z" /><g className="poppy-head flower-head"><path d="M50 63 C29 58 25 42 35 31 C43 30 48 38 50 48 C52 38 57 30 65 31 C75 42 71 58 50 63Z" /><path d="M50 48 C42 38 34 38 30 42M50 48 C58 38 66 38 70 42" /></g><circle className="poppy-center flower-center" cx="50" cy="49" r="10" /><path className="poppy-cap flower-detail" d="M41 44 H59" /></svg>
  if (type === 'bellflower') return <svg viewBox="0 0 100 160" role="img" aria-label="A purple bellflower"><Stem /><path className="bell-branch" pathLength="1" d="M51 106 C67 98 69 87 68 75" /><g className="bell-head flower-head"><path d="M39 38 C52 31 67 37 69 47 C67 62 58 70 49 68 C42 62 37 51 39 38Z" /><path d="M43 57 C49 61 56 61 64 56" /></g><path className="bell-bud flower-detail" d="M66 70 C71 66 76 69 76 75 C73 80 68 79 66 70Z" /></svg>
  return <svg viewBox="0 0 100 160" role="img" aria-label="A golden sunflower"><Stem /><g className="sunflower-petals flower-head">{Array.from({ length: 16 }, (_, i) => <ellipse key={i} cx="50" cy="42" rx="8" ry="23" transform={`rotate(${i * 22.5} 50 63)`} />)}</g><circle className="sunflower-center flower-center" cx="50" cy="63" r="18" /><circle className="sunflower-seeds flower-center" cx="50" cy="63" r="12" /></svg>
}

function Flower({ bloom, index }) {
  const type = index === 0 ? 'rose' : types[index % types.length]
  return <div className={`flower ${type}`} style={{ left: `${bloom.x}%`, top: `${bloom.y}%`, '--breeze-delay': `${(index % 5) * .55}s` }} aria-hidden="true"><div className="flower-breeze"><FlowerArt type={type} /></div></div>
}

function Bee({ variant }) {
  return <div className={`bee bee-${variant}`} aria-hidden="true">
    <svg viewBox="0 0 80 56" focusable="false">
      <g className="bee-wings"><path d="M38 27 C25 10 9 16 16 29 C21 37 31 34 38 29Z" /><path d="M43 25 C48 5 66 6 65 20 C63 30 52 31 43 28Z" /></g>
      <path className="bee-body" d="M30 25 C32 15 48 14 53 23 C58 33 48 42 38 39 C31 37 28 31 30 25Z" />
      <path className="bee-stripes" d="M36 18 L35 38 M43 16 L44 40 M50 19 L52 35" /><circle className="bee-face" cx="34" cy="25" r="4" /><path className="bee-trail" d="M13 34 C4 29 7 19 16 20" />
    </svg>
  </div>
}

export default function FlowerField() {
  const [blooms, setBlooms] = useState([])
  const [stars, setStars] = useState([])
  const [offset, setOffset] = useState(0)
  const [finalMessageDismissed, setFinalMessageDismissed] = useState(false)
  const point = useRef(null)
  const scene = useRef(null)
  const plant = (at) => setBlooms(current => current.length >= MAX ? current : [...current, at || { x: spots[current.length][0], y: spots[current.length][1] }])
  const down = event => {
    if (event.target.closest('a,button')) return
    point.current = { x: event.clientX, offset, dragged: false }
    event.currentTarget.setPointerCapture(event.pointerId)
  }
  const move = event => {
    if (!point.current) return
    const delta = event.clientX - point.current.x
    if (Math.abs(delta) > 7) point.current.dragged = true
    if (point.current.dragged) setOffset(Math.max(-28, Math.min(28, point.current.offset + delta / window.innerWidth * 100)))
  }
  const up = event => {
    const gesture = point.current
    point.current = null
    if (!gesture || gesture.dragged || !scene.current) return
    const rect = scene.current.getBoundingClientRect()
    const x = Math.max(4, Math.min(96, (event.clientX - rect.left) / rect.width * 100))
    const y = Math.max(3, Math.min(96, (event.clientY - rect.top) / rect.height * 100))
    if (y < 48) {
      setStars(current => current.length >= STAR_MAX ? current : [...current, { x, y }])
    } else {
      plant({ x: Math.max(6, Math.min(94, x - offset)), y: Math.max(48, Math.min(91, y)) })
    }
  }
  const cancel = () => { point.current = null }
  const done = blooms.length === MAX
  const showFinalMessage = done && !finalMessageDismissed
  return <main className="app">
    <MusicPlayer />
    <a className="skip" href="#controls">Skip to flower controls</a>
    <header><a className="home" href="/">← Back to our archive <small lang="ne">हाम्रो संग्रहमा फर्कनुहोस्</small></a><p className="counter" aria-live="polite"><b>{blooms.length}</b> / {MAX} blooms</p></header>
    <section className="intro"><p>A small place to land after a very full day</p><h1>For all the meetings, calls, and late-night words—<em>I am so proud of you.</em></h1><span lang="ne">धेरै मिटिङ, कल्स र राति अबेरसम्मका मिठा कुराहरूपछि पनि तिमीले धेरै राम्रो काम गरिरहेकी छौ। म तिमीमाथि एकदमै गर्व गर्छु, माया। 😘</span></section>
    <section className={`meadow ${done ? 'done' : ''}`} ref={scene} aria-label="Interactive evening flower field: tap the sky to light a star, or tap the grass to grow a flower. Drag to wander." onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={cancel}>
      <div className="moon" aria-hidden="true" /><div className="stars" aria-hidden="true">{stars.map((star, index) => <i key={`${star.x}-${star.y}-${index}`} style={{ left: `${star.x}%`, top: `${star.y}%`, '--star-delay': `${index * 70}ms` }} />)}</div><div className="hills far" aria-hidden="true" /><div className="hills near" aria-hidden="true" /><div className="fireflies" aria-hidden="true"><i/><i/><i/><i/><i/><i/></div>
      <div className="garden" style={{ transform: `translateX(${offset}%)` }}>{blooms.map((bloom,index) => <Flower bloom={bloom} index={index} key={`${index}-${bloom.x}`} />)}</div>
      {blooms.length > 5 && <div className="bees" aria-hidden="true"><Bee variant="one" /><Bee variant="two" /></div>}
      {!done ? <p className="hint">Tap the sky to light a star. Tap the grass to grow a flower. <span>↔ Drag to wander</span></p> : showFinalMessage && <div className="final" role="status"><button className="final-close" type="button" aria-label="Close message and view the flower field" onClick={() => setFinalMessageDismissed(true)}><span aria-hidden="true">×</span></button><i>✦</i><h2>Twenty flowers still cannot hold everything you did today.</h2><p>You worked so hard. Now let your heart feel light. I am so proud of you, my love. 💖</p><p lang="ne">बीस फूलले पनि तिमीले आज गरेका सबै कुरा अटाउन सक्दैनन्। धेरै मेहनत गरेकी छौ, अब मन आनन्दित बनाऊ। तिमीमाथि धेरै गर्व छ, मायालु। 💖</p></div>}
    </section>
    <section className="controls" id="controls"><p>{done ? 'The meadow is glowing because you are here.' : 'One flower at a time. No rush.'}</p><button type="button" onClick={() => plant()} disabled={done}>{done ? 'All twenty blooms are here ✦' : `Grow flower ${blooms.length + 1} of ${MAX}`}</button><small lang="ne">फूल फुलाउन यहाँ थिच्नुहोस्</small></section>
  </main>
}
