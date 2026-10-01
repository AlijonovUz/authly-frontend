import { useCallback, useEffect, useEffectEvent, useRef, useState } from 'react'
import {
  googleLogin,
  login,
  telegramLogin,
  verifyIdentifier,
  verifyRegisterPhone,
} from '../../api/auth.js'
import { GoogleIcon } from '../../components/icons.jsx'
import Toast from '../../components/Toast.jsx'
import { useI18n } from '../../i18n/context.js'
import {
  GOOGLE_BUTTON_HEIGHT,
  GOOGLE_BUTTON_WIDTH,
  renderGoogleButton,
} from '../../utils/googleAuth.js'
import { clearPending, getPending } from './pendingVerification.js'

const LENGTH = 6
const SUCCESS_DELAY = 700

// Kod yuboradigan Telegram bot (.env: VITE_TELEGRAM_BOT, @ belgisisiz)
const BOT = import.meta.env.VITE_TELEGRAM_BOT || 'raqamli_passport_bot'

// Bot yuborgan havola orqali kelgan kod: https://passport.raqamlinazorat.uz/#/?code=123456
// (oddiy "?code=123456" ham qabul qilinadi)
const hashParams = () => new URLSearchParams(window.location.hash.split('?')[1] ?? '')

function readLinkCode() {
  const code = hashParams().get('code') ?? new URLSearchParams(window.location.search).get('code')
  return code?.length === LENGTH && /^\d+$/.test(code) ? code : null
}

// Kod ishlatilgach manzildan olib tashlanadi — sahifa yangilansa qayta yuborilmasin
function clearLinkCode() {
  const url = new URL(window.location.href)
  url.searchParams.delete('code')
  const [path, query = ''] = url.hash.split('?')
  const params = new URLSearchParams(query)
  params.delete('code')
  url.hash = params.size ? `${path}?${params}` : path
  history.replaceState(history.state, '', url)
}

// Kodni tekshiradi. true — foydalanuvchi kirdi (token bor), false — kod to'g'ri, lekin
// backend token bermadi (endi Telegram bot kodi bilan kirish kerak).
async function submitCode(code) {
  const pending = getPending()
  if (!pending) {
    await telegramLogin(code)
    return true
  }
  if (pending.kind === 'login') {
    await verifyIdentifier(pending.identifier, code)
    await login(pending.identifier, pending.password)
    clearPending()
    return true
  }
  // kind === 'phone'
  const loggedIn = await verifyRegisterPhone(pending.identifier, code)
  clearPending()
  return loggedIn
}

// status: idle | checking | success | error
function CodeLoginForm({ onVerified }) {
  const [digits, setDigits] = useState(() => readLinkCode()?.split('') ?? Array(LENGTH).fill(''))
  const [status, setStatus] = useState(() => (readLinkCode() ? 'checking' : 'idle'))
  const [toastOpen, setToastOpen] = useState(false)
  const [toastText, setToastText] = useState(null)
  const [toastTitle, setToastTitle] = useState(null)
  const [googleBusy, setGoogleBusy] = useState(false)
  const [googleReady, setGoogleReady] = useState(false)
  const inputs = useRef([])
  const googleRef = useRef(null)
  const googleSlot = useRef(null)
  const { t, lang } = useI18n()

  const locked = status === 'checking' || status === 'success'
  const closeToast = useCallback(() => setToastOpen(false), [])

  // Muvaffaqiyatli holat (yashil) biroz ko'rinib turadi, so'ng keyingi qadamga o'tiladi
  useEffect(() => {
    if (status !== 'success') return
    const timer = setTimeout(onVerified, SUCCESS_DELAY)
    return () => clearTimeout(timer)
  }, [status, onVerified])

  const focusAt = (index) => {
    const el = inputs.current[Math.max(0, Math.min(LENGTH - 1, index))]
    el?.focus()
    el?.select()
  }

  const verify = async (code) => {
    setStatus('checking')
    try {
      const loggedIn = await submitCode(code)
      setToastOpen(false)
      if (loggedIn) {
        setStatus('success')
      } else {
        // Ro'yxatdan o'tish tasdiqlandi — endi botdan olingan kod bilan kiriladi
        setDigits(Array(LENGTH).fill(''))
        setStatus('idle')
        focusAt(0)
      }
    } catch (err) {
      // Tarmoq yoki server xatosi — "kod noto'g'ri" emas
      setToastTitle(null)
      setToastText(err?.status && err.status < 500 ? null : t('common.errorText'))
      setStatus('error')
      setToastOpen(true)
      focusAt(0)
    }
  }

  // Havola orqali kod kelgan bo'lsa — darhol tekshiramiz, aks holda birinchi katakka fokus
  const onMount = useEffectEvent(() => {
    const code = readLinkCode()
    if (!code) {
      inputs.current[0]?.focus()
      return
    }
    clearLinkCode()
    // Holat allaqachon 'checking' (boshlang'ich qiymat) — so'rov effektdan keyin yuboriladi
    queueMicrotask(() => verify(code))
  })
  useEffect(() => {
    onMount()
  }, [])

  const showGoogleError = (text) => {
    setToastTitle(t('google.errorTitle'))
    setToastText(text ?? t('common.errorText'))
    setToastOpen(true)
  }

  // Google oynasida akkaunt tanlangach olingan id_token backend'ga yuboriladi
  const onGoogleCredential = useEffectEvent(async (idToken) => {
    setToastOpen(false)
    setGoogleBusy(true)
    try {
      await googleLogin(idToken)
      clearPending()
      await onVerified()
    } catch (err) {
      showGoogleError(err?.status && err.status < 500 ? err.message : null)
    } finally {
      setGoogleBusy(false)
    }
  })

  // Google'ning haqiqiy tugmasi o'zimizning tugma ustiga shaffof joylanadi va uning
  // o'lchamiga cho'ziladi (Google tugmasi eng ko'pi 400×40 px)
  useEffect(() => {
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

    renderGoogleButton(slot, { locale: lang, onCredential: (token) => onGoogleCredential(token) })
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
  }, [lang])

  // raw — bitta raqam yoki joylashtirilgan (paste/autofill) butun kod
  const fill = (index, raw) => {
    const chars = raw.replace(/\D/g, '').slice(0, LENGTH - index).split('')
    // Xatodan keyin qayta terilsa, keyingi kataklar tozalanadi — kod boshidan kiritiladi
    const next = status === 'error' ? digits.map((v, i) => (i < index ? v : '')) : [...digits]
    if (chars.length === 0) next[index] = ''
    chars.forEach((char, k) => {
      next[index + k] = char
    })
    setDigits(next)
    if (status === 'error') setStatus('idle')

    if (chars.length === 0) return
    const code = next.join('')
    if (code.length === LENGTH) {
      inputs.current[index + chars.length - 1]?.blur()
      verify(code)
    } else {
      focusAt(index + chars.length)
    }
  }

  const handleKeyDown = (index) => (e) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      e.preventDefault()
      setDigits((d) => d.map((v, i) => (i === index - 1 ? '' : v)))
      if (status === 'error') setStatus('idle')
      focusAt(index - 1)
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault()
      focusAt(index - 1)
    } else if (e.key === 'ArrowRight') {
      e.preventDefault()
      focusAt(index + 1)
    } else if (/^\d$/.test(e.key) && !e.ctrlKey && !e.metaKey && !locked) {
      // Katakdagi eski qiymat ustidan yoziladi (xuddi shu raqamda onChange ishlamaydi)
      e.preventDefault()
      fill(index, e.key)
    }
  }

  const boxClass = (value) =>
    ['otp__box', value && 'is-filled', status !== 'idle' && status !== 'checking' && `is-${status}`]
      .filter(Boolean)
      .join(' ')

  return (
    <div className="form form--code">
      <div className="form__heading">
        <h2 className="form__title">{t('code.title')}</h2>
        {/* Havola o'rni tilga qarab o'zgaradi: matn ikki bo'lakka ajratilgan */}
        <p className="form__subtitle">
          {t('code.subtitleBefore')}{' '}
          <a href={`https://t.me/${BOT}`} target="_blank" rel="noreferrer">
            @{BOT}
          </a>{' '}
          {t('code.subtitleAfter')}
        </p>
      </div>

      <div className="otp" role="group" aria-label={t('code.groupLabel')} aria-busy={status === 'checking'}>
        {digits.map((value, i) => (
          <input
            key={i}
            ref={(el) => {
              inputs.current[i] = el
            }}
            className={boxClass(value)}
            type="text"
            inputMode="numeric"
            autoComplete={i === 0 ? 'one-time-code' : 'off'}
            aria-label={t('code.digitLabel', { n: i + 1 })}
            aria-invalid={status === 'error'}
            value={value}
            readOnly={locked}
            onChange={(e) => fill(i, e.target.value)}
            onKeyDown={handleKeyDown(i)}
            onFocus={(e) => e.target.select()}
          />
        ))}
      </div>

      <div className="form__alt-group">
        <div className="divider">
          <span>{t('common.or')}</span>
        </div>

        <div
          className={googleBusy || locked ? 'google-auth is-busy' : 'google-auth'}
          ref={googleRef}
        >
          {/* Google skripti yuklanmasa, bosilganda xato ko'rsatiladi */}
          <button
            type="button"
            className="btn-google"
            onClick={() => showGoogleError()}
            disabled={googleBusy || locked}
            aria-busy={googleBusy}
            tabIndex={googleReady ? -1 : undefined}
            aria-hidden={googleReady || undefined}
          >
            <GoogleIcon />
            {t('code.google')}
          </button>
          <div className="google-auth__slot" ref={googleSlot} />
        </div>
      </div>

      {toastOpen && (
        <Toast
          title={toastTitle ?? t('code.invalidTitle')}
          message={toastText ?? t('code.invalidText')}
          onClose={closeToast}
        />
      )}
    </div>
  )
}

export default CodeLoginForm
