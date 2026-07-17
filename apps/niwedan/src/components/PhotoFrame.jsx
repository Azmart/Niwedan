import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from 'framer-motion'

/**
 * Floating gallery frame holding an abstract placeholder "masterpiece".
 * No real photo — swap the inner artwork for your own image later.
 * Tilts gently toward the cursor on devices with a fine pointer.
 */
export default function PhotoFrame() {
  const reduce = useReducedMotion()
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [9, -9]), {
    stiffness: 120,
    damping: 14,
  })
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-12, 12]), {
    stiffness: 120,
    damping: 14,
  })

  const onMove = (e) => {
    if (reduce) return
    const r = e.currentTarget.getBoundingClientRect()
    mx.set((e.clientX - r.left) / r.width - 0.5)
    my.set((e.clientY - r.top) / r.height - 0.5)
  }
  const onLeave = () => {
    mx.set(0)
    my.set(0)
  }

  return (
    <div className="relative [perspective:1200px]">
      {/* glow halo */}
      <div
        aria-hidden="true"
        className="absolute -inset-6 -z-10 rounded-[2.5rem] bg-romance-gradient opacity-30 blur-3xl animate-glow-pulse"
      />

      <motion.figure
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        style={reduce ? undefined : { rotateX: rx, rotateY: ry }}
        className="group relative w-[18rem] max-w-[78vw] animate-float rounded-[2rem] border border-white/15 bg-white/[0.06] p-4 shadow-glass backdrop-blur-xl [transform-style:preserve-3d] sm:w-[21rem]"
      >
        {/* the "artwork" — abstract, no real image */}
        <div className="relative aspect-[4/5] overflow-hidden rounded-2xl">
          <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_20%_10%,#ff8aa3_0%,#c41e3a_36%,#101a3c_72%)]" />
          <div className="absolute -left-10 top-10 h-40 w-40 rounded-full bg-sky-cyan/40 blur-3xl" />
          <div className="absolute bottom-6 right-2 h-32 w-32 rounded-full bg-romance-rose/50 blur-2xl" />
          <div className="absolute inset-0 bg-[linear-gradient(115deg,transparent_30%,rgba(255,255,255,0.35)_50%,transparent_70%)] bg-[length:220%_100%] animate-shimmer" />

          {/* placeholder mark */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="font-display text-6xl text-white/85 drop-shadow">
              ✦
            </span>
            <span className="mt-2 font-mono text-[0.62rem] uppercase tracking-[0.3em] text-white/75">
              your masterpiece
            </span>
            <span className="ne mt-1 text-xs text-white/65">
              यहाँ कलाकृति राखिनेछ
            </span>
          </div>

          {/* corner tags */}
          <span className="absolute left-3 top-3 rounded-full bg-black/35 px-2.5 py-1 font-mono text-[0.6rem] uppercase tracking-widest text-sky-light backdrop-blur">
            HD · 4K
          </span>
          <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-romance-deep/60 px-2.5 py-1 font-mono text-[0.58rem] uppercase tracking-widest text-romance-blush backdrop-blur">
            <span className="h-1.5 w-1.5 animate-twinkle rounded-full bg-romance-rose" />
            story · 24h
          </span>
        </div>

        {/* brass gallery plaque */}
        <figcaption className="mt-4 flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-gradient-to-r from-amber-200/15 to-sky-light/10 px-4 py-2.5">
          <div className="leading-tight">
            <p className="font-display text-base italic text-cream">
              “Untitled Masterpiece”
            </p>
            <p className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-sky-light/70">
              Mixed media · pending consent
            </p>
          </div>
          <span className="font-mono text-[0.6rem] text-cream/50">№ 001</span>
        </figcaption>
      </motion.figure>
    </div>
  )
}
