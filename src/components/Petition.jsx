import Reveal from './Reveal.jsx'
import SectionLabel from './SectionLabel.jsx'
import Seal from './Seal.jsx'
import { petition, meta } from '../data/content.js'

export default function Petition() {
  return (
    <section
      id="petition"
      className="relative mx-auto w-full max-w-4xl scroll-mt-16 px-5 py-20 sm:py-28"
    >
      <Reveal>
        <SectionLabel>{petition.label}</SectionLabel>
      </Reveal>
      <Reveal delay={0.05}>
        <h2 className="font-display text-3xl font-semibold sm:text-5xl">
          {petition.headingEn}
          <span className="ne-serif ml-3 text-2xl text-sky-light/70 sm:text-3xl">
            · {petition.headingNe}
          </span>
        </h2>
      </Reveal>

      {/* The decree */}
      <Reveal delay={0.12}>
        <article className="glass-strong relative mt-10 overflow-hidden p-7 sm:p-10">
          {/* corner ticks */}
          <span className="pointer-events-none absolute left-4 top-4 h-6 w-6 rounded-tl-lg border-l-2 border-t-2 border-white/20" />
          <span className="pointer-events-none absolute right-4 top-4 h-6 w-6 rounded-tr-lg border-r-2 border-t-2 border-white/20" />
          <span className="pointer-events-none absolute bottom-4 left-4 h-6 w-6 rounded-bl-lg border-b-2 border-l-2 border-white/20" />
          <span className="pointer-events-none absolute bottom-4 right-4 h-6 w-6 rounded-br-lg border-b-2 border-r-2 border-white/20" />

          <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-5">
            <div>
              <p className="font-mono text-[0.62rem] uppercase tracking-[0.28em] text-sky-light/70">
                Petition · निवेदन-पत्र
              </p>
              <p className="mt-1 font-mono text-[0.62rem] text-cream/45">
                Ref. {meta.requestId} · {meta.filedOn}
              </p>
            </div>
            <span className="font-mono text-[0.62rem] uppercase tracking-[0.2em] text-romance-rose">
              ● Pending
            </span>
          </div>

          {/* Formal English request */}
          <p className="mt-7 font-display text-xl leading-relaxed text-cream text-pretty first-letter:float-left first-letter:mr-3 first-letter:font-display first-letter:text-6xl first-letter:font-semibold first-letter:text-gradient sm:text-2xl">
            {petition.bodyEn}
          </p>

          <div className="my-7 flex items-center gap-3">
            <span className="rule" />
            <span className="font-mono text-[0.58rem] uppercase tracking-[0.3em] text-cream/40">
              नेपालीमा
            </span>
            <span className="rule" />
          </div>

          {/* Warmer Nepali petition */}
          <div className="ne-serif space-y-3 text-lg leading-relaxed text-cream/90">
            {petition.bodyNe.map((line, i) => (
              <p key={i} className={i === 0 ? 'text-sky-light' : ''}>
                {line}
              </p>
            ))}
          </div>

          {/* Signature + seal */}
          <div className="mt-9 flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-xs">
              <p className="ne-serif text-base text-cream/70">
                {petition.signoffNe}
              </p>
              <p className="ne-serif mt-3 border-b border-dashed border-white/30 pb-1.5 text-2xl italic leading-snug text-cream">
                {meta.petitioner}
              </p>
              <p className="mt-2 font-mono text-[0.6rem] uppercase tracking-[0.2em] text-cream/45">
                {meta.petitionerEn}
              </p>
            </div>
            <Seal className="shrink-0 -rotate-6" />
          </div>
        </article>
      </Reveal>

      {/* Exhibit Ø — the original message, on record */}
      <Reveal delay={0.18}>
        <details className="group mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur open:bg-white/[0.05] sm:p-6">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
            <span>
              <span className="font-mono text-[0.62rem] uppercase tracking-[0.24em] text-cream/55">
                {petition.firstDraft.label}
              </span>
              <span className="mt-1 block text-sm text-cream/70">
                {petition.firstDraft.noteEn}
              </span>
            </span>
            <span
              aria-hidden="true"
              className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-white/20 text-cream/60 transition group-open:rotate-45"
            >
              +
            </span>
          </summary>

          <div className="mt-5 rounded-xl border border-white/10 bg-ink-900/40 p-5">
            <p className="ne-serif space-y-2 text-[0.95rem] leading-relaxed text-cream/75">
              {petition.firstDraft.text.map((line, i) => (
                <span key={i} className="block">
                  {line}
                </span>
              ))}
            </p>
          </div>
          <p className="ne mt-3 text-xs text-cream/45">
            {petition.firstDraft.noteNe}
          </p>
        </details>
      </Reveal>
    </section>
  )
}
