import { useSite } from '../lib/ctx.js'
export default function Nav() {
  const { t, toggleLang, toggleTheme, lang } = useSite()
  return (
    <header className="nav wrap">
      <a className="me" href="#top"><span className="dot" aria-hidden="true" />{t.hero.name}</a>
      <ul>
        <li className="hide"><a href="#thread">{t.nav.thread}</a></li>
        <li className="hide"><a href="#work">{t.nav.work}</a></li>
        <li className="hide"><a href="#moments">{t.nav.moments}</a></li>
        <li><button className="pill lang" onClick={toggleLang} lang={lang === 'en' ? 'ar' : 'en'}>{t.nav.lang}</button></li>
        <li><button className="pill round" onClick={toggleTheme} aria-label={t.nav.theme}>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9" /><path d="M12 3a9 9 0 0 0 0 18z" fill="currentColor" /></svg>
        </button></li>
      </ul>
    </header>
  )
}
