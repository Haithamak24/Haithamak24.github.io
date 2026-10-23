import { useSite, photo } from '../lib/ctx.js'
import { LINKS } from '../content.js'
import { StitchStar, Cross } from './Stitch.jsx'
export default function Hero() {
  const { t, lang } = useSite()
  const h = t.hero
  return (
    <section className="hero wrap">
      <div className="hero-text">
        <p className="hello">{h.hello}</p>
        <h1>{h.name}</h1>
        {lang === 'en' && <p className="arname" lang="ar" dir="rtl">هيثم ابو خالد</p>}
        <p className="lead">{h.lead}</p>
        <ul className="facts">{h.facts.map(f => <li key={f}><Cross size={12} />{f}</li>)}</ul>
        <div className="cta">
          <a className="btn solid" href={`mailto:${LINKS.email}`}>{h.email}</a>
          <a className="btn" href={LINKS.cv} target="_blank" rel="noopener">{h.cv}</a>
          <a className="btn" href={LINKS.github} target="_blank" rel="noopener">GitHub</a>
          <a className="btn" href={LINKS.linkedin} target="_blank" rel="noopener">LinkedIn</a>
        </div>
      </div>
      <figure className="arch-wrap">
        <div className="arch"><img src={photo('hero-brasov')} alt="" width="1013" height="1350" fetchpriority="high" /></div>
        <StitchStar className="hero-star" />
        <figcaption>{h.cap}</figcaption>
      </figure>
      <a className="scroll-cue" href="#thread">{h.scroll}<span aria-hidden="true">↓</span></a>
    </section>
  )
}
