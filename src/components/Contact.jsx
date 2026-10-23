import { useSite } from '../lib/ctx.js'
import { LINKS } from '../content.js'
import { Motif } from './Stitch.jsx'
export default function Contact() {
  const { t } = useSite()
  return (
    <section id="contact" className="contact">
      <div className="wrap">
        <div className="contact-head"><Motif name="anemone" grow dur={1600} /><h2>{t.contact.title}</h2></div>
        <a className="mail" href={`mailto:${LINKS.email}`} dir="ltr">{LINKS.email}</a>
        <p>{t.contact.p}</p>
        <div className="cta">
          <a className="btn" href={LINKS.github} target="_blank" rel="noopener">GitHub</a>
          <a className="btn" href={LINKS.linkedin} target="_blank" rel="noopener">LinkedIn</a>
          <a className="btn" href={LINKS.cv} target="_blank" rel="noopener">{t.hero.cv}</a>
        </div>
      </div>
    </section>
  )
}
