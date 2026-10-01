import { useState } from 'react'
import { registerPhone } from '../../api/auth.js'
import { PhoneIcon, UserIcon } from '../../components/icons.jsx'
import { useI18n } from '../../i18n/context.js'
import { AltLoginButtons, Field, FormAlert } from './FormParts.jsx'
import { setPending } from './pendingVerification.js'

const PHONE_PATTERN = /^\+998 \d{2} \d{3} \d{2} \d{2}$/

// Har qanday kiritilgan qiymatni "+998 XX XXX XX XX" ko'rinishiga keltiradi
function formatPhone(value) {
  if ('+998'.startsWith(value.trim())) return ''
  let digits = value.replace(/\D/g, '')
  if (digits.startsWith('998')) digits = digits.slice(3)
  digits = digits.slice(0, 9)
  const parts = [
    digits.slice(0, 2),
    digits.slice(2, 5),
    digits.slice(5, 7),
    digits.slice(7, 9),
  ].filter(Boolean)
  return ['+998', ...parts].join(' ')
}

function PhoneLoginForm() {
  const [form, setForm] = useState({ firstName: '', lastName: '', phone: '' })
  const [phoneTouched, setPhoneTouched] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(null) // { message } — server matni, bo'lmasa null
  const { t } = useI18n()

  const phoneValid = PHONE_PATTERN.test(form.phone)
  const phoneError = phoneTouched && form.phone && !phoneValid ? t('phone.invalid') : null
  const canSubmit =
    form.firstName.trim() && form.lastName.trim() && phoneValid && !submitting

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setPhoneTouched(true)
    if (!canSubmit) return
    setSubmitError(null)
    setSubmitting(true)
    const phone = form.phone.replace(/\s/g, '')
    try {
      const data = await registerPhone({
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        phone,
      })
      setPending({ kind: 'phone', identifier: phone })
      // Raqam botga bog'lanmagan: bot kontaktni so'raydi va OTP'ni yuboradi
      if (data?.bot_url) window.open(data.bot_url, '_blank', 'noopener')
      window.location.hash = '#/'
    } catch (err) {
      setSubmitError({ message: err?.message ?? null })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form className="form" onSubmit={handleSubmit} noValidate>
      <h2 className="form__title">{t('login.title')}</h2>

      {submitError && (
        <FormAlert
          title={t('phone.errorTitle')}
          message={submitError.message ?? t('common.errorText')}
        />
      )}

      <div className="form__fields">
        <Field
          id="firstName"
          label={t('field.firstName')}
          icon={UserIcon}
          placeholder={t('field.firstNamePlaceholder')}
          autoComplete="given-name"
          value={form.firstName}
          onChange={update('firstName')}
        />
        <Field
          id="lastName"
          label={t('field.lastName')}
          icon={UserIcon}
          placeholder={t('field.lastNamePlaceholder')}
          autoComplete="family-name"
          value={form.lastName}
          onChange={update('lastName')}
        />
        <Field
          id="phone"
          label={t('field.phone')}
          icon={PhoneIcon}
          type="tel"
          inputMode="tel"
          placeholder="+998 90 123 45 67"
          autoComplete="tel"
          maxLength={17}
          value={form.phone}
          onChange={(e) => setForm((f) => ({ ...f, phone: formatPhone(e.target.value) }))}
          onBlur={() => setPhoneTouched(true)}
          error={phoneError}
        />
      </div>

      <button type="submit" className="btn-primary" disabled={!canSubmit}>
        {t('login.submit')}
      </button>

      <AltLoginButtons />
    </form>
  )
}

export default PhoneLoginForm
