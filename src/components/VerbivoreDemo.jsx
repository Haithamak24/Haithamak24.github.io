import { useState } from 'react'
import { useSite } from '../lib/ctx.js'
const LRI = '⁦', PDI = '⁩'
export default function VerbivoreDemo() {
  const { t } = useSite()
  const c = t.cases.vb
  const [f, setF] = useState(60)
  const perSec = (0.2304 / 25) * f
  return (
    <div className="toy">
      <div className="toy-head"><h4>{c.toy}</h4><span>{c.toyTag}</span></div>
      <div className="bidi">
        <div className="bidi-line bad"><span className="bidi-tag">{c.bad}</span><p dir="rtl" lang="ar">{"اسأل صديقك: What's this?"}</p></div>
        <div className="bidi-line good"><span className="bidi-tag">{c.good}</span><p dir="rtl" lang="ar">{'اسأل صديقك: ' + LRI + "What's this?" + PDI}</p></div>
      </div>
      <p className="toy-note">{c.bidiNote}</p>
      <div className="fps">
        <div className="ctrl-row"><span>{c.fps}</span><span className="range"><input type="range" min="24" max="60" value={f} aria-label={c.fps} onChange={e => setF(+e.target.value)} /><b dir="ltr">{f} fps</b></span></div>
        <div className="fps-out">
          <div><b dir="ltr">{perSec.toFixed(3)}</b><span>{c.cps}</span></div>
          <div><b dir="ltr">{Math.round(perSec * 181.5)}</b><span>{c.unit}</span></div>
        </div>
        <p className="toy-note">{c.fpsNote}</p>
      </div>
    </div>
  )
}
