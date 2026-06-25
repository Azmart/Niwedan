import Reveal from './Reveal.jsx'
import Parallax from './Parallax.jsx'
import SectionLabel from './SectionLabel.jsx'
import { finalNote } from '../data/content.js'

export default function FinalNote() {
  return (
    <section
      id="final"
      className="relative mx-auto w-full max-w-3xl scroll-mt-16 px-5 py-20 sm:py-28"
    >
      <Reveal y={40} scale>
        <div className="glass-strong relative overflow-hidden p-8 text-center sm:p-12">
          {/* soft top glow (drifts on scroll) */}
          <Parallax
            distance={40}
            className="pointer-events-none absolute -top-24 left-1/2 -ml-24 h-48 w-48"
          >
            <div
              aria-hidden="true"
              className="h-full w-full rounded-full bg-romance-gradient opacity-25 blur-3xl"
            />
          </Parallax>

          <div className="flex justify-center">
            <SectionLabel>{finalNote.label}</SectionLabel>
          </div>

          <h2 className="font-display text-3xl font-semibold leading-tight text-balance sm:text-4xl">
            {finalNote.headingEn}
          </h2>
          <p className="ne-serif mt-3 text-xl text-sky-light/80">
            {finalNote.headingNe}
          </p>

          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-cream/80 text-pretty">
            {finalNote.bodyEn}
          </p>
          <p className="ne mx-auto mt-4 max-w-xl text-sm leading-relaxed text-cream/60 text-pretty">
            {finalNote.bodyNe}
          </p>

          {/* respect stamp */}
          <div className="mt-9 inline-flex -rotate-3 items-center gap-3 rounded-xl border-2 border-dashed border-romance-rose/50 px-5 py-3">
            <span className="text-2xl text-romance-rose" aria-hidden="true">
              ♥
            </span>
            <div className="text-left">
              <p className="font-mono text-[0.62rem] uppercase tracking-[0.28em] text-romance-blush">
                {finalNote.sealEn}
              </p>
              <p className="ne text-sm text-cream/70">{finalNote.sealNe}</p>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  )
}
