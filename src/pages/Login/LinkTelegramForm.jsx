import { useCallback, useEffect, useEffectEvent, useRef, useState } from 'react'
import { getMe, linkPhone, setCachedUser } from '../../api/auth.js'
import { getApiErrorToast } from '../../api/client.js'
import { ArrowLeftIcon } from '../../components/icons.jsx'
import Toast from '../../components/Toast.jsx'
import { useI18n } from '../../i18n/context.js'
import { clearPending } from './pendingVerification.js'

const LENGTH = 6
const SUCCESS_DELAY = 700

// Kod yuboradigan Telegram bot (.env: VITE_TELEGRAM_BOT, @ belgisisiz)
const BOT = import.meta.env.VITE_TELEGRAM_BOT || 'AuthlyApp'

const hashParams = () => new URLSearchParams(window.location.hash.split('?')[1] ?? '')

function readLinkCode() {
  const code = hashParams().get('code') ?? new URLSearchParams(window.location.search).get('code')
  return code?.length === LENGTH && /^\d+$/.test(code) ? code : null
}

function clearLinkCode() {
  const url = new URL(window.location.href)
  url.searchParams.delete('code')
  const [path, query = ''] = url.hash.split('?')
  const params = new URLSearchParams(query)
  params.delete('code')
  url.hash = params.size ? `${path}?${params}` : path
  history.replaceState(history.state, '', url)
}

function LinkTelegramForm({ onLinked }) {
  const [digits, setDigits] = useState(() => readLinkCode()?.split('') ?? Array(LENGTH).fill(''))
  const [status, setStatus] = useState(() => (readLinkCode() ? 'checking' : 'idle'))
  const [toastOpen, setToastOpen] = useState(false)
  const [toastText, setToastText] = useState(null)
  const [toastTitle, setToastTitle] = useState(null)
  const inputs = useRef([])
  const { t } = useI18n()

  const locked = status === 'checking' || status === 'success'
  const closeToast = useCallback(() => setToastOpen(false), [])

  // Muvaffaqiyatli holat (yashil) biroz ko'rinib turadi, so'ng profilga qaytiladi
  useEffect(() => {
    if (status !== 'success') return
    const timer = setTimeout(() => {
      if (onLinked) onLinked()
      else window.location.hash = '#/profile'
    }, SUCCESS_DELAY)
    return () => clearTimeout(timer)
  }, [status, onLinked])

  const focusAt = (index) => {
    const el = inputs.current[Math.max(0, Math.min(LENGTH - 1, index))]
    el?.focus()
    el?.select()
  }

  const verify = async (code) => {
    setStatus('checking')
    try {
      clearPending()
      const res = await linkPhone(code)
      const updatedUser = res?.user ?? (await getMe())
      if (updatedUser) {
        setCachedUser(updatedUser)
      }
      try {
        sessionStorage.setItem(
          'authly.pendingToast',
          JSON.stringify({
            type: 'success',
            title: t('link.telegramSuccess'),
          }),
        )
      } catch {}
      setToastOpen(false)
      setStatus('success')
    } catch (err) {
      const { title, message } = getApiErrorToast(err, {
        defaultTitle: t('link.telegramErrorTitle') || t('common.errorTitle'),
        defaultMessage: t('code.invalidText'),
      })
      setToastTitle(title)
      setToastText(message)
      setStatus('error')
      setToastOpen(true)
      focusAt(0)
    }
  }

  const onMount = useEffectEvent(() => {
    const code = readLinkCode()
    if (!code) {
      inputs.current[0]?.focus()
      return
    }
    clearLinkCode()
    queueMicrotask(() => verify(code))
  })

  useEffect(() => {
    onMount()
  }, [])

  const fill = (index, raw) => {
    const chars = raw.replace(/\D/g, '').slice(0, LENGTH - index).split('')
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
        <button
          type="button"
          className="btn-primary btn-primary--lg registered__back"
          onClick={() => {
            window.location.hash = '#/profile'
          }}
        >
          <ArrowLeftIcon width="18" height="18" />
          {t('link.backToProfile')}
        </button>
      </div>

      {toastOpen && (
        <Toast
          type="error"
          title={toastTitle ?? t('code.invalidTitle')}
          message={toastText ?? t('code.invalidText')}
          onClose={closeToast}
        />
      )}
    </div>
  )
}

export default LinkTelegramForm
