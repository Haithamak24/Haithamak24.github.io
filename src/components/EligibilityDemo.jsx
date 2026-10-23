import { useState } from 'react'
import { useSite } from '../lib/ctx.js'

const RANK = { ELIGIBLE: 0, NEEDS_CONFIRMATION: 1, NOT_YET: 2, NOT_ELIGIBLE: 3 }
const TONE = { ELIGIBLE: 'ok', NEEDS_CONFIRMATION: 'q', NOT_YET: 'q', NOT_ELIGIBLE: 'n' }

// Deterministic: the worst rule result wins, and every rule explains itself.
export function judge(s, r) {
  let v = 'ELIGIBLE'; const out = []
  const worse = x => { if (RANK[x] > RANK[v]) v = x }
  const g = s.gpa.toFixed(2)
  if (s.dl === 1) { out.push(['n', r.dlNo]); worse('NOT_ELIGIBLE') } else out.push(['y', r.dlOk])
  if (s.gpa >= 3) out.push(['y', r.gpaOk(g)])
  else if (s.gpa >= 2.85) { out.push(['q', r.gpaQ(g)]); worse('NEEDS_CONFIRMATION') }
  else { out.push(['n', r.gpaNo(g)]); worse('NOT_ELIGIBLE') }
  if (s.year >= 2) out.push(['y', r.yrOk(s.year)]); else { out.push(['q', r.yrQ]); worse('NOT_YET') }
  if (s.eng === 0) out.push(['y', r.ielts])
  else if (s.eng === 1) { out.push(['q', r.moi]); worse('NEEDS_CONFIRMATION') }
  else { out.push(['q', r.none]); worse('NOT_YET') }
  return { v, out }
}

function Seg({ items, value, onChange, label }) {
  return <div className="seg" role="group" aria-label={label}>{items.map((x, i) =>
    <button key={x} aria-pressed={i === value} onClick={() => onChange(i)}>{x}</button>)}</div>
}

export default function EligibilityDemo() {
  const { t } = useSite()
  const c = t.cases.mb
  const [s, set] = useState({ gpa: 3.4, year: 3, eng: 1, dl: 0 })
  const { v, out } = judge(s, c.r)
  const mark = { y: '✓', q: '?', n: '✕' }
  return (
    <div className="toy">
      <div className="toy-head"><h4>{c.toy}</h4><span>{c.toyTag}</span></div>
      <div className="ctrls">
        <div className="ctrl-row"><span>{c.gpa}</span><span className="range"><input type="range" min="2" max="4" step="0.05" value={s.gpa} aria-label={c.gpa} onChange={e => set({ ...s, gpa: +e.target.value })} /><b dir="ltr">{s.gpa.toFixed(2)}</b></span></div>
        <div className="ctrl-row"><span>{c.year}</span><Seg label={c.year} items={c.years} value={s.year - 1} onChange={i => set({ ...s, year: i + 1 })} /></div>
        <div className="ctrl-row"><span>{c.eng}</span><Seg label={c.eng} items={c.engs} value={s.eng} onChange={i => set({ ...s, eng: i })} /></div>
        <div className="ctrl-row"><span>{c.dl}</span><Seg label={c.dl} items={c.dls} value={s.dl} onChange={i => set({ ...s, dl: i })} /></div>
      </div>
      <div className={`verdict tone-${TONE[v]}`} aria-live="polite"><span className="big" dir="ltr">{v}</span><p>{c.v[v]}</p></div>
      <ul className="trace">{out.map(([k, x]) => <li key={x} className="chk"><b className={k}>{mark[k]}</b><span>{x}</span></li>)}</ul>
      <p className="toy-note">{c.note}</p>
    </div>
  )
}
