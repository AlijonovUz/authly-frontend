import { useEffect, useState } from 'react'
import { Logo } from '../../components/icons.jsx'
import LanguageSelect from './LanguageSelect.jsx'
import PasswordLoginForm from './PasswordLoginForm.jsx'
import PhoneLoginForm from './PhoneLoginForm.jsx'
import './LoginPage.css'

const FEATURES = [
  { title: 'Xavfsiz', text: 'Maʼlumotlaringiz shifrlangan holda saqlanadi.' },
  { title: 'Tezkor', text: 'Bir marta roʻyxatdan oʻting, barcha xizmatlarga kiring.' },
  { title: 'Ishonchli', text: 'Telegram bot yoki email orqali xavfsiz tasdiqlash.' },
]

// Router ulanmaguncha: "#/password" — login/parol formasi, qolgani — telefon formasi
const getMode = () => (window.location.hash === '#/password' ? 'password' : 'phone')

function Brand() {
  return (
    <div className="brand">
      <Logo className="brand__logo" />
      <span className="brand__name">Raqamli Nazorat</span>
    </div>
  )
}

function LoginPage() {
  const [mode, setMode] = useState(getMode)

  useEffect(() => {
    const onHashChange = () => setMode(getMode())
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  return (
    <main className="login">
      <section className="login__hero">
        <Brand />

        <div className="hero__intro">
          <h1 className="hero__title">Passport tizimiga xush kelibsiz</h1>
          <p className="hero__subtitle">
            Yagona raqamli profilingiz orqali barcha xizmatlardan xavfsiz va tez foydalaning.
          </p>
        </div>

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

      <section className="login__panel">
        <header className="panel__top">
          <Brand />
          <LanguageSelect />
        </header>

        {mode === 'password' ? <PasswordLoginForm /> : <PhoneLoginForm />}

        <p className="panel__footer">© 2026 Passport. Barcha huquqlar himoyalangan.</p>
      </section>
    </main>
  )
}

export default LoginPage
