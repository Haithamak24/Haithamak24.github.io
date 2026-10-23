// Cross-stitch drawing engine. Every pattern on the site is built from one function: stitch().
export const cssVar = n => getComputedStyle(document.documentElement).getPropertyValue(n).trim()
export function rng(seed) { return () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646 } }

export function stitch(ctx, x, y, c, col, r) {
  const p = c * 0.16, j = () => (r() - 0.5) * c * 0.08
  ctx.strokeStyle = col; ctx.lineWidth = Math.max(1.4, c * 0.26); ctx.lineCap = 'round'
  ctx.beginPath(); ctx.moveTo(x + p + j(), y + p + j()); ctx.lineTo(x + c - p + j(), y + c - p + j()); ctx.stroke()
  ctx.beginPath(); ctx.moveTo(x + c - p + j(), y + p + j()); ctx.lineTo(x + p + j(), y + c - p + j()); ctx.stroke()
}

// An eight-pointed tatreez star, built ring by ring, sorted from the centre outwards so it "grows" when animated.
export function starCells() {
  const N = 27, C = 13, cells = []
  const inside = (dx, dy, k) => Math.max(Math.abs(dx), Math.abs(dy)) <= Math.round(k * 0.66) || Math.abs(dx) + Math.abs(dy) <= k
  const rings = [[13, 'g'], [11, 'i'], [9, 'g'], [7, 'o'], [5, 'g'], [3, 'i'], [1, 'g'], [0, 'g']]
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
    const dx = x - C, dy = y - C
    for (const [k, col] of rings) {
      if (inside(dx, dy, k) && (k === 0 || !inside(dx, dy, k - 1))) { cells.push([x, y, col, Math.abs(dx) + Math.abs(dy)]); break }
    }
    if (Math.abs(dx) === Math.abs(dy) && Math.abs(dx) >= 2 && Math.abs(dx) <= 4) cells.push([x, y, 'o', Math.abs(dx) * 2])
  }
  cells.sort((a, b) => a[3] - b[3])
  return { N, cells }
}

export const colorFor = k => cssVar(k === 'g' ? '--thread' : k === 'i' ? '--indigo' : '--ink')

export function sizeCanvas(cv) {
  const dpr = window.devicePixelRatio || 1, w = cv.clientWidth, h = cv.clientHeight
  cv.width = w * dpr; cv.height = h * dpr
  const ctx = cv.getContext('2d'); ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, w, h)
  return { ctx, w, h }
}

// Section dividers. 'a' = a keffiyeh band (bold lines, olive-leaf chain, fishnet). 'b' = a mosaic strip of tesserae.
export function drawBand(cv, variant = 'a') {
  if (variant === 'b') return drawMosaic(cv)
  const S = sizeCanvas(cv), rows = 10, c = S.h / rows, cols = Math.floor(S.w / c), r = rng(3)
  const ox = (S.w - cols * c) / 2
  for (let x = 0; x < cols; x++) {
    const m = x % 4, col = cssVar('--ink')
    const put = y => stitch(S.ctx, ox + x * c, y * c, c, col, r)
    put(0); put(4); put(9)
    if (m === 0) put(2)
    if (m === 1) { put(1); put(2) }
    if (m === 2) { put(2); put(3) }
    for (let y = 5; y <= 8; y++) if ((x + y) % 4 === 0 || (x - y + 400) % 4 === 0) put(y)
  }
}

// Mosaic, after the floors of Hisham's Palace: square tesserae with small trees of life.
export function drawMosaic(cv, tree = 9) {
  const S = sizeCanvas(cv), rows = 5, c = S.h / rows, cols = Math.floor(S.w / c), r = rng(11)
  const ox = (S.w - cols * c) / 2, g = Math.max(1, c * 0.14)
  const base = ['--line', '--line', '--line', '--muted']
  for (let x = 0; x < cols; x++) for (let y = 0; y < rows; y++) {
    const m = x % tree
    let tok
    if (m === 4 && y >= 3) tok = '--bark'
    else if ((m === 4 && y <= 2) || ((m === 3 || m === 5) && y === 1)) tok = '--olive'
    else if ((m === 3 || m === 5) && y === 2) tok = r() < 0.5 ? '--thread' : '--glass'
    else tok = r() < 0.08 ? (r() < 0.5 ? '--glass' : '--indigo') : base[Math.floor(r() * base.length)]
    S.ctx.save()
    S.ctx.translate(ox + x * c + c / 2, y * c + c / 2)
    S.ctx.rotate((r() - 0.5) * 0.12)
    S.ctx.fillStyle = cssVar(tok)
    S.ctx.globalAlpha = tok === '--line' || tok === '--muted' ? 0.9 : 1
    S.ctx.fillRect(-c / 2 + g / 2, -c / 2 + g / 2, c - g, c - g)
    S.ctx.restore()
  }
}
