import { useRef } from 'react'
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion'
import PhotoFrame from './PhotoFrame.jsx'
import { hero, meta } from '../data/content.js'

export default function Hero() {
  const reduce = useReducedMotion()
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })

  // Hero drifts as you scroll away — text lifts and fades, the frame sinks and
  // tilts, the scroll cue disappears. Depth, not distraction.
  const textY = useTransform(scrollYProgress, [0, 1], [0, -80])
  const textOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])
  const frameY = useTransform(scrollYProgress, [0, 1], [0, 100])
  const frameRotate = useTransform(scrollYProgress, [0, 1], [0, -6])
  const cueOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0])
  const sx = (style) => (reduce ? undefined : style)

  const rise = (delay) => ({
    initial: reduce ? { opacity: 0 } : { opacity: 0, y: 26 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] },
  })

  return (
    <header
      ref={heroRef}
      id="top"
      className="relative mx-auto flex min-h-[100svh] w-full max-w-6xl flex-col justify-start px-5 pb-16 pt-28 lg:justify-center lg:py-20"
    >
      <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr]">
        {/* Left — the filing */}
        <motion.div
          style={sx({ y: textY, opacity: textOpacity })}
          className="text-center lg:text-left"
        >
          <motion.div
            {...rise(0)}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.05] px-4 py-1.5 backdrop-blur"
          >
            <span className="h-2 w-2 animate-twinkle rounded-full bg-romance-rose shadow-glow-rose" />
            <span className="font-mono text-[0.66rem] uppercase tracking-[0.28em] text-sky-light/80">
              {hero.eyebrow}
            </span>
          </motion.div>

          <motion.h1
            {...rise(0.08)}
            className="font-display text-5xl font-semibold leading-[1.02] tracking-tight text-balance sm:text-6xl lg:text-7xl"
          >
            <span className="text-gradient">{hero.titleEn}</span>
          </motion.h1>

          <motion.p
            {...rise(0.16)}
            className="ne-serif mt-3 text-2xl text-cream/85 sm:text-3xl"
          >
            {hero.titleNe}
          </motion.p>

          <motion.p
            {...rise(0.24)}
            className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-cream/75 text-pretty lg:mx-0 sm:text-lg"
          >
            {hero.subtitleEn}
          </motion.p>
          <motion.p
            {...rise(0.3)}
            className="ne mx-auto mt-2 max-w-xl text-sm leading-relaxed text-sky-light/70 text-pretty lg:mx-0"
          >
            {hero.subtitleNe}
          </motion.p>

          <motion.div
            {...rise(0.4)}
            className="mt-9 flex flex-col items-center gap-3 sm:flex-row lg:items-start lg:justify-start sm:justify-center"
          >
            <a href="#case" className="btn-primary w-full sm:w-auto">
              {hero.ctaPrimary}
              <span aria-hidden="true">↓</span>
            </a>
            <a href="#petition" className="btn-ghost w-full sm:w-auto">
              {hero.ctaSecondary}
            </a>
          </motion.div>

          <motion.div
            {...rise(0.5)}
            className="mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-1 font-mono text-[0.62rem] uppercase tracking-[0.18em] text-cream/45 lg:justify-start"
          >
            <span>Req. {meta.requestId}</span>
            <span aria-hidden="true">·</span>
            <span>{meta.filing}</span>
            <span aria-hidden="true">·</span>
            <span>Status: Awaiting verdict</span>
          </motion.div>
        </motion.div>

        {/* Right — the exhibit */}
        <motion.div
          style={sx({ y: frameY, rotate: frameRotate })}
          className="flex justify-center lg:justify-end"
        >
          <motion.div
            initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <PhotoFrame />
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll hint */}
      <motion.div style={sx({ opacity: cueOpacity })}>
        <motion.a
          href="#case"
          {...rise(0.7)}
          className="group mx-auto mt-14 flex items-center gap-2 text-cream/55 transition hover:text-cream lg:mx-0"
          aria-label={hero.scrollHint}
        >
          <span className="font-mono text-[0.6rem] uppercase tracking-[0.25em]">
            {hero.scrollHint}
          </span>
          <span className="grid h-9 w-5 place-items-start justify-center rounded-full border border-white/25 pt-1.5">
            <span className="block h-1.5 w-1 animate-float rounded-full bg-romance-rose" />
          </span>
        </motion.a>
      </motion.div>
    </header>
  )
}
