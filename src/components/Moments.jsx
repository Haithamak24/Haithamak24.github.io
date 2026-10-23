import { useRef, useState } from 'react'
import { useSite, photo } from '../lib/ctx.js'
const ORDER = ['pxi-ppu', 'hackathon-stage', 'rooftop', 'talk-ppu', 'ppu-president', 'esn-flags', 'qaddumi-seated', 'galati-xmas', 'birzeit-team', 'snow', 'wla-badge', 'fikra-group', 'pxi-erasmus', 'pxi-night', 'galati-group', 'bran-group', 'hedge', 'autumn']
export default function Moments() {
  const { t } = useSite()
  const dlg = useRef(null)
  const [cur, setCur] = useState(null)
  const open = k => { setCur(k); dlg.current?.showModal() }
  return (
    <section id="moments" className="moments">
      <div className="wrap">
        <div className="sec-intro"><h2>{t.moments.title}</h2><p>{t.moments.intro}</p></div>
        <div className="masonry">
          {ORDER.filter(k => t.moments.items[k]).map(k => (
            <button key={k} className="shot" onClick={() => open(k)}>
              <img src={photo(k)} alt={t.moments.items[k]} loading="lazy" />
              <span>{t.moments.items[k]}</span>
            </button>
          ))}
        </div>
      </div>
      <dialog ref={dlg} className="lightbox" onClick={e => e.target === dlg.current && dlg.current.close()}>
        {cur && <figure><img src={photo(cur)} alt="" /><figcaption>{t.moments.items[cur]}</figcaption></figure>}
        <form method="dialog"><button className="pill">{t.moments.close}</button></form>
      </dialog>
    </section>
  )
}
