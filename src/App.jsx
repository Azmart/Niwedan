import { motion, useScroll, useSpring } from 'framer-motion'
import ParticleField from './components/ParticleField.jsx'
import CursorGlow from './components/CursorGlow.jsx'
import MusicPlayer from './components/MusicPlayer.jsx'
import Hero from './components/Hero.jsx'
import TheCase from './components/TheCase.jsx'
import Evidence from './components/Evidence.jsx'
import Petition from './components/Petition.jsx'
import ChoicePanel from './components/ChoicePanel.jsx'
import FinalNote from './components/FinalNote.jsx'
import Footer from './components/Footer.jsx'

export default function App() {
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  })

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      {/* Ambient layers */}
      <ParticleField />
      <CursorGlow />
      <MusicPlayer />

      {/* Scroll progress bar */}
      <motion.div
        className="fixed inset-x-0 top-0 z-50 h-1 origin-left bg-romance-gradient"
        style={{ scaleX: progress }}
        aria-hidden="true"
      />

      {/* Skip link for keyboard users */}
      <a
        href="#case"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-full focus:bg-ink-700 focus:px-4 focus:py-2 focus:text-sm focus:text-cream"
      >
        Skip to content
      </a>

      <main className="relative z-10">
        <Hero />
        <TheCase />
        <Evidence />
        <Petition />
        <ChoicePanel />
        <FinalNote />
      </main>

      <Footer />
    </div>
  )
}
