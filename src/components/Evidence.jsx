import { motion, useReducedMotion } from 'framer-motion'
import Reveal from './Reveal.jsx'
import SectionLabel from './SectionLabel.jsx'
import { evidence } from '../data/content.js'

const tones = {
  rose: {
    pill: 'bg-romance-deep/40 text-romance-blush border-romance-rose/30',
    fill: 'linear-gradient(90deg, #ff8aa3, #c41e3a)',
    glow: 'shadow-glow-rose',
    num: 'text-romance-rose',
  },
  sky: {
    pill: 'bg-sky-deep/30 text-sky-light border-sky/30',
    fill: 'linear-gradient(90deg, #7df0ff, #1f7fb8)',
    glow: 'shadow-glow-sky',
    num: 'text-sky-cyan',
  },
}

function Meter({ score, tone }) {
  const reduce = useReducedMotion()
  return (
    <div className="mt-5">
      <div className="mb-1.5 flex items-center justify-between font-mono text-[0.6rem] uppercase tracking-[0.2em] text-cream/50">
        <span>Archival fitness</span>
        <span className={tones[tone].num}>{score}%</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
        <motion.div
          className="h-full rounded-full"
          style={{ background: tones[tone].fill }}
          initial={reduce ? { width: `${score}%` } : { width: 0 }}
          whileInView={{ width: `${score}%` }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    </div>
  )
}

export default function Evidence() {
  return (
    <section
      id="evidence"
      className="relative mx-auto w-full max-w-6xl scroll-mt-16 px-5 py-20 sm:py-28"
    >
      <Reveal>
        <SectionLabel>{evidence.label}</SectionLabel>
      </Reveal>
      <Reveal delay={0.05}>
        <h2 className="font-display text-3xl font-semibold leading-tight sm:text-5xl">
          {evidence.headingEn}
        </h2>
      </Reveal>
      <Reveal delay={0.1}>
        <p className="ne-serif mt-2 text-lg text-sky-light/75">
          {evidence.headingNe}
        </p>
      </Reveal>

      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {evidence.exhibits.map((x, idx) => (
          <Reveal key={x.tag} delay={idx * 0.08}>
            <article className="glass flex h-full flex-col p-6 transition duration-300 hover:-translate-y-1 hover:border-white/20">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[0.6rem] uppercase tracking-[0.22em] text-cream/50">
                  {x.tag}
                </span>
                <span
                  className={`rounded-full border px-2.5 py-0.5 font-mono text-[0.58rem] uppercase tracking-wider ${tones[x.tone].pill}`}
                >
                  {x.verdictEn}
                </span>
              </div>

              <h3 className="mt-4 font-display text-2xl font-semibold text-cream">
                {x.titleEn}
              </h3>
              <p className="ne text-sm text-sky-light/65">{x.titleNe}</p>

              <p className="mt-3 text-sm leading-relaxed text-cream/75">
                {x.noteEn}
              </p>
              <p className="ne mt-1.5 text-xs leading-relaxed text-cream/50">
                {x.noteNe}
              </p>

              <div className="mt-auto">
                <Meter score={x.score} tone={x.tone} />
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
