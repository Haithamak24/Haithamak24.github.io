import { useEffect, useRef, useState } from 'react'
import { useSite, photo, reduceMotion } from '../lib/ctx.js'
const KM = 2371
export default function Far() {
  const { t, lang } = useSite()
  const ref = useRef(null)
  const [n, setN] = useState(0)
  useEffect(() => {
    if (reduceMotion()) { setN(KM); return }
    let raf, done = false
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting || done) return
      done = true; const t0 = performance.now()
      const step = now => { const k = Math.min(1, (now - t0) / 1600); setN(Math.round(KM * (1 - Math.pow(1 - k, 3)))); if (k < 1) raf = requestAnimationFrame(step) }
      raf = requestAnimationFrame(step)
    }, { threshold: 0.15 })
    io.observe(ref.current)
    return () => { io.disconnect(); cancelAnimationFrame(raf) }
  }, [])
  const num = n.toLocaleString('en-US')
  return (
    <section className="far" ref={ref}>
      <div className="wrap far-grid">
        <img src={photo('signpost')} alt="" loading="lazy" />
        <div>
          <p className="far-to">{t.far.to}</p>
          <p className="far-num"><span>{num}</span> {t.far.km}</p>
          <p className="far-line">{t.far.line}</p>
        </div>
      </div>
    </section>
  )
}
