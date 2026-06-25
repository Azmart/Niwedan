import { useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import Reveal from './Reveal.jsx'
import SectionLabel from './SectionLabel.jsx'
import Modal from './Modal.jsx'
import HeartBurst from './HeartBurst.jsx'
import { notify } from '../lib/notify.js'
import { choice, appeal } from '../data/content.js'

export default function ChoicePanel() {
  const reduce = useReducedMotion()
  const [modal, setModal] = useState(null) // 'granted' | 'hd' | null
  const [hearts, setHearts] = useState(0)
  const [appealOpen, setAppealOpen] = useState(false)

  const grant = () => {
    setModal('granted')
    setHearts((n) => n + 1)
    notify('granted')
  }

  const chooseHd = () => {
    setModal('hd')
    notify('hd')
  }

  const active = modal ? choice.options[modal] : null

  return (
    <section
      id="verdict"
      className="relative mx-auto w-full max-w-4xl scroll-mt-16 px-5 py-20 sm:py-28"
    >
      <Reveal className="text-center">
        <div className="flex justify-center">
          <SectionLabel>{choice.label}</SectionLabel>
        </div>
        <h2 className="mx-auto max-w-2xl font-display text-3xl font-semibold leading-tight text-balance sm:text-5xl">
          {choice.headingEn}
        </h2>
        <p className="ne-serif mt-3 text-lg text-sky-light/75">
          {choice.headingNe}
        </p>
        <p className="mx-auto mt-5 max-w-md text-sm text-cream/60">
          {choice.subEn}
          <span className="ne mt-1 block text-sky-light/55">
            {choice.subNe}
          </span>
        </p>
      </Reveal>

      <Reveal delay={0.1}>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <button onClick={grant} className="btn-primary w-full sm:w-auto">
            <span aria-hidden="true">♥</span>
            {choice.options.granted.labelEn}
          </button>
          <button
            onClick={chooseHd}
            className="btn-sky w-full sm:w-auto"
          >
            <span aria-hidden="true">✦</span>
            {choice.options.hd.labelEn}
          </button>
        </div>
      </Reveal>

      <Reveal delay={0.18} className="mt-6 text-center">
        <button
          onClick={() => setAppealOpen((v) => !v)}
          aria-expanded={appealOpen}
          className="font-mono text-xs uppercase tracking-[0.2em] text-cream/55 underline-offset-4 transition hover:text-romance-rose hover:underline"
        >
          {appealOpen ? '— hide closing argument —' : choice.options.convince.labelEn}
        </button>
        <p className="ne mt-1 text-[0.7rem] text-cream/35">
          {choice.options.convince.labelNe}
        </p>
      </Reveal>

      {/* Appeal / closing argument reveal */}
      <AnimatePresence initial={false}>
        {appealOpen && (
          <motion.div
            key="appeal"
            initial={reduce ? { opacity: 0 } : { opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, height: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="glass-strong mt-8 p-7 sm:p-9">
              <div className="mb-4 flex items-center gap-3">
                <span className="h-px w-8 bg-gradient-to-r from-romance-rose to-sky" />
                <span className="doc-label">{appeal.label}</span>
              </div>
              <h3 className="font-display text-2xl font-semibold text-cream sm:text-3xl">
                {appeal.headingEn}
              </h3>
              <p className="ne-serif mt-1 text-lg text-sky-light/70">
                {appeal.headingNe}
              </p>
              <p className="mt-5 text-base leading-relaxed text-cream/85 text-pretty">
                {appeal.bodyEn}
              </p>
              <p className="ne mt-4 text-sm leading-relaxed text-cream/60 text-pretty">
                {appeal.bodyNe}
              </p>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <button onClick={grant} className="btn-primary w-full sm:w-auto">
                  <span aria-hidden="true">♥</span>
                  {choice.options.granted.labelEn}
                </button>
                <button
                  onClick={chooseHd}
                  className="btn-ghost w-full sm:w-auto"
                >
                  {choice.options.hd.labelEn}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Result modal */}
      <Modal open={modal !== null} onClose={() => setModal(null)} labelId="verdict-modal-title">
        {active && (
          <div className="text-center">
            <div className="mx-auto mb-5 grid h-14 w-14 place-items-center rounded-full bg-romance-gradient text-2xl text-white shadow-glow-rose">
              {modal === 'granted' ? '♥' : '✦'}
            </div>
            <h3
              id="verdict-modal-title"
              className="font-display text-2xl font-semibold text-cream sm:text-3xl"
            >
              {active.modalTitleEn}
            </h3>
            <p className="ne-serif mt-1 text-lg text-sky-light/75">
              {active.modalTitleNe}
            </p>
            <p className="mt-4 text-sm leading-relaxed text-cream/75">
              {active.modalBodyEn}
            </p>
            <p className="ne mt-3 text-xs leading-relaxed text-cream/55">
              {active.modalBodyNe}
            </p>

            <button
              onClick={() => setModal(null)}
              className="btn-ghost mt-7 w-full"
            >
              Close · बन्द गर्नुहोस्
            </button>
            <p className="mt-4 font-mono text-[0.58rem] uppercase tracking-[0.2em] text-cream/35">
              Only a confirmation is sent — never any personal information.
            </p>
          </div>
        )}
      </Modal>

      <HeartBurst trigger={hearts} />
    </section>
  )
}
