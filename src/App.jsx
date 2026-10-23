import { useEffect, useMemo, useState } from 'react'
import { Ctx, store } from './lib/ctx.js'
import { T } from './content.js'
import Nav from './components/Nav.jsx'
import Hero from './components/Hero.jsx'
import Thread from './components/Thread.jsx'
import Far from './components/Far.jsx'
import Work from './components/Work.jsx'
import Moments from './components/Moments.jsx'
import Honors from './components/Honors.jsx'
import Contact from './components/Contact.jsx'
import Woven from './components/Woven.jsx'
import { StitchBand } from './components/Stitch.jsx'

const sysDark = () => typeof matchMedia !== 'undefined' && matchMedia('(prefers-color-scheme: dark)').matches

export default function App() {
  const [lang, setLang] = useState(() => (store.get('lang') === 'ar' ? 'ar' : 'en'))
  const [theme, setThemeState] = useState(() => {
    const t = store.get('theme') || (sysDark() ? 'dark' : 'light')
    document.documentElement.setAttribute('data-theme', t)
    return t
  })
  // Apply the attribute BEFORE React re-renders, so the stitched canvases read the new theme's colours.
  const setTheme = t => { document.documentElement.setAttribute('data-theme', t); setThemeState(t) }

  useEffect(() => {
    const el = document.documentElement
    el.lang = lang; el.dir = lang === 'ar' ? 'rtl' : 'ltr'
    document.title = lang === 'ar' ? 'هيثم ابو خالد' : 'Haitham Abu Khaled'
    store.set('lang', lang)
  }, [lang])
  useEffect(() => {
    const mq = matchMedia('(prefers-color-scheme: dark)')
    const on = e => { if (!store.get('theme')) setTheme(e.matches ? 'dark' : 'light') }
    mq.addEventListener('change', on); return () => mq.removeEventListener('change', on)
  }, [])

  const value = useMemo(() => ({
    lang, theme, t: T[lang],
    toggleLang: () => setLang(l => (l === 'en' ? 'ar' : 'en')),
    toggleTheme: () => { const n = theme === 'dark' ? 'light' : 'dark'; setTheme(n); store.set('theme', n) },
  }), [lang, theme])

  return (
    <Ctx.Provider value={value}>
      <Nav />
      <main id="top">
        <Hero />
        <Thread />
        <Far />
        <div className="wrap"><StitchBand variant="a" /></div>
        <Work />
        <Moments />
        <Honors />
        <Woven />
        <div className="wrap"><StitchBand variant="b" /></div>
        <Contact />
      </main>
      <footer className="foot"><div className="wrap"><span>{value.t.hero.name}</span><span>{value.t.foot.made}</span></div></footer>
    </Ctx.Provider>
  )
}
