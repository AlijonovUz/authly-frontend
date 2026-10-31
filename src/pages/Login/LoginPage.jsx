import { useEffect, useState } from 'react'
import { isLoggedIn } from '../../api/auth.js'
import CodeLoginForm from './CodeLoginForm.jsx'
import LinkTelegramForm from './LinkTelegramForm.jsx'
import { Brand, FeaturesHero, ServicesHero } from './Hero.jsx'
import { usePublicApplications } from '../../api/sso.js'
import LanguageSelect from './LanguageSelect.jsx'
// Keyinchalik aktivlashtirish uchun zaxira komponentlar:
// import PasswordLoginForm from './PasswordLoginForm.jsx'
// import PhoneLoginForm from './PhoneLoginForm.jsx'
import ProfileForm from './ProfileForm.jsx'
import RegisteredView from './RegisteredView.jsx'
import { continueAfterLogin } from './session.js'
import { getSourceSite } from '../../utils/sourceSite.js'
import { useI18n } from '../../i18n/context.js'
import './LoginPage.css'

// Faol marshrutlar: 'code' (asosiy kirish), 'profile' (profil) va 'link-telegram' (Telegram hisobini ulash).
// 'phone' va 'password' formalari keyinchalik kerak bo'lganda faollashtiriladi.
const ROUTES = ['code', 'profile', 'link-telegram']
const getRoute = () => {
  const route = window.location.hash.replace(/^#\/?/, '').split('?')[0]
  return ROUTES.includes(route) ? route : 'code'
}

function LoginPage() {
  const [route, setRoute] = useState(getRoute)
  const { t } = useI18n()
  const apps = usePublicApplications()

  useEffect(() => {
    const onHashChange = () => setRoute(getRoute())
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  // Token bor — login formasi o'rniga profil/bog'lash; token yo'q — faqat login.
  // Boshqa saytdan (SSO) kelgan bo'lsa, profil to'liq bo'lganda o'sha saytga qaytariladi.
  const loggedIn = isLoggedIn()
  const source = getSourceSite()
  const redirecting = loggedIn ? route === 'code' : route !== 'code'
  useEffect(() => {
    if (!redirecting) return
    if (!loggedIn) window.location.hash = '#/'
    else if (!source) window.location.hash = '#/profile'
  }, [redirecting, loggedIn, source])

  const forms = {
    code: <CodeLoginForm onVerified={continueAfterLogin} />,
    profile: <ProfileForm />,
    'link-telegram': (
      <LinkTelegramForm onLinked={() => (window.location.hash = '#/profile?linked=telegram')} />
    ),
    // phone: <PhoneLoginForm />,
    // password: <PasswordLoginForm onLoggedIn={continueAfterLogin} />,
  }

  const hasApps = Array.isArray(apps) && apps.length > 0
  const showServices = route === 'profile' && hasApps

  return (
    <main className="login">
      {showServices ? <ServicesHero apps={apps} /> : <FeaturesHero />}

      <section className={`login__panel login__panel--${route}`}>
        <header className="panel__top">
          <Brand />
          <LanguageSelect />
        </header>

        {redirecting ? (
          loggedIn && source ? (
            <RegisteredView
              updated={true}
              onBack={() => {
                window.location.hash = '#/profile'
              }}
            />
          ) : null
        ) : (
          forms[route]
        )}

        <p className="panel__footer">{t('footer.rights')}</p>
      </section>
    </main>
  )
}

export default LoginPage
