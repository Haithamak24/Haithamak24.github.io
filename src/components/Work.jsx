import { useSite } from '../lib/ctx.js'
import { LINKS } from '../content.js'
import Machine from './Machine.jsx'
import NoteDemo from './NoteDemo.jsx'
import EligibilityDemo from './EligibilityDemo.jsx'
import VerbivoreDemo from './VerbivoreDemo.jsx'
import { Cross } from './Stitch.jsx'

const Facts = ({ items }) => <ul className="facts-list">{items.map(([b, r]) => <li key={b}><Cross size={11} /><span><b>{b}</b>{r}</span></li>)}</ul>
const Stack = ({ items }) => <div className="stack" dir="ltr">{items.map(s => <span key={s}>{s}</span>)}</div>

export default function Work() {
  const { t } = useSite()
  const c = t.cases
  return (
    <section id="work" className="work">
      <div className="wrap">
        <div className="sec-intro"><h2>{t.work.title}</h2><p>{t.work.intro}</p></div>
        <Machine />

        <article className="case" id="p-note">
          <div>
            <p className="meta">{c.note.meta}</p>
            <h3>{c.note.title}</h3>
            {c.note.p.map(x => <p key={x}>{x}</p>)}
            <Facts items={c.note.facts} />
            <Stack items={['Java', 'Spring Boot', 'PostgreSQL', 'Liquibase', 'Speech-to-text', 'LLM']} />
          </div>
          <NoteDemo />
        </article>

        <article className="case" id="p-mb">
          <div>
            <p className="prize">{c.mb.prize}</p>
            <p className="meta">{c.mb.meta}</p>
            <h3>{c.mb.title}</h3>
            {c.mb.p.map(x => <p key={x}>{x}</p>)}
            <Facts items={c.mb.facts} />
            <Stack items={['React', 'TypeScript', 'Spring Boot', 'PostgreSQL', 'Claude API']} />
            <div className="links"><a href={LINKS.mobility} target="_blank" rel="noopener">{c.mb.link}</a></div>
          </div>
          <EligibilityDemo />
        </article>

        <article className="case" id="p-vb">
          <div>
            <p className="meta">{c.vb.meta}</p>
            <h3>{c.vb.title}</h3>
            {c.vb.p.map(x => <p key={x}>{x}</p>)}
            <Facts items={c.vb.facts} />
            <Stack items={['Python', 'ffmpeg', 'Creatomate', 'AWS Polly', 'S3', 'DaVinci Resolve']} />
          </div>
          <VerbivoreDemo />
        </article>

        <div className="mini">
          <article id="p-laq">
            <p className="meta">{c.laq.meta}</p>
            <h3>{c.laq.title} <span className="ar-alt" lang="ar">لقيتها</span></h3>
            <p>{c.laq.p}</p>
            <div className="links"><a href={LINKS.laqeetha} target="_blank" rel="noopener">{c.laq.site}</a><a href={LINKS.laqeethaCode} target="_blank" rel="noopener">{c.laq.code}</a></div>
          </article>
          <article>
            <p className="meta">{c.sc.meta}</p>
            <h3>{c.sc.title}</h3>
            <p>{c.sc.p}</p>
            <Stack items={['MongoDB', 'Elasticsearch', 'Change Streams']} />
          </article>
        </div>
      </div>
    </section>
  )
}
