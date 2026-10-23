import { useEffect, useRef } from 'react'
import { useSite, photo, reduceMotion } from '../lib/ctx.js'
import { Cross, Motif } from './Stitch.jsx'

export default function Thread() {
  const { t } = useSite()
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    const spine = el.querySelector('.spine')
    let raf
    const update = () => {
      const r = spine.getBoundingClientRect(), vh = window.innerHeight
      const p = Math.min(1, Math.max(0, (vh * 0.62 - r.top) / r.height))
      el.style.setProperty('--p', reduceMotion() ? 1 : p)
      // reveal every stop whose top has passed 80% of the viewport (deterministic, survives fast scrolls and anchor jumps)
      el.querySelectorAll('.stop:not(.on)').forEach(s => { if (s.getBoundingClientRect().top < vh * 0.8) s.classList.add('on') })
    }
    const onScroll = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(update) }
    if (reduceMotion()) el.querySelectorAll('video').forEach(v => { v.removeAttribute('autoplay'); v.pause() })
    update(); window.addEventListener('scroll', onScroll, { passive: true }); window.addEventListener('resize', onScroll)
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll) }
  }, [])

  return (
    <section id="thread" className="thread" ref={ref}>
      <div className="wrap">
        <div className="sec-intro"><h2>{t.thread.title}</h2><p>{t.thread.intro}</p></div>
        <ol className="stops">
          <div className="spine" aria-hidden="true"><i /></div>
          <div className="bird"><Motif name="sunbird" /></div>
          {t.thread.stops.map((s, i) => (
            <li key={i} className={`stop ${s.photo ? 'has-photo' : 'no-photo'} ${i % 2 ? 'alt' : ''}`}>
              <span className="node" aria-hidden="true"><Cross size={16} /></span>
              <div className="stop-text">
                <p className="when"><b>{s.when}</b><span>{s.where}</span></p>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
              </div>
              {s.photo && (
                <div className={`stop-media ${s.photo2 ? 'pair' : ''}`}>
                  {s.video
                    ? <video src={`${import.meta.env.BASE_URL}photos/${s.video}.mp4`} poster={`${import.meta.env.BASE_URL}photos/${s.video}.jpg`} muted loop playsInline autoPlay preload="metadata" aria-label={s.title} />
                    : <img src={photo(s.photo)} alt={s.title} loading="lazy" />}
                  {s.photo2 && <img src={photo(s.photo2)} alt="" loading="lazy" />}
                </div>
              )}
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
