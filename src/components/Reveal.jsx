import { motion, useReducedMotion } from 'framer-motion'

/**
 * Fade + rise (and optional slide / scale) on scroll-into-view.
 * Respects prefers-reduced-motion (fades only, no movement).
 */
export default function Reveal({
  children,
  delay = 0,
  y = 28,
  x = 0,
  scale = false,
  className = '',
  as = 'div',
}) {
  const reduce = useReducedMotion()
  const MotionTag = motion[as] || motion.div

  const hidden = reduce
    ? { opacity: 0 }
    : { opacity: 0, y, x, ...(scale ? { scale: 0.92 } : {}) }
  const shown = { opacity: 1, y: 0, x: 0, ...(scale ? { scale: 1 } : {}) }

  return (
    <MotionTag
      className={className}
      initial={hidden}
      whileInView={shown}
      viewport={{ once: false, amount: 0.2, margin: '0px 0px -10% 0px' }}
      transition={{ duration: 0.75, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </MotionTag>
  )
}
