import { useState } from 'react'
import { EyeIcon, EyeOffIcon, LockIcon, UserIcon } from '../../components/icons.jsx'
import { AltLoginButtons, Field, FormAlert } from './FormParts.jsx'

function PasswordLoginForm() {
  const [form, setForm] = useState({ login: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [capsLock, setCapsLock] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(null)
  const [passwordInvalid, setPasswordInvalid] = useState(false)

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
    try {
      // TODO: backend API bilan ulash. Xato bo'lsa, masalan:
      // throw { attemptsLeft: 4 }
      await Promise.resolve(form)
    } catch (err) {
      setPasswordInvalid(true)
      setSubmitError({
        variant: 'danger',
        title: 'Login yoki parol notoʻgʻri',
        message: 'Kiritilgan maʼlumotlar mos kelmadi. Tekshirib, qaytadan urinib koʻring.',
        extra:
          err?.attemptsLeft != null ? `Qolgan urinishlar: ${err.attemptsLeft} ta` : null,
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form className="form" onSubmit={handleSubmit} noValidate>
      <h2 className="form__title">Tizimga kirish</h2>

      {submitError && <FormAlert {...submitError} />}

      <div className="form__fields">
        <Field
          id="login"
          label="Login"
          icon={UserIcon}
          placeholder="Login kiriting"
          autoComplete="username"
          value={form.login}
          onChange={update('login')}
        />
        <Field
          id="password"
          label="Parol"
          icon={LockIcon}
          type={showPassword ? 'text' : 'password'}
          placeholder="Parol kiriting"
          autoComplete="current-password"
          value={form.password}
          onChange={update('password')}
          onKeyDown={trackCapsLock}
          onKeyUp={trackCapsLock}
          onBlur={() => setCapsLock(false)}
          error={passwordInvalid}
          warning={capsLock ? 'Caps Lock yoqilgan — parol katta harflarda kiritilmoqda' : null}
          trailing={
            form.password && (
              <button
                type="button"
                className="field__toggle"
                aria-label={showPassword ? 'Parolni yashirish' : 'Parolni koʻrsatish'}
                onClick={() => setShowPassword((v) => !v)}
              >
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            )
          }
        />
      </div>

      <button type="submit" className="btn-primary" disabled={!canSubmit}>
        Kirish
      </button>

      <AltLoginButtons />
    </form>
  )
}

export default PasswordLoginForm
