import { useEffect, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'

const COLORS = ['#ff4d6d', '#ff8aa3', '#7df0ff', '#ffd9e0', '#38bdf8']

/**
 * Fires a celebratory spray of hearts from the screen centre whenever the
 * numeric `trigger` prop changes. Purely decorative.
 */
export default function HeartBurst({ trigger }) {
  const reduce = useReducedMotion()
  const [batches, setBatches] = useState([])

  useEffect(() => {
    if (!trigger || reduce) return
    const id = trigger
    const hearts = Array.from({ length: 18 }, (_, i) => {
      const angle = (i / 18) * Math.PI * 2 + Math.random() * 0.5
      const dist = 120 + Math.random() * 200
      return {
        i,
        x: Math.cos(angle) * dist,
        y: Math.sin(angle) * dist - 60,
        color: COLORS[i % COLORS.length],
        size: 14 + Math.random() * 18,
        delay: Math.random() * 0.12,
      }
    })
    setBatches((b) => [...b, { id, hearts }])
    const t = setTimeout(
      () => setBatches((b) => b.filter((x) => x.id !== id)),
      1700,
    )
    return () => clearTimeout(t)
  }, [trigger, reduce])

  return (
    <div className="pointer-events-none fixed inset-0 z-[60] flex items-center justify-center">
      <AnimatePresence>
        {batches.map((batch) =>
          batch.hearts.map((h) => (
            <motion.span
              key={`${batch.id}-${h.i}`}
              className="absolute"
              style={{ color: h.color, fontSize: h.size }}
              initial={{ opacity: 0, x: 0, y: 0, scale: 0.3 }}
              animate={{
                opacity: [0, 1, 1, 0],
                x: h.x,
                y: h.y,
                scale: [0.3, 1.1, 1],
                rotate: h.x > 0 ? 40 : -40,
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, delay: h.delay, ease: 'easeOut' }}
            >
              ♥
            </motion.span>
          )),
        )}
      </AnimatePresence>
    </div>
  )
}
