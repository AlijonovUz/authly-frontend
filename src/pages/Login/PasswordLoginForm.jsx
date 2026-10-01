import { useState } from 'react'
import { login } from '../../api/auth.js'
import { EyeIcon, EyeOffIcon, LockIcon, UserIcon } from '../../components/icons.jsx'
import { useI18n } from '../../i18n/context.js'
import { AltLoginButtons, Field, FormAlert } from './FormParts.jsx'
import { setPending } from './pendingVerification.js'

// Telefon raqami kiritilgan bo'lsa bo'sh joy va qavslarni olib tashlaymiz: "+998 90 123-45-67" → "+998901234567"
const normalizeLogin = (value) => {
  const trimmed = value.trim()
  return /^\+?[\d\s()-]+$/.test(trimmed) ? trimmed.replace(/[^\d+]/g, '') : trimmed
}

function PasswordLoginForm({ onLoggedIn }) {
  const [form, setForm] = useState({ login: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [capsLock, setCapsLock] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(null) // { attemptsLeft }
  const [passwordInvalid, setPasswordInvalid] = useState(false)
  const { t } = useI18n()

  const canSubmit = form.login.trim() && form.password && !capsLock && !submitting

  const update = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }))
    setPasswordInvalid(false)
  }

  const trackCapsLock = (e) => setCapsLock(e.getModifierState?.('CapsLock') ?? false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!canSubmit) return
    setSubmitError(null)
    setSubmitting(true)
    const identifier = normalizeLogin(form.login)
    try {
      await login(identifier, form.password)
      await onLoggedIn()
    } catch (err) {
      // Raqam/email tasdiqlanmagan: backend OTP yubordi — kod kiritish sahifasiga o'tamiz
      if (err?.verificationRequired) {
        setPending({ kind: 'login', identifier, password: form.password })
        window.location.hash = '#/'
        return
      }
      setPasswordInvalid(true)
      setSubmitError({ attemptsLeft: err?.data?.attempts_left ?? null })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form className="form" onSubmit={handleSubmit} noValidate>
      <h2 className="form__title">{t('login.title')}</h2>

      {submitError && (
        <FormAlert
          variant="danger"
          title={t('password.errorTitle')}
          message={t('password.errorText')}
          extra={
            submitError.attemptsLeft != null
              ? t('password.attemptsLeft', { n: submitError.attemptsLeft })
              : null
          }
        />
      )}

      <div className="form__fields">
        <Field
          id="login"
          label={t('field.login')}
          icon={UserIcon}
          placeholder={t('field.loginPlaceholder')}
          autoComplete="username"
          value={form.login}
          onChange={update('login')}
        />
        <Field
          id="password"
          label={t('field.password')}
          icon={LockIcon}
          type={showPassword ? 'text' : 'password'}
          placeholder={t('field.passwordPlaceholder')}
          autoComplete="current-password"
          value={form.password}
          onChange={update('password')}
          onKeyDown={trackCapsLock}
          onKeyUp={trackCapsLock}
          onBlur={() => setCapsLock(false)}
          error={passwordInvalid}
          warning={capsLock ? t('password.capsLock') : null}
          trailing={
            form.password && (
              <button
                type="button"
                className="field__toggle"
                aria-label={showPassword ? t('password.hide') : t('password.show')}
                onClick={() => setShowPassword((v) => !v)}
              >
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            )
          }
        />
      </div>

      <button type="submit" className="btn-primary" disabled={!canSubmit}>
        {t('login.submit')}
      </button>

      <AltLoginButtons />
    </form>
  )
}

export default PasswordLoginForm
