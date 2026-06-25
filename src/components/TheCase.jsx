import Reveal from './Reveal.jsx'
import SectionLabel from './SectionLabel.jsx'
import { theCase } from '../data/content.js'

export default function TheCase() {
  return (
    <section
      id="case"
      className="relative mx-auto w-full max-w-5xl scroll-mt-16 px-5 py-20 sm:py-28"
    >
      <Reveal>
        <SectionLabel>{theCase.label}</SectionLabel>
      </Reveal>

      <Reveal delay={0.05}>
        <h2 className="max-w-3xl font-display text-3xl font-semibold leading-tight text-balance sm:text-5xl">
          {theCase.headingEn}
        </h2>
      </Reveal>
      <Reveal delay={0.1}>
        <p className="ne-serif mt-3 max-w-3xl text-lg text-sky-light/75 sm:text-xl">
          {theCase.headingNe}
        </p>
      </Reveal>

      <ol className="relative mt-12 space-y-4 border-l border-white/10 pl-6 sm:pl-8">
        {theCase.points.map((p, idx) => (
          <Reveal as="li" key={p.no} delay={idx * 0.08}>
            <div className="group relative">
              {/* node on the rail */}
              <span
                aria-hidden="true"
                className="absolute -left-[31px] top-3 grid h-4 w-4 place-items-center rounded-full bg-ink-900 sm:-left-[39px]"
              >
                <span className="h-2.5 w-2.5 rounded-full bg-gradient-to-br from-romance-rose to-sky shadow-glow-rose transition group-hover:scale-125" />
              </span>

              <div className="glass p-5 transition duration-300 hover:border-white/20 hover:bg-white/[0.07] sm:p-6">
                <div className="flex items-start gap-4">
                  <span className="font-display text-3xl font-semibold text-gradient sm:text-4xl">
                    {p.no}
                  </span>
                  <div>
                    <p className="text-base text-cream/90 sm:text-lg">{p.en}</p>
                    <p className="ne mt-1.5 text-sm text-sky-light/70">{p.ne}</p>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </ol>
    </section>
  )
}
