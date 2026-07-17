import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'framer-motion'

/**
 * Soft romantic glow that trails the cursor. Desktop + fine pointer only;
 * skipped for touch devices and reduced-motion users.
 */
export default function CursorGlow() {
  const ref = useRef(null)
  const reduce = useReducedMotion()

  useEffect(() => {
    if (reduce) return
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    if (!fine) return

    const el = ref.current
    let tx = window.innerWidth / 2
    let ty = window.innerHeight / 2
    let x = tx
    let y = ty
    let raf
    let visible = false

    const move = (e) => {
      tx = e.clientX
      ty = e.clientY
      if (!visible) {
        visible = true
        el.style.opacity = '1'
      }
    }
    const leave = () => {
      visible = false
      el.style.opacity = '0'
    }

    const loop = () => {
      x += (tx - x) * 0.14
      y += (ty - y) * 0.14
      el.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`
      raf = requestAnimationFrame(loop)
    }

    window.addEventListener('pointermove', move)
    window.addEventListener('mouseout', leave)
    raf = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', move)
      window.removeEventListener('mouseout', leave)
    }
  }, [reduce])

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 -z-10 h-[26rem] w-[26rem] rounded-full opacity-0 blur-3xl transition-opacity duration-500"
      style={{
        background:
          'radial-gradient(circle, rgba(255,77,109,0.16), rgba(56,189,248,0.10) 45%, transparent 70%)',
      }}
    />
  )
}
