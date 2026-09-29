import { useState } from 'react'
import { PhoneIcon, UserIcon } from '../../components/icons.jsx'
import { AltLoginButtons, Field, FormAlert } from './FormParts.jsx'

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
  const [submitError, setSubmitError] = useState(null)

  const phoneValid = PHONE_PATTERN.test(form.phone)
  const phoneError =
    phoneTouched && form.phone && !phoneValid
      ? 'Telefon raqami notoʻgʻri formatda. Namuna: +998 90 123 45 67'
      : null
  const canSubmit =
    form.firstName.trim() && form.lastName.trim() && phoneValid && !submitting

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setPhoneTouched(true)
    if (!canSubmit) return
    setSubmitError(null)
    setSubmitting(true)
    try {
      // TODO: backend API bilan ulash
      await Promise.resolve(form)
    } catch (err) {
      setSubmitError({
        title: 'Roʻyxatdan oʻtishda xatolik',
        message: err?.message ?? 'Nimadir xato ketdi. Qaytadan urinib koʻring.',
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
          id="firstName"
          label="Ism"
          icon={UserIcon}
          placeholder="Ismingizni kiriting"
          autoComplete="given-name"
          value={form.firstName}
          onChange={update('firstName')}
        />
        <Field
          id="lastName"
          label="Familiya"
          icon={UserIcon}
          placeholder="Familiyangizni kiriting"
          autoComplete="family-name"
          value={form.lastName}
          onChange={update('lastName')}
        />
        <Field
          id="phone"
          label="Telefon raqami"
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
        Kirish
      </button>

      <AltLoginButtons />
    </form>
  )
}

export default PhoneLoginForm
