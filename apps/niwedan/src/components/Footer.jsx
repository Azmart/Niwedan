import { footer, meta } from '../data/content.js'

export default function Footer() {
  return (
    <footer className="relative mx-auto w-full max-w-5xl px-5 pb-14 pt-6">
      <div className="rule mb-8" />

      <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:justify-between sm:text-left">
        <div>
          <p className="font-display text-lg italic text-cream/85">
            {footer.lineEn}
          </p>
          <p className="ne mt-1 text-sm text-sky-light/60">{footer.lineNe}</p>
        </div>

        <a
          href="#top"
          className="btn-ghost shrink-0 px-5 py-2.5 text-xs"
          aria-label="Back to top"
        >
          ↑ Back to top
        </a>
      </div>

      <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-white/5 pt-6 font-mono text-[0.6rem] uppercase tracking-[0.2em] text-cream/35 sm:flex-row">
        <span>
          Request {meta.requestId} · {meta.filing}
        </span>
        <span className="text-pretty text-center text-cream/30 normal-case tracking-normal">
          {footer.privacyEn}
        </span>
        <span>Drafted with respect · {new Date().getFullYear()}</span>
      </div>
    </footer>
  )
}
