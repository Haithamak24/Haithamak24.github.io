import { useEffect, useRef, useState } from 'react'
import { useSite, reduceMotion } from '../lib/ctx.js'

// [kind, text]  kind: y = passes, q = needs a check
const EX = {
  en: [
    { input: { ar: 'أبو محمد أخذ ٣ كيلو سكر، سجّل عليه ١٥ شيكل', sub: 'A voice note from a shopkeeper' },
      kv: [['intent', 'add_debt'], ['customer', 'أبو محمد'], ['amount', '15'], ['currency', 'ILS']],
      rules: [['y', 'Fits the action schema'], ['y', 'Name and amount parsed'], ['y', 'Never executed automatically']],
      out: ['ok', 'PROPOSED', 'Add ₪15 to \u2068أبو محمد\u2069’s balance', 'Waits for the merchant to tap confirm'], link: '#p-note', note: 'Note to Action, in production at Co.Te.De.' },
    { input: { en: '3rd-year Computer Engineering student. GPA 3.4. Studied in English, no IELTS yet.', sub: 'Typed into a profile form' },
      kv: [['major', 'Computer Eng.'], ['year', '3'], ['gpa', '3.40 / 4'], ['english', 'MOI letter']],
      rules: [['y', 'GPA at least 3.0'], ['y', 'Year 2 or later'], ['q', 'Is a university letter accepted?']],
      out: ['q', 'NEEDS_CONFIRMATION', 'You likely qualify', 'Next: ask if the partner accepts your English letter'], link: '#p-mb', note: 'MobilityBridge, 1st place at Ainak Challenges 2026.' },
    { input: { en: 'Sara: Is this your pen?', ar: 'سارة: هل هذا قلمك؟', sub: 'One dialogue line from a lesson script' },
      kv: [['slide', 'dialogue'], ['speaker', 'Sara'], ['bubble', '1 of 4'], ['pages', 'EN, AR']],
      rules: [['y', 'Use the dialogue template'], ['y', 'Wrap English in isolates'], ['y', 'Avatar: Sara, left side']],
      out: ['ok', 'RENDERED', 'Clip D1-1, two pages', 'English page with audio, then an Arabic reading page'], link: '#p-vb', note: 'Verbivore video pipeline, 495 clips rendered.' },
    { input: { en: "A black backpack, found on the library's second floor.", sub: 'Photo uploaded by whoever found it' },
      kv: [['category', 'bag'], ['colour', 'black'], ['place', 'library, F2'], ['marks', 'keychain']],
      rules: [['y', 'Compared with open lost reports'], ['y', '2 matches above threshold'], ['y', 'Owner must prove it first']],
      out: ['ok', '2 MATCHES', 'Two students reported a backpack like this', 'Each answers an ownership question before pickup'], link: '#p-laq', note: 'Laqeetha, our graduation project, shown at Palestine XI.' },
  ],
  ar: [
    { input: { ar: 'أبو محمد أخذ ٣ كيلو سكر، سجّل عليه ١٥ شيكل', sub: 'رسالة صوتية من صاحب دكان' },
      kv: [['intent', 'add_debt'], ['customer', 'أبو محمد'], ['amount', '15'], ['currency', 'ILS']],
      rules: [['y', 'يطابق مخطط الإجراء'], ['y', 'تم تحليل الاسم والمبلغ'], ['y', 'لا يُنفَّذ تلقائيًا أبدًا']],
      out: ['ok', 'PROPOSED', 'إضافة 15 شيكل إلى حساب أبو محمد', 'بانتظار أن يضغط التاجر «تأكيد»'], link: '#p-note', note: 'من الملاحظة إلى الإجراء، يعمل في Co.Te.De.' },
    { input: { ar: 'طالب هندسة حاسوب في السنة الثالثة. المعدل 3.4. درس بالإنجليزية، ولا يملك IELTS بعد.', sub: 'مكتوب في نموذج الملف الشخصي' },
      kv: [['major', 'Computer Eng.'], ['year', '3'], ['gpa', '3.40 / 4'], ['english', 'MOI letter']],
      rules: [['y', 'المعدل 3.0 أو أكثر'], ['y', 'السنة الثانية فأعلى'], ['q', 'هل تُقبل رسالة الجامعة؟']],
      out: ['q', 'NEEDS_CONFIRMATION', 'غالبًا أنت مؤهل', 'الخطوة التالية: اسأل إن كانت الجامعة الشريكة تقبل رسالة اللغة'], link: '#p-mb', note: 'MobilityBridge، المركز الأول في تحديات عينك 2026.' },
    { input: { en: 'Sara: Is this your pen?', ar: 'سارة: هل هذا قلمك؟', sub: 'سطر حوار من نص درس' },
      kv: [['slide', 'dialogue'], ['speaker', 'Sara'], ['bubble', '1 of 4'], ['pages', 'EN, AR']],
      rules: [['y', 'استخدام قالب الحوار'], ['y', 'إحاطة الإنجليزية بعوازل الاتجاه'], ['y', 'الشخصية: سارة، على اليسار']],
      out: ['ok', 'RENDERED', 'المقطع D1-1، صفحتان', 'صفحة إنجليزية مع صوت، ثم صفحة قراءة عربية'], link: '#p-vb', note: 'خط إنتاج Verbivore، 495 مقطعًا مُصيَّرًا.' },
    { input: { ar: 'حقيبة ظهر سوداء، وُجدت في الطابق الثاني من المكتبة.', sub: 'صورة رفعها من وجدها' },
      kv: [['category', 'bag'], ['colour', 'black'], ['place', 'library, F2'], ['marks', 'keychain']],
      rules: [['y', 'قورنت ببلاغات الفقدان المفتوحة'], ['y', 'تطابقان فوق العتبة'], ['y', 'على المالك إثبات ملكيته أولًا']],
      out: ['ok', '2 MATCHES', 'طالبان أبلغا عن حقيبة كهذه', 'كلٌّ منهما يجيب عن سؤال ملكية قبل الاستلام'], link: '#p-laq', note: '«لقيتها»، مشروع تخرّجنا، عُرض في فلسطين الحادي عشر.' },
  ],
}

const icons = [
  <path key="a" d="M4 6h16M4 12h10M4 18h13" />,
  <g key="b"><circle cx="12" cy="12" r="3.2" /><path d="M12 2v4M12 18v4M2 12h4M18 12h4M5 5l2.8 2.8M16.2 16.2 19 19M5 19l2.8-2.8M16.2 7.8 19 5" /></g>,
  <path key="c" d="M12 3v18M5 7h14M7 7l-3 7a3 3 0 0 0 6 0zM17 7l-3 7a3 3 0 0 0 6 0z" />,
  <path key="d" d="M5 12.5l4.5 4.5L19 7.5" />,
]

export default function Machine() {
  const { t, lang } = useSite()
  const [ex, setEx] = useState(0)
  const [lit, setLit] = useState(4)
  const [run, setRun] = useState(0)
  const timers = useRef([])
  const started = useRef(false)
  const box = useRef(null)

  const go = () => {
    timers.current.forEach(clearTimeout); timers.current = []
    if (reduceMotion()) { setLit(4); return }
    setLit(0)
    ;[1, 2, 3, 4].forEach(k => timers.current.push(setTimeout(() => setLit(k), 150 + (k - 1) * 700)))
  }
  useEffect(() => { if (started.current) go() }, [ex, run])
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting && !started.current) { started.current = true; go() } }, { threshold: 0.2 })
    io.observe(box.current)
    return () => { io.disconnect(); timers.current.forEach(clearTimeout) }
  }, [])

  const d = EX[lang][ex]
  const tick = { y: '✓', q: '?' }
  const bodies = [
    <div className="inputtext">{d.input.en && <span lang="en" dir="ltr" className="ltr-block">{d.input.en}</span>}{d.input.ar && <span lang="ar" dir="rtl" className="ar-block">{d.input.ar}</span>}<small>{d.input.sub}</small></div>,
    <div>{d.kv.map(([k, v]) => <div className="kv" key={k}><span dir="ltr">{k}</span><span><bdi>{v}</bdi></span></div>)}</div>,
    <div>{d.rules.map(([k, v]) => <div className="chk" key={v}><b className={k}>{tick[k]}</b><span>{v}</span></div>)}</div>,
    <div><span className={`verdict-tag v-${d.out[0]}`} dir="ltr">{d.out[1]}</span><p className="out-title">{d.out[2]}</p><small>{d.out[3]}</small></div>,
  ]
  const pct = lit <= 1 ? 0 : ((lit - 1) / 3) * 100

  return (
    <div className="machine" ref={box}>
      <div className="picker" role="group" aria-label={t.work.feed}>
        <span className="lbl">{t.work.feed}</span>
        {t.work.picks.map((p, i) => <button key={p} className="pick" aria-pressed={i === ex} onClick={() => setEx(i)}>{p}</button>)}
        <button className="run" onClick={() => setRun(r => r + 1)}><svg viewBox="0 0 12 12" width="11" height="11"><path d="M2 1l9 5-9 5z" fill="currentColor" /></svg>{t.work.run}</button>
      </div>
      <div className="stages">
        <div className="track" aria-hidden="true"><i style={{ width: pct + '%' }} /><span className="packet" style={{ insetInlineStart: pct + '%', opacity: lit > 0 && lit < 4 ? 1 : 0 }} /></div>
        {t.work.stages.map(([h, who], k) => (
          <div key={h} className={`stage ${lit > k ? 'lit' : ''}`}>
            <div className="node"><svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.8">{icons[k]}</svg></div>
            <h4>{h}</h4><p className="who">{who}</p>
            <div className="body">{bodies[k]}</div>
          </div>
        ))}
      </div>
      <div className="machine-foot"><span>{d.note}</span><a href={d.link}>{t.work.see}</a></div>
    </div>
  )
}
