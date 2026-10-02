import { useEffect, useState } from 'react'
import { isLoggedIn } from '../../api/auth.js'
import CodeLoginForm from './CodeLoginForm.jsx'
import { Brand, FeaturesHero, ServicesHero } from './Hero.jsx'
import LanguageSelect from './LanguageSelect.jsx'
import PasswordLoginForm from './PasswordLoginForm.jsx'
import PhoneLoginForm from './PhoneLoginForm.jsx'
import ProfileForm from './ProfileForm.jsx'
import { continueAfterLogin } from './session.js'
import { useI18n } from '../../i18n/context.js'
import './LoginPage.css'

// Router ulanmaguncha hash orqali: "#/profile", "#/phone", "#/password"; qolgani — kod kiritish.
// Hash ichidagi so'rov qismi ("#/?code=123456") yo'nalishga ta'sir qilmaydi.
const ROUTES = ['code', 'profile', 'phone', 'password']
const getRoute = () => {
  const route = window.location.hash.replace(/^#\/?/, '').split('?')[0]
  return ROUTES.includes(route) ? route : 'code'
}

function LoginPage() {
  const [route, setRoute] = useState(getRoute)
  // Avval kirgan foydalanuvchiga login formasi ko'rsatilmaydi — profilga yoki kelgan saytiga o'tkaziladi
  const [resuming, setResuming] = useState(() => getRoute() !== 'profile' && isLoggedIn())
  const { t } = useI18n()

  useEffect(() => {
    if (!resuming) return
    continueAfterLogin().finally(() => setResuming(false))
  }, [resuming])

  useEffect(() => {
    const onHashChange = () => setRoute(getRoute())
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  // Profil sahifasi faqat kirgan foydalanuvchi uchun
  const blocked = route === 'profile' && !isLoggedIn()
  useEffect(() => {
    if (blocked) window.location.hash = '#/'
  }, [blocked])

  const forms = {
    code: <CodeLoginForm onVerified={continueAfterLogin} />,
    profile: blocked ? null : <ProfileForm />,
    phone: <PhoneLoginForm />,
    password: <PasswordLoginForm onLoggedIn={continueAfterLogin} />,
  }

  return (
    <main className="login">
      {route === 'profile' ? <ServicesHero /> : <FeaturesHero />}

      <section className={`login__panel login__panel--${route}`}>
        <header className="panel__top">
          <Brand />
          <LanguageSelect />
        </header>

        {resuming ? null : forms[route]}

        <p className="panel__footer">{t('footer.rights')}</p>
      </section>
    </main>
  )
}

export default LoginPage
