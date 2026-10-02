import { useEffect, useState } from 'react'
import { isLoggedIn } from '../../api/auth.js'
import CodeLoginForm from './CodeLoginForm.jsx'
import { Brand, FeaturesHero, ServicesHero } from './Hero.jsx'
import LanguageSelect from './LanguageSelect.jsx'
import PasswordLoginForm from './PasswordLoginForm.jsx'
import PhoneLoginForm from './PhoneLoginForm.jsx'
import ProfileForm from './ProfileForm.jsx'
import { continueAfterLogin } from './session.js'
import { getSourceSite } from '../../utils/sourceSite.js'
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
  const { t } = useI18n()

  useEffect(() => {
    const onHashChange = () => setRoute(getRoute())
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  // Token bor — login formalari o'rniga profil; token yo'q — profil o'rniga login.
  // Boshqa saytdan (SSO) kelgan bo'lsa, profil to'liq bo'lganda o'sha saytga qaytariladi.
  const loggedIn = isLoggedIn()
  const redirecting = loggedIn !== (route === 'profile')
  useEffect(() => {
    if (!redirecting) return
    if (!loggedIn) window.location.hash = '#/'
    else if (getSourceSite()) continueAfterLogin()
    else window.location.hash = '#/profile'
  }, [redirecting, loggedIn])

  const forms = {
    code: <CodeLoginForm onVerified={continueAfterLogin} />,
    profile: <ProfileForm />,
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

        {redirecting ? null : forms[route]}

        <p className="panel__footer">{t('footer.rights')}</p>
      </section>
    </main>
  )
}

export default LoginPage
