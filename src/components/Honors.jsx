import { useSite } from '../lib/ctx.js'
import { Motif } from './Stitch.jsx'
export default function Honors() {
  const { t } = useSite()
  const h = t.honors
  return (
    <section id="honors" className="honors-sec">
      <div className="wrap">
        <div className="sec-intro"><div className="title-row"><h2>{h.title}</h2><Motif name="olive" grow dur={1400} /></div></div>
        <div className="honors">
          <ul className="hlist">{h.items.map(([y, b, s]) => <li key={b}><span className="yr">{y}</span><div><b>{b}</b><span>{s}</span></div></li>)}</ul>
          <div>
            <div className="numbers">
              <div><b dir="ltr">92.4%</b><span>{h.gpa}</span></div>
              <div><b dir="ltr">5×</b><span>{h.list}</span></div>
            </div>
            <h4 className="tools-h">{h.tools}</h4>
            {h.groups.map(([g, xs]) => <div className="tool-g" key={g}><h5>{g}</h5><div className="stack" dir="ltr">{xs.map(x => <span key={x}>{x}</span>)}</div></div>)}
          </div>
        </div>
      </div>
    </section>
  )
}
