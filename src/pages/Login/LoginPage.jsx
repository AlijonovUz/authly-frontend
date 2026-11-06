import { useEffect, useState } from 'react'
import { isLoggedIn } from '../../api/auth.js'
import CodeLoginForm from './CodeLoginForm.jsx'
import LinkTelegramForm from './LinkTelegramForm.jsx'
import { Brand, FeaturesHero, ServicesHero } from './Hero.jsx'
import { usePublicApplications } from '../../api/sso.js'
import LanguageSelect from './LanguageSelect.jsx'
import ProfileForm from './ProfileForm.jsx'
import DeveloperConsole from '../Developer/DeveloperConsole.jsx'
import RedirectingView from './RedirectingView.jsx'
import RegisteredView from './RegisteredView.jsx'
import { continueAfterLogin } from './session.js'
import { getSourceSite } from '../../utils/sourceSite.js'
import { useI18n } from '../../i18n/context.js'
import './LoginPage.css'

const ROUTES = ['code', 'profile', 'developer', 'link-telegram']
const getRoute = () => {
  const route = window.location.hash.replace(/^#\/?/, '').split('?')[0]
  return ROUTES.includes(route) ? route : 'code'
}

function LoginPage() {
  const [route, setRoute] = useState(getRoute)
  const [ssoFailed, setSsoFailed] = useState(false)
  const { t } = useI18n()
  const apps = usePublicApplications(route !== 'developer')

  useEffect(() => {
    const onHashChange = () => setRoute(getRoute())
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  const loggedIn = isLoggedIn()
  const source = getSourceSite()
  const redirecting = loggedIn ? route === 'code' : route !== 'code'

  useEffect(() => {
    if (!redirecting) return
    if (!loggedIn) {
      window.location.hash = '#/'
    } else if (!source) {
      window.location.hash = '#/profile'
    } else {
      continueAfterLogin().catch(() => setSsoFailed(true))
    }
  }, [redirecting, loggedIn, source])

  const renderForm = () => {
    switch (route) {
      case 'code':
        return <CodeLoginForm onVerified={continueAfterLogin} />
      case 'profile':
        return <ProfileForm />
      case 'developer':
        return (
          <DeveloperConsole
            onBackToProfile={() => {
              window.location.hash = '#/profile'
            }}
          />
        )
      case 'link-telegram':
        return (
          <LinkTelegramForm onLinked={() => (window.location.hash = '#/profile?linked=telegram')} />
        )
      default:
        return <CodeLoginForm onVerified={continueAfterLogin} />
    }
  }

  const hasApps = Array.isArray(apps) && apps.length > 0
  const showServices = (route === 'profile' || route === 'developer') && hasApps

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
            ssoFailed ? (
              <RegisteredView
                updated={false}
                onBack={() => {
                  window.location.hash = '#/profile'
                }}
              />
            ) : (
              <RedirectingView />
            )
          ) : null
        ) : (
          renderForm()
        )}

        <p className="panel__footer">{t('footer.rights')}</p>
      </section>
    </main>
  )
}

export default LoginPage
