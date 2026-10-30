import { useEffect, useRef, useState } from 'react'
import { getMe, linkGoogle } from '../../api/auth.js'
import { getApiErrorToast } from '../../api/client.js'
import { CheckIcon, GoogleIcon, TelegramIcon } from '../../components/icons.jsx'
import Toast from '../../components/Toast.jsx'
import { useI18n } from '../../i18n/context.js'
import {
  GOOGLE_BUTTON_HEIGHT,
  GOOGLE_BUTTON_WIDTH,
  renderGoogleButton,
} from '../../utils/googleAuth.js'

export default function LinkedAccounts({ user, onUserUpdated }) {
  const { t, lang } = useI18n()
  const [googleBusy, setGoogleBusy] = useState(false)
  const [googleReady, setGoogleReady] = useState(false)
  const [toast, setToast] = useState(null) // { type, title, message }

  const googleRef = useRef(null)
  const googleSlot = useRef(null)

  const isTelegramLinked = Boolean(user?.is_phone_verified && user?.phone_number)
  const isGoogleLinked = Boolean(user?.is_email_verified && user?.email)

  // Google tugmasini sozlash
  useEffect(() => {
    if (isGoogleLinked) return
    const wrap = googleRef.current
    const slot = googleSlot.current
    if (!wrap || !slot) return

    let cleanup = null
    let cancelled = false

    const fit = () => {
      slot.style.setProperty('--sx', wrap.offsetWidth / GOOGLE_BUTTON_WIDTH)
      slot.style.setProperty('--sy', wrap.offsetHeight / GOOGLE_BUTTON_HEIGHT)
    }
    const observer = new ResizeObserver(fit)
    observer.observe(wrap)
    fit()

    renderGoogleButton(slot, {
      locale: lang,
      onCredential: async (credential) => {
        setGoogleBusy(true)
        try {
          const res = await linkGoogle(credential)
          const updatedUser = res?.user ?? (await getMe())
          onUserUpdated?.(updatedUser)
          setToast({
            type: 'success',
            title: t('link.googleSuccess'),
          })
        } catch (err) {
          const { title, message } = getApiErrorToast(err, {
            defaultTitle: t('common.errorTitle'),
            defaultMessage: t('common.errorText'),
          })
          setToast({
            type: 'error',
            title,
            message,
          })
        } finally {
          setGoogleBusy(false)
        }
      },
    })
      .then((dispose) => {
        if (cancelled) dispose()
        else {
          cleanup = dispose
          setGoogleReady(true)
        }
      })
      .catch(() => setGoogleReady(false))

    return () => {
      cancelled = true
      observer.disconnect()
      cleanup?.()
    }
  }, [isGoogleLinked, lang])

  // Telegram ulanganidan so'ng qaytganda muvaffaqiyat toastini chiqarish
  useEffect(() => {
    const hash = window.location.hash
    let showTelegramToast = false
    if (hash.includes('linked=telegram')) {
      showTelegramToast = true
      const clean = hash.replace(/[?&]linked=telegram(&|$)/, '').replace(/\?$/, '')
      history.replaceState(history.state, '', clean || '#/profile')
    }

    try {
      const raw = sessionStorage.getItem('authly.pendingToast')
      if (raw) {
        sessionStorage.removeItem('authly.pendingToast')
        const data = JSON.parse(raw)
        setToast(data)
        return
      }
    } catch {}

    if (showTelegramToast) {
      setToast({
        type: 'success',
        title: t('link.telegramSuccess'),
      })
    }
  }, [t])

  const telegramDetail = isTelegramLinked ? user.phone_number : t('link.telegramHint')
  const googleDetail = isGoogleLinked ? user.email : t('link.googleHint')

  return (
    <div className="linked-accounts">
      <div className="linked-accounts__header">
        <h3 className="linked-accounts__title">{t('link.title')}</h3>
        <p className="linked-accounts__subtitle">{t('link.subtitle')}</p>
      </div>

      <div className="linked-accounts__list">
        {/* Telegram Account Card */}
        <div className={`linked-card ${isTelegramLinked ? 'is-linked' : ''}`}>
          <div className="linked-card__row">
            <div className="linked-card__info">
              <span className="linked-card__icon linked-card__icon--telegram">
                <TelegramIcon width="22" height="22" />
              </span>
              <div className="linked-card__text" title={telegramDetail}>
                <span className="linked-card__name">{t('link.telegram')}</span>
                <span className="linked-card__detail" title={telegramDetail}>
                  {telegramDetail}
                </span>
              </div>
            </div>

            {isTelegramLinked ? (
              <span className="linked-badge">
                <CheckIcon width="14" height="14" />
                {t('link.linked')}
              </span>
            ) : (
              <button
                type="button"
                className="btn-link-action btn-link-action--telegram"
                onClick={() => {
                  window.location.hash = '#/link-telegram'
                }}
              >
                <TelegramIcon width="16" height="16" />
                {t('link.connect')}
              </button>
            )}
          </div>
        </div>

        {/* Google Account Card */}
        <div className={`linked-card ${isGoogleLinked ? 'is-linked' : ''}`}>
          <div className="linked-card__row">
            <div className="linked-card__info">
              <span className="linked-card__icon">
                <GoogleIcon width="20" height="20" />
              </span>
              <div className="linked-card__text" title={googleDetail}>
                <span className="linked-card__name">{t('link.google')}</span>
                <span className="linked-card__detail" title={googleDetail}>
                  {googleDetail}
                </span>
              </div>
            </div>

            {isGoogleLinked ? (
              <span className="linked-badge">
                <CheckIcon width="14" height="14" />
                {t('link.linked')}
              </span>
            ) : (
              <div
                className={googleBusy ? 'google-auth is-busy' : 'google-auth'}
                ref={googleRef}
                style={{ borderRadius: '12px' }}
              >
                <button
                  type="button"
                  className="btn-link-action"
                  disabled={googleBusy}
                  tabIndex={googleReady ? -1 : undefined}
                >
                  <GoogleIcon width="16" height="16" />
                  {t('link.connect')}
                </button>
                <div className="google-auth__slot" ref={googleSlot} />
              </div>
            )}
          </div>
        </div>
      </div>

      {toast && (
        <Toast
          type={toast.type || 'error'}
          title={toast.title}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  )
}
