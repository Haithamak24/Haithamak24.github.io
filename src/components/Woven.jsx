import { useSite } from '../lib/ctx.js'
import { Motif, MosaicSwatch } from './Stitch.jsx'
const ICONS = { star: <Motif name="star" />, keffiyeh: <Motif name="keffiyeh" />, olive: <Motif name="olive" />, anemone: <Motif name="anemone" />, sunbird: <Motif name="sunbird" />, glass: <Motif name="glass" />, mosaic: <MosaicSwatch /> }
export default function Woven() {
  const { t } = useSite()
  const w = t.woven
  return (
    <section className="woven" id="woven">
      <div className="wrap">
        <div className="sec-intro"><h2>{w.title}</h2><p>{w.intro}</p></div>
        <ul className="legend">{w.items.map(([k, name, line]) => (
          <li key={k}><div className="icon">{ICONS[k]}</div><div><b>{name}</b><span>{line}</span></div></li>
        ))}</ul>
      </div>
    </section>
  )
}
