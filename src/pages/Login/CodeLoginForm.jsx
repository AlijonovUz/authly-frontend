import { useCallback, useEffect, useRef, useState } from 'react'
import { verifyCode } from '../../api/auth.js'
import { GoogleIcon } from '../../components/icons.jsx'
import Toast from '../../components/Toast.jsx'
import { useI18n } from '../../i18n/context.js'

const LENGTH = 6
const SUCCESS_DELAY = 700

// status: idle | checking | success | error
function CodeLoginForm({ onVerified }) {
  const [digits, setDigits] = useState(() => Array(LENGTH).fill(''))
  const [status, setStatus] = useState('idle')
  const [toastOpen, setToastOpen] = useState(false)
  const inputs = useRef([])
  const { t } = useI18n()

  const locked = status === 'checking' || status === 'success'
  const closeToast = useCallback(() => setToastOpen(false), [])

  useEffect(() => {
    inputs.current[0]?.focus()
  }, [])

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
      await verifyCode(code)
      setToastOpen(false)
      setStatus('success')
    } catch {
      setStatus('error')
      setToastOpen(true)
      focusAt(0)
    }
  }

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
          <a href="https://t.me/raqamlibot" target="_blank" rel="noreferrer">
            @raqamlibot
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

        {/* TODO: Google OAuth manzilini ulash */}
        <button type="button" className="btn-google">
          <GoogleIcon />
          {t('code.google')}
        </button>
      </div>

      {toastOpen && (
        <Toast title={t('code.invalidTitle')} message={t('code.invalidText')} onClose={closeToast} />
      )}
    </div>
  )
}

export default CodeLoginForm
