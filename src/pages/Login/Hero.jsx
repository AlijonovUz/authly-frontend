import { ArrowUpRightIcon } from '../../components/icons.jsx'
import { SERVICES } from '../../data/services.js'

const FEATURES = [
  { title: 'Xavfsiz', text: 'Maʼlumotlaringiz shifrlangan holda saqlanadi.' },
  { title: 'Tezkor', text: 'Bir marta roʻyxatdan oʻting, barcha xizmatlarga kiring.' },
  { title: 'Ishonchli', text: 'Telegram bot yoki email orqali xavfsiz tasdiqlash.' },
]

export function Brand() {
  return (
    <div className="brand">
      <img className="brand__logo" src="/logo.svg" alt="Raqamli Nazorat" width="210" height="44" />
    </div>
  )
}

function Intro() {
  return (
    <div className="hero__intro">
      <h1 className="hero__title">Passport tizimiga xush kelibsiz</h1>
      <p className="hero__subtitle">
        Yagona raqamli profilingiz orqali barcha xizmatlardan xavfsiz va tez foydalaning.
      </p>
    </div>
  )
}

// Kirish sahifasi: logo, sarlavha va 3 ta afzallik kartasi
export function FeaturesHero() {
  return (
    <section className="login__hero">
      <Brand />
      <Intro />
      <ul className="features">
        {FEATURES.map((f, i) => (
          <li key={f.title} className={i === 0 ? 'feature is-active' : 'feature'}>
            <span className="feature__num">{i + 1}</span>
            <h3 className="feature__title">{f.title}</h3>
            <p className="feature__text">{f.text}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}

// Profil sahifasi: sarlavha va aylantiriladigan xizmatlar ro'yxati
export function ServicesHero() {
  return (
    <section className="login__hero login__hero--services">
      <Intro />
      <ul className="services">
        {SERVICES.map((s, i) => (
          <li key={i}>
            <a className="service" href={`https://${s.url}`} target="_blank" rel="noreferrer">
              <h3 className="service__title">{s.title}</h3>
              <p className="service__text">{s.text}</p>
              <span className="service__footer">
                <span className="service__link">{s.url}</span>
                <span className="service__arrow" aria-hidden="true">
                  <ArrowUpRightIcon />
                </span>
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}
