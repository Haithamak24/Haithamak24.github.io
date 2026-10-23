import { useState } from 'react'
import { useSite } from '../lib/ctx.js'

const toLatin = s => s.replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d))
const NAME = '((?:أبو|ابو|أم|ام)\\s+\\S+|\\S+)'

// A small, honest imitation of the real service: if something is missing, ask; never guess.
export function parseNote(raw) {
  const t = toLatin(raw.trim()).replace(/[،,.]/g, ' ').replace(/\s+/g, ' ')
  if (!t) return { status: 'EMPTY' }
  let cur = null
  if (/شيكل|شيقل|شواقل/.test(t)) cur = 'ILS'; else if (/دينار|دنانير/.test(t)) cur = 'JOD'; else if (/دولار/.test(t)) cur = 'USD'
  let amt = null
  const m = t.match(/(\d+(?:\.\d+)?)\s*(شيكل|شيقل|شواقل|دينار|دنانير|دولار)/)
  if (m) amt = +m[1]
  else { const nums = t.match(/\d+(\.\d+)?/g); if (nums && !/كيلو|حبة|علبة/.test(t)) amt = +nums[nums.length - 1] }
  let intent = null
  if (/دفع|دفعت|سدد|سددت|سدّد|رجّع|رجع/.test(t)) intent = 'record_payment'
  else if (/أخذ|اخذ|أخذت|اخذت|سجّل|سجل|دين|عليه|عليها/.test(t)) intent = 'add_debt'
  let name = null, n = t.match(new RegExp('(?:سجّل|سجل)\\s+على\\s+' + NAME))
  if (n) name = n[1]
  if (!name) { n = t.match(new RegExp('^' + NAME + '\\s+(?:أخذ|اخذ|أخذت|اخذت|دفع|دفعت|سدد|سددت|سدّد|رجّع|رجع)')); if (n) name = n[1] }
  if (name && /^(فلان|فلانة|حدا|واحد)$/.test(name)) name = null
  const missing = []
  if (!intent) missing.push('action'); if (!name) missing.push('customer'); if (amt === null) missing.push('amount')
  if (!cur && amt !== null) cur = 'ILS'
  if (missing.length) return { status: 'NEEDS_CLARIFICATION', intent, customer: name, missing }
  return { status: 'AWAITING_CONFIRMATION', intent, customer: name, amount: amt, currency: cur, executed: false }
}

function Json({ obj }) {
  const s = JSON.stringify(obj, null, 2)
  const parts = s.split(/("(?:[^"\\]|\\.)*"\s*:|"(?:[^"\\]|\\.)*"|-?\d+(?:\.\d+)?|true|false|null)/g)
  return <pre className="json" dir="ltr" aria-live="polite">{parts.map((p, i) => {
    if (/^".*"\s*:$/.test(p)) return <span key={i} className="k">{p}</span>
    if (/^"/.test(p)) return <span key={i} className="s"><bdi>{p}</bdi></span>
    if (/^-?\d/.test(p)) return <span key={i} className="n">{p}</span>
    if (/^(true|false|null)$/.test(p)) return <span key={i} className="b">{p}</span>
    return p
  })}</pre>
}

export default function NoteDemo() {
  const { t } = useSite()
  const c = t.cases.note
  const [v, setV] = useState(c.chips[0][1])
  return (
    <div className="toy">
      <div className="toy-head"><h4>{c.toy}</h4><span>{c.toyTag}</span></div>
      <label htmlFor="noteIn">{c.label}</label>
      <textarea id="noteIn" dir="rtl" lang="ar" rows="2" value={v} onChange={e => setV(e.target.value)} />
      <div className="chips" dir="rtl">{c.chips.map(([l, x]) => <button key={l} type="button" onClick={() => setV(x)}>{l}</button>)}</div>
      <Json obj={parseNote(v)} />
      <p className="toy-note">{c.note}</p>
    </div>
  )
}
