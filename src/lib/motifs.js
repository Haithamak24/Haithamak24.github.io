// Every Palestinian symbol on the site, expressed in the same language: cross-stitch cells [x, y, colorToken].
import { starCells } from './stitch.js'

const fromRows = (rows, map) => {
  const cells = []
  rows.forEach((row, y) => [...row].forEach((ch, x) => { if (map[ch]) cells.push([x, y, map[ch]]) }))
  return { w: Math.max(...rows.map(r => r.length)), h: rows.length, cells }
}
const byDistance = (m, cx, cy) => { m.cells.sort((a, b) => Math.hypot(a[0] - cx, a[1] - cy) - Math.hypot(b[0] - cx, b[1] - cy)); return m }

// 1. Tatreez star (hero)
function star() {
  const { N, cells } = starCells()
  const tok = { g: '--thread', i: '--indigo', o: '--ink' }
  return { w: N, h: N, cells: cells.map(([x, y, k]) => [x, y, tok[k]]) }
}

// 2. Olive branch: a stem with alternating leaves and two olives (Recognition)
function olive() {
  const c = []
  for (let x = 1; x <= 22; x++) c.push([x, 6, '--bark'])
  const up = sx => [[sx, 5], [sx + 1, 4], [sx + 1, 5], [sx + 2, 3], [sx + 2, 4], [sx + 3, 2], [sx + 3, 3], [sx + 4, 2]]
  const down = sx => up(sx).map(([x, y]) => [x, 12 - y])
  ;[2, 8, 14].forEach(sx => up(sx).forEach(([x, y]) => c.push([x, y, '--olive'])))
  ;[5, 11, 17].forEach(sx => down(sx).forEach(([x, y]) => c.push([x, y, '--olive'])))
  ;[[23, 6], [24, 6], [23, 5], [23, 7]].forEach(([x, y]) => c.push([x, y, '--olive']))
  ;[[8, 8], [8, 9], [16, 8], [16, 9]].forEach(([x, y]) => c.push([x, y, '--stamen']))
  return { w: 26, h: 12, cells: c.sort((a, b) => a[0] - b[0]) }
}

// 3. Red anemone, shaqa'iq al-nu'man (Contact)
function anemone() {
  const c = [], cx = 7, cy = 6
  for (let y = 0; y < 13; y++) for (let x = 0; x < 15; x++) {
    const dx = x - cx, dy = y - cy, r = Math.hypot(dx, dy), th = Math.atan2(dy, dx)
    const R = 3.2 + 2.6 * Math.pow(Math.abs(Math.cos(3 * th)), 0.7)
    if (r <= 1.5) c.push([x, y, '--stamen'])
    else if (r <= 2.3 && (x + y) % 2 === 0) c.push([x, y, '--stamen'])
    else if (r <= R) c.push([x, y, '--thread'])
  }
  for (let y = 12; y <= 16; y++) c.push([7, y, '--olive'])
  ;[[6, 14], [5, 14], [4, 13], [8, 15], [9, 15], [10, 14]].forEach(([x, y]) => c.push([x, y, '--olive']))
  return byDistance({ w: 15, h: 17, cells: c }, cx, cy)
}

// 4. Palestine sunbird (rides the thread)
const sunbird = () => fromRows([
  '......tt.....',
  '.....tttk....',
  '...iiitttkk..',
  'iiiiiiitt..k.',
  '.iiiiiaii....',
  '..iiiiii.....',
  '....ii.......',
], { t: '--glass', i: '--indigo', k: '--ink', a: '--amber' })

// 5. Hebron glass vessel
const glass = () => byDistance(fromRows([
  '...iii...',
  '...t.t...',
  '....t....',
  '...ttt...',
  '..ttttt..',
  '.ttiittt.',
  '.tiitttt.',
  '.ttttitt.',
  '.ttttttt.',
  '..ttttt..',
  '...iii...',
], { t: '--glass', i: '--indigo' }), 4, 6)

// 6. Keffiyeh swatch: bold line, olive-leaf chain, fishnet
function keffiyeh(cols = 16) {
  const c = []
  for (let x = 0; x < cols; x++) {
    c.push([x, 0, '--ink'], [x, 4, '--ink'], [x, 9, '--ink'])
    const m = x % 4
    if (m === 0) c.push([x, 2, '--ink'])
    if (m === 1) c.push([x, 1, '--ink'], [x, 2, '--ink'])
    if (m === 2) c.push([x, 2, '--ink'], [x, 3, '--ink'])
    for (let y = 5; y <= 8; y++) if ((x + y) % 4 === 0 || (x - y + 400) % 4 === 0) c.push([x, y, '--ink'])
  }
  return { w: cols, h: 10, cells: c }
}

export const MOTIFS = { star: star(), olive: olive(), anemone: anemone(), sunbird: sunbird(), glass: glass(), keffiyeh: keffiyeh() }
export { keffiyeh as keffiyehCells }
