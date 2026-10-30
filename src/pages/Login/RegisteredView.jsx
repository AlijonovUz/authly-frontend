import { useEffect, useEffectEvent, useRef, useState } from 'react'
import { logout } from '../../api/auth.js'
import { returnToSource } from '../../api/sso.js'
import { ArrowLeftIcon, ArrowRightIcon, CheckIcon, LogOutIcon } from '../../components/icons.jsx'
import { useI18n } from '../../i18n/context.js'
import { getSourceSite } from '../../utils/sourceSite.js'

// Shuncha soniyadan so'ng foydalanuvchi kelgan saytiga o'zi qaytariladi
const REDIRECT_SECONDS = 5

// "Raqamli muloqot" → "RM"
const initials = (name) =>
  name
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? '')
    .join('')

// Ro'yxatdan o'tish yakunlangach chiqadigan xabar. Kelgan sayt aniqlansa — unga qaytish tugmasi
// va avtomatik yo'naltirish, aniqlanmasa — profilga qaytish va chiqish tugmalari.
// updated: mavjud profil tahrirlangan bo'lsa "ro'yxatdan o'tdingiz" o'rniga "saqlandi" deyiladi.
function RegisteredView({ updated = false, onBack, onLogout }) {
  const { t, lang } = useI18n()
  const [source] = useState(getSourceSite)
  const [seconds, setSeconds] = useState(REDIRECT_SECONDS)
  const [loggingOut, setLoggingOut] = useState(false)
  const leaving = useRef(false)

  // SSO bo'lsa avval backend'dan ruxsat olinadi. Xato bo'lsa sanoq to'xtaydi — tugma qoladi
  const goBack = async () => {
    if (leaving.current) return
    leaving.current = true
    try {
      await returnToSource(source)
    } catch {
      leaving.current = false
      setSeconds(null)
    }
  }

  const handleBackClick = (e) => {
    e.preventDefault()
    goBack()
  }

  const handleLogout = async () => {
    if (onLogout) {
      onLogout()
      return
    }
    if (loggingOut) return
    setLoggingOut(true)
    try {
      await logout()
    } catch {
      // Backend javob bermasa ham baribir chiqamiz
    }
    window.location.hash = '#/'
  }

  const onCountdownEnd = useEffectEvent(goBack)

  useEffect(() => {
    if (!source || seconds == null) return
    const timer = setTimeout(() => {
      if (seconds <= 1) onCountdownEnd()
      else setSeconds(seconds - 1)
    }, 1000)
    return () => clearTimeout(timer)
  }, [source, seconds])

  const name = source?.service?.title[lang] ?? source?.host

  return (
    <div className="form registered">
      <span className="registered__icon" aria-hidden="true">
        <CheckIcon width="32" height="32" />
      </span>

      <div className="form__heading" role="status">
        <h2 className="form__title">{t(updated ? 'saved.title' : 'registered.title')}</h2>
        <p className="form__subtitle registered__text">{t(updated ? 'saved.text' : 'registered.text')}</p>
      </div>

      {source ? (
        <>
          <div className="registered__source">
            <span className="registered__badge" aria-hidden="true">
              {initials(name)}
            </span>
            <div className="registered__source-text">
              <p className="registered__label">{t('registered.source')}</p>
              <p className="registered__name">{name}</p>
              <a className="registered__link" href={source.url} onClick={handleBackClick}>
                {source.host}
              </a>
            </div>
          </div>

          <a
            className="btn-primary btn-primary--lg registered__back"
            href={source.url}
            onClick={handleBackClick}
          >
            {t('registered.back', { name })}
            <ArrowRightIcon />
          </a>

          {seconds != null && (
            <p className="registered__hint">{t('registered.redirect', { n: seconds })}</p>
          )}

          {onBack && (
            <button
              type="button"
              className="registered__link"
              style={{ background: 'none', border: 'none', cursor: 'pointer', margin: '0 auto', padding: 0 }}
              onClick={onBack}
            >
              {t('registered.editProfile')}
            </button>
          )}
        </>
      ) : (
        <div className="profile__actions">
          {onBack && (
            <button
              type="button"
              className="btn-primary btn-primary--lg registered__back"
              onClick={onBack}
            >
              <ArrowLeftIcon />
              {t('registered.toProfile')}
            </button>
          )}
          <button
            type="button"
            className="btn-logout"
            onClick={handleLogout}
            disabled={loggingOut}
          >
            <LogOutIcon width="18" height="18" />
            {t('profile.logout')}
          </button>
        </div>
      )}
    </div>
  )
}

export default RegisteredView
