import { useEffect, useRef } from 'react'
import { starCells, stitch, sizeCanvas, colorFor, rng, drawBand, drawMosaic, cssVar } from '../lib/stitch.js'
import { MOTIFS } from '../lib/motifs.js'
import { useSite, reduceMotion } from '../lib/ctx.js'

const STAR = starCells()

export function StitchStar({ className = '', animate = true }) {
  const ref = useRef(null)
  const { theme } = useSite()
  const first = useRef(true)
  useEffect(() => {
    const cv = ref.current; let raf
    const draw = (anim) => {
      if (!cv.clientWidth) return
      const S = sizeCanvas(cv), c = S.w / STAR.N, r = rng(7)
      cancelAnimationFrame(raf)
      if (!anim || reduceMotion()) { STAR.cells.forEach(e => stitch(S.ctx, e[0] * c, e[1] * c, c, colorFor(e[2]), r)); return }
      let i = 0, t0 = null
      const total = STAR.cells.length, dur = 1900
      const step = ts => {
        if (!t0) t0 = ts
        const target = Math.min(total, Math.floor(total * Math.pow((ts - t0) / dur, 0.8)))
        for (; i < target; i++) { const e = STAR.cells[i]; stitch(S.ctx, e[0] * c, e[1] * c, c, colorFor(e[2]), r) }
        if (i < total) raf = requestAnimationFrame(step)
      }
      raf = requestAnimationFrame(step)
    }
    draw(animate && first.current); first.current = false
    let t; const onR = () => { clearTimeout(t); t = setTimeout(() => draw(false), 150) }
    window.addEventListener('resize', onR)
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', onR) }
  }, [theme])
  return <canvas ref={ref} className={className} aria-hidden="true" />
}

export function StitchBand({ variant = 'a', className = '' }) {
  const ref = useRef(null)
  const { theme } = useSite()
  useEffect(() => {
    const draw = () => drawBand(ref.current, variant)
    draw()
    let t; const onR = () => { clearTimeout(t); t = setTimeout(draw, 150) }
    window.addEventListener('resize', onR)
    return () => window.removeEventListener('resize', onR)
  }, [theme, variant])
  return <canvas ref={ref} className={`band ${variant === 'b' ? 'thin' : ''} ${className}`} aria-hidden="true" />
}

// A small tatreez diamond, used as a bullet and as timeline nodes.
export const Cross = ({ size = 14 }) => (
  <svg className="cross" width={size} height={size} viewBox="0 0 14 14" aria-hidden="true">
    <path d="M7 1.2 12.8 7 7 12.8 1.2 7Z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    <path d="M7 5 9 7 7 9 5 7Z" fill="currentColor" />
  </svg>
)

// Any motif from lib/motifs.js, stitched into a canvas. `grow` re-stitches it when it scrolls into view.
export function Motif({ name, className = '', grow = false, dur = 1200 }) {
  const ref = useRef(null)
  const { theme } = useSite()
  useEffect(() => {
    const cv = ref.current, M = MOTIFS[name]; let raf
    const draw = anim => {
      if (!cv.clientWidth) return
      const S = sizeCanvas(cv), c = Math.min(S.w / M.w, S.h / M.h)
      const ox = (S.w - c * M.w) / 2, oy = (S.h - c * M.h) / 2, r = rng(5)
      cancelAnimationFrame(raf)
      const put = e => stitch(S.ctx, ox + e[0] * c, oy + e[1] * c, c, cssVar(e[2]), r)
      if (!anim || reduceMotion()) { M.cells.forEach(put); return }
      let i = 0, t0 = null
      const step = ts => {
        if (!t0) t0 = ts
        const target = Math.min(M.cells.length, Math.ceil(M.cells.length * (ts - t0) / dur))
        for (; i < target; i++) put(M.cells[i])
        if (i < M.cells.length) raf = requestAnimationFrame(step)
      }
      raf = requestAnimationFrame(step)
    }
    draw(false)
    let io, done = false
    if (grow) {
      io = new IntersectionObserver(([e]) => { if (e.isIntersecting && !done) { done = true; draw(true) } }, { threshold: 0.5 })
      io.observe(cv)
    }
    let t; const onR = () => { clearTimeout(t); t = setTimeout(() => draw(false), 150) }
    window.addEventListener('resize', onR)
    return () => { cancelAnimationFrame(raf); io && io.disconnect(); window.removeEventListener('resize', onR) }
  }, [theme, name])
  return <canvas ref={ref} className={`motif motif-${name} ${className}`} aria-hidden="true" />
}

export function MosaicSwatch({ className = '' }) {
  const ref = useRef(null)
  const { theme } = useSite()
  useEffect(() => { drawMosaic(ref.current, 5) }, [theme])
  return <canvas ref={ref} className={`motif ${className}`} aria-hidden="true" />
}
