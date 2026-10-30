import { useEffect, useMemo, useRef } from 'react'
import { ArrowUpRightIcon } from '../../components/icons.jsx'
import { useI18n } from '../../i18n/context.js'

const FEATURES = ['secure', 'fast', 'reliable']

// Xizmatlar ro'yxatining o'zi aylanish tezligi (px/soniya)
const SCROLL_SPEED = 30

export function Brand() {
  return (
    <div className="brand">
      <img className="brand__logo" src="/logo.svg" alt="Authly" width="210" height="44" />
    </div>
  )
}

function Intro() {
  const { t } = useI18n()
  return (
    <div className="hero__intro">
      <h1 className="hero__title">{t('hero.title')}</h1>
      <p className="hero__subtitle">{t('hero.subtitle')}</p>
    </div>
  )
}

// Kirish sahifasi: logo, sarlavha va 3 ta afzallik kartasi
export function FeaturesHero() {
  const { t } = useI18n()
  return (
    <section className="login__hero">
      <Brand />
      <Intro />
      <ul className="features">
        {FEATURES.map((key, i) => (
          <li key={key} className={i === 0 ? 'feature is-active' : 'feature'}>
            <span className="feature__num">{i + 1}</span>
            <h3 className="feature__title">{t(`feature.${key}.title`)}</h3>
            <p className="feature__text">{t(`feature.${key}.text`)}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}

// Ro'yxatni sekin yuqoriga aylantiradi. Kartalar ikki marta chizilgani uchun birinchi
// nusxa tugaganda boshiga sakrash sezilmaydi. Sichqoncha ustida yoki fokusda to'xtaydi.
function useAutoScroll(ref) {
  useEffect(() => {
    const el = ref.current
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let paused = false
    let pos = el.scrollTop
    let last = performance.now()
    let frame

    const pause = () => {
      paused = true
    }
    const resume = () => {
      paused = false
    }

    const tick = (now) => {
      const dt = Math.min(now - last, 100)
      last = now
      const items = el.children
      if (!items || items.length < 2) {
        frame = requestAnimationFrame(tick)
        return
      }
      const half = Math.floor(items.length / 2)
      // Bitta nusxaning balandligi (qatorlar orasidagi masofa bilan)
      const period = items[half] ? items[half].offsetTop - items[0].offsetTop : 0
      const from = paused ? el.scrollTop : pos
      pos = paused ? from : from + (SCROLL_SPEED * dt) / 1000
      if (period > 0) {
        if (pos > period) pos -= period
        else if (paused && pos <= 0) pos += period
      }
      // To'xtab turganda foydalanuvchining o'z scroll'iga xalaqit bermaymiz
      if (!paused || pos !== from) el.scrollTop = pos
      frame = requestAnimationFrame(tick)
    }

    el.addEventListener('mouseenter', pause)
    el.addEventListener('mouseleave', resume)
    el.addEventListener('focusin', pause)
    el.addEventListener('focusout', resume)
    frame = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(frame)
      el.removeEventListener('mouseenter', pause)
      el.removeEventListener('mouseleave', resume)
      el.removeEventListener('focusin', pause)
      el.removeEventListener('focusout', resume)
    }
  }, [ref])
}

// "https://meetly.uz/..." → "meetly.uz"
function formatUrl(rawUrl = '') {
  try {
    const url = new URL(rawUrl.startsWith('http') ? rawUrl : `https://${rawUrl}`)
    return url.hostname.replace(/^www\./, '')
  } catch {
    return rawUrl.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0]
  }
}

// Sichqoncha kartaga kirgan/chiqqan nuqta — hover foni shu yerdan yoyiladi (CSS: --x, --y)
function setHoverOrigin(e) {
  const card = e.currentTarget
  const rect = card.getBoundingClientRect()
  card.style.setProperty('--x', `${e.clientX - rect.left}px`)
  card.style.setProperty('--y', `${e.clientY - rect.top}px`)
}

// Profil sahifasi: sarlavha va o'zi aylanadigan xizmatlar ro'yxati
export function ServicesHero({ apps = [] }) {
  const listRef = useRef(null)

  // Faqat backend'dan kelgan real hamkor ilovalari ko'rsatiladi
  const sourceList = useMemo(() => {
    if (Array.isArray(apps) && apps.length > 0) {
      return apps.map((app) => ({
        name: app.name,
        description: app.description || '',
        url: formatUrl(app.url),
        href: app.url ? (app.url.startsWith('http') ? app.url : `https://${app.url}`) : '#',
      }))
    }
    return []
  }, [apps])

  // Karusel bir maromda aylanishi uchun ro'yxatni kamida 12 tagacha to'ldiramiz
  const baseCards = useMemo(() => {
    if (!sourceList.length) return []
    let list = sourceList
    while (list.length < 12) {
      list = [...list, ...sourceList]
    }
    return list
  }, [sourceList])

  // Cheksiz aylanish uchun 2 nusxa (useAutoScroll)
  const cards = useMemo(() => [...baseCards, ...baseCards], [baseCards])

  useAutoScroll(listRef)

  return (
    <section className="login__hero login__hero--services">
      <Intro />
      <ul className="services" ref={listRef}>
        {cards.map((s, i) => {
          const isCopy = i >= baseCards.length
          return (
            <li key={i} style={{ '--i': i }} aria-hidden={isCopy || undefined}>
              <a
                className="service"
                href={s.href}
                target="_blank"
                rel="noreferrer"
                tabIndex={isCopy ? -1 : undefined}
                onMouseEnter={setHoverOrigin}
                onMouseLeave={setHoverOrigin}
              >
                <h3 className="service__title">{s.name}</h3>
                <p className="service__text">{s.description}</p>
                <span className="service__footer">
                  <span className="service__link">{s.url}</span>
                  <span className="service__arrow" aria-hidden="true">
                    <ArrowUpRightIcon />
                  </span>
                </span>
              </a>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
