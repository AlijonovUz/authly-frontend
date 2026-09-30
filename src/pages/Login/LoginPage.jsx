import { useCallback, useEffect, useState } from 'react'
import CodeLoginForm from './CodeLoginForm.jsx'
import { Brand, FeaturesHero, ServicesHero } from './Hero.jsx'
import LanguageSelect from './LanguageSelect.jsx'
import PasswordLoginForm from './PasswordLoginForm.jsx'
import PhoneLoginForm from './PhoneLoginForm.jsx'
import ProfileForm from './ProfileForm.jsx'
import './LoginPage.css'

// Router ulanmaguncha hash orqali: "#/profile", "#/phone", "#/password"; qolgani — kod kiritish
const ROUTES = ['code', 'profile', 'phone', 'password']
const getRoute = () => {
  const route = window.location.hash.replace(/^#\//, '')
  return ROUTES.includes(route) ? route : 'code'
}

function LoginPage() {
  const [route, setRoute] = useState(getRoute)

  useEffect(() => {
    const onHashChange = () => setRoute(getRoute())
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  const goToProfile = useCallback(() => {
    window.location.hash = '#/profile'
  }, [])

  const forms = {
    code: <CodeLoginForm onVerified={goToProfile} />,
    profile: <ProfileForm />,
    phone: <PhoneLoginForm />,
    password: <PasswordLoginForm />,
  }

  return (
    <main className="login">
      {route === 'profile' ? <ServicesHero /> : <FeaturesHero />}

      <section className="login__panel">
        <header className="panel__top">
          <Brand />
          <LanguageSelect />
        </header>

        {forms[route]}

        <p className="panel__footer">© 2026 Passport. Barcha huquqlar himoyalangan.</p>
      </section>
    </main>
  )
}

export default LoginPage
