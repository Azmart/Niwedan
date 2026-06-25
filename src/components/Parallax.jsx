import { useRef } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'

/**
 * Scroll-linked depth: children drift vertically as the element passes through
 * the viewport. Best on decorative / non-layout elements. `distance` is the
 * total travel in px (split +/- around the resting point). Off for reduced motion.
 */
export default function Parallax({
  children,
  distance = 60,
  className = '',
  as = 'div',
}) {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], [distance, -distance])
  const MotionTag = motion[as] || motion.div

  return (
    <MotionTag ref={ref} style={reduce ? undefined : { y }} className={className}>
      {children}
    </MotionTag>
  )
}
