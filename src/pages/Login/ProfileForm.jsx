import { useEffect, useState, useSyncExternalStore } from 'react'
import { saveProfile } from '../../api/auth.js'
import { CalendarIcon, ChevronDownIcon, PlusIcon, UserIcon } from '../../components/icons.jsx'
import { REGIONS } from '../../data/regions.js'
import { useI18n } from '../../i18n/context.js'
import { Field } from './FormParts.jsx'

const thinIcon = (Icon) => (props) => <Icon strokeWidth={1.5} {...props} />
const ThinUserIcon = thinIcon(UserIcon)
const ThinCalendarIcon = thinIcon(CalendarIcon)

// Telefonda select ichiga qisqa matn ("Tanlang") sig'adi — CSS'dagi 600px chegarasi bilan bir xil
const PHONE_QUERY = '(max-width: 600px)'
const subscribePhone = (onChange) => {
  const mql = window.matchMedia(PHONE_QUERY)
  mql.addEventListener('change', onChange)
  return () => mql.removeEventListener('change', onChange)
}
const useIsPhone = () =>
  useSyncExternalStore(subscribePhone, () => window.matchMedia(PHONE_QUERY).matches)

// Kiritilgan qiymatni "KK.OO.YYYY" ko'rinishiga keltiradi
function formatDate(value) {
  const digits = value.replace(/\D/g, '').slice(0, 8)
  return [digits.slice(0, 2), digits.slice(2, 4), digits.slice(4, 8)].filter(Boolean).join('.')
}

function isValidBirthDate(value) {
  const match = /^(\d{2})\.(\d{2})\.(\d{4})$/.exec(value)
  if (!match) return false
  const [, d, m, y] = match.map(Number)
  const date = new Date(y, m - 1, d)
  return (
    date.getFullYear() === y &&
    date.getMonth() === m - 1 &&
    date.getDate() === d &&
    y >= 1900 &&
    date <= new Date()
  )
}

function validate(form, t) {
  const errors = {}
  if (!form.firstName.trim()) errors.firstName = true
  if (!form.lastName.trim()) errors.lastName = true
  if (!form.region) errors.region = true
  if (!form.district) errors.district = true
  if (!isValidBirthDate(form.birthDate)) {
    errors.birthDate = form.birthDate ? t('profile.birthDateInvalid') : true
  }
  return errors
}

function SelectField({ id, label, placeholder, options, value, onChange, error, disabled }) {
  return (
    <div className="field">
      <label className="field__label" htmlFor={id}>
        {label}
      </label>
      <div className={error ? 'field__control field__control--select has-error' : 'field__control field__control--select'}>
        <select
          id={id}
          className={value ? 'field__select' : 'field__select is-placeholder'}
          value={value}
          onChange={onChange}
          disabled={disabled}
          aria-invalid={Boolean(error)}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <ChevronDownIcon className="field__chevron" />
      </div>
    </div>
  )
}

function AvatarPicker({ photoUrl, onChange }) {
  const { t } = useI18n()
  return (
    <div className="avatar">
      <label className="avatar__picker">
        <input
          type="file"
          accept="image/*"
          className="visually-hidden"
          onChange={(e) => onChange(e.target.files?.[0] ?? null)}
        />
        <span className="avatar__circle">
          {photoUrl ? (
            <img src={photoUrl} alt={t('profile.photo')} className="avatar__img" />
          ) : (
            <UserIcon width="28" height="28" strokeWidth={1.5} />
          )}
        </span>
        <span className="avatar__badge" aria-hidden="true">
          <PlusIcon />
        </span>
        <span className="visually-hidden">{t('profile.uploadPhoto')}</span>
      </label>
      <div className="avatar__text">
        <p className="avatar__title">{t('profile.photo')}</p>
        <p className="avatar__hint">{t('profile.optional')}</p>
      </div>
    </div>
  )
}

function ProfileForm() {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    region: '',
    district: '',
    birthDate: '',
  })
  const [photo, setPhoto] = useState(null) // { file, url }
  const [submitted, setSubmitted] = useState(false)
  const isPhone = useIsPhone()
  const [submitting, setSubmitting] = useState(false)
  const { t } = useI18n()

  // Oldingi surat uchun yaratilgan vaqtinchalik manzilni bo'shatamiz
  useEffect(() => {
    if (!photo) return
    return () => URL.revokeObjectURL(photo.url)
  }, [photo])

  const pickPhoto = (file) => {
    if (file) setPhoto({ file, url: URL.createObjectURL(file) })
  }

  const errors = submitted ? validate(form, t) : {}
  const districts = REGIONS.find((r) => r.name === form.region)?.districts ?? []

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitted(true)
    if (Object.keys(validate(form, t)).length > 0 || submitting) return
    setSubmitting(true)
    try {
      // TODO: backend tayyor bo'lgach, keyingi sahifaga yo'naltirish
      await saveProfile({ ...form, photo: photo?.file ?? null })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form className="form form--profile" onSubmit={handleSubmit} noValidate>
      <div className="form__heading">
        <h2 className="form__title">{t('profile.title')}</h2>
        <p className="form__subtitle">{t('profile.subtitle')}</p>
      </div>

      <AvatarPicker photoUrl={photo?.url} onChange={pickPhoto} />

      <div className="profile__fields">
        <div className="profile__row profile__row--names">
          <Field
            id="firstName"
            label={t('field.firstName')}
            icon={ThinUserIcon}
            placeholder={t('field.firstNamePlaceholder')}
            autoComplete="given-name"
            value={form.firstName}
            onChange={update('firstName')}
            error={errors.firstName}
          />
          <Field
            id="lastName"
            label={t('field.lastName')}
            icon={ThinUserIcon}
            placeholder={t('field.lastNamePlaceholder')}
            autoComplete="family-name"
            value={form.lastName}
            onChange={update('lastName')}
            error={errors.lastName}
          />
        </div>

        <div className="profile__row">
          <SelectField
            id="region"
            label={t('field.region')}
            placeholder={t(isPhone ? 'common.select' : 'field.regionPlaceholder')}
            options={REGIONS.map((r) => r.name)}
            value={form.region}
            onChange={(e) => setForm((f) => ({ ...f, region: e.target.value, district: '' }))}
            error={errors.region}
          />
          <SelectField
            id="district"
            label={t('field.district')}
            placeholder={t(isPhone ? 'common.select' : 'field.districtPlaceholder')}
            options={districts}
            value={form.district}
            onChange={update('district')}
            error={errors.district}
            disabled={!form.region}
          />
        </div>

        <Field
          id="birthDate"
          label={t('field.birthDate')}
          icon={ThinCalendarIcon}
          inputMode="numeric"
          placeholder={t('field.birthDatePlaceholder')}
          autoComplete="bday"
          maxLength={10}
          value={form.birthDate}
          onChange={(e) => setForm((f) => ({ ...f, birthDate: formatDate(e.target.value) }))}
          error={errors.birthDate}
        />
      </div>

      <button type="submit" className="btn-primary btn-primary--lg" disabled={submitting}>
        {t('profile.submit')}
      </button>
    </form>
  )
}

export default ProfileForm
