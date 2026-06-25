import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'framer-motion'

// Soft pre-rendered glow sprite so we don't build a gradient every frame.
function makeGlow(color) {
  const s = 64
  const c = document.createElement('canvas')
  c.width = c.height = s
  const ctx = c.getContext('2d')
  const g = ctx.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2)
  g.addColorStop(0, color)
  g.addColorStop(0.4, color.replace('1)', '0.35)'))
  g.addColorStop(1, color.replace('1)', '0)'))
  ctx.fillStyle = g
  ctx.fillRect(0, 0, s, s)
  return c
}

function heartPath(ctx, x, y, s, rot) {
  ctx.save()
  ctx.translate(x, y)
  ctx.rotate(rot)
  ctx.beginPath()
  ctx.moveTo(0, s * 0.35)
  ctx.bezierCurveTo(s * 0.5, -s * 0.25, s * 1.1, s * 0.35, 0, s)
  ctx.bezierCurveTo(-s * 1.1, s * 0.35, -s * 0.5, -s * 0.25, 0, s * 0.35)
  ctx.closePath()
  ctx.fill()
  ctx.restore()
}

export default function ParticleField() {
  const canvasRef = useRef(null)
  const reduce = useReducedMotion()

  useEffect(() => {
    if (reduce) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let raf
    let w, h, dpr
    let running = true

    const rose = makeGlow('rgba(255,90,125,1)')
    const cyan = makeGlow('rgba(125,240,255,1)')

    let dots = []
    let hearts = []

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = canvas.clientWidth
      h = canvas.clientHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      const area = w * h
      const dotCount = Math.min(90, Math.round(area / 16000))
      dots = Array.from({ length: dotCount }, () => spawnDot(true))
      const heartCount = Math.min(10, Math.round(area / 150000))
      hearts = Array.from({ length: heartCount }, () => spawnHeart(true))
    }

    function spawnDot(initial) {
      return {
        x: Math.random() * w,
        y: initial ? Math.random() * h : h + 20,
        r: 6 + Math.random() * 16,
        vy: 0.12 + Math.random() * 0.4,
        vx: (Math.random() - 0.5) * 0.25,
        phase: Math.random() * Math.PI * 2,
        tw: 0.4 + Math.random() * 1.4,
        sprite: Math.random() > 0.5 ? rose : cyan,
        base: 0.18 + Math.random() * 0.4,
      }
    }

    function spawnHeart(initial) {
      return {
        x: Math.random() * w,
        y: initial ? Math.random() * h : h + 30,
        s: 5 + Math.random() * 7,
        vy: 0.18 + Math.random() * 0.35,
        drift: (Math.random() - 0.5) * 0.5,
        rot: (Math.random() - 0.5) * 0.6,
        phase: Math.random() * Math.PI * 2,
        rose: Math.random() > 0.45,
      }
    }

    let t = 0
    const draw = () => {
      if (!running) return
      t += 0.016
      ctx.clearRect(0, 0, w, h)
      ctx.globalCompositeOperation = 'lighter'

      for (const d of dots) {
        d.y -= d.vy
        d.x += d.vx + Math.sin(t * 0.5 + d.phase) * 0.15
        if (d.y < -30) Object.assign(d, spawnDot(false))
        const a = d.base * (0.55 + 0.45 * Math.sin(t * d.tw + d.phase))
        ctx.globalAlpha = Math.max(0, a)
        ctx.drawImage(d.sprite, d.x - d.r, d.y - d.r, d.r * 2, d.r * 2)
      }

      for (const hh of hearts) {
        hh.y -= hh.vy
        hh.x += hh.drift + Math.sin(t * 0.4 + hh.phase) * 0.2
        if (hh.y < -40) Object.assign(hh, spawnHeart(false))
        const a = 0.16 + 0.12 * Math.sin(t * 0.8 + hh.phase)
        ctx.globalAlpha = Math.max(0, a)
        ctx.fillStyle = hh.rose ? '#ff6582' : '#7df0ff'
        ctx.shadowColor = hh.rose ? '#ff4d6d' : '#7df0ff'
        ctx.shadowBlur = 14
        heartPath(ctx, hh.x, hh.y, hh.s, hh.rot + Math.sin(t * 0.5) * 0.15)
        ctx.shadowBlur = 0
      }

      ctx.globalAlpha = 1
      ctx.globalCompositeOperation = 'source-over'
      raf = requestAnimationFrame(draw)
    }

    const onVisibility = () => {
      running = !document.hidden
      if (running) {
        raf = requestAnimationFrame(draw)
      } else {
        cancelAnimationFrame(raf)
      }
    }

    resize()
    window.addEventListener('resize', resize)
    document.addEventListener('visibilitychange', onVisibility)
    raf = requestAnimationFrame(draw)

    return () => {
      running = false
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [reduce])

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 -z-10 h-full w-full"
      aria-hidden="true"
    />
  )
}
