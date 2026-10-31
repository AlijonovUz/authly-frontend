import { useEffect, useState, useSyncExternalStore } from 'react'
import { clearAllAuthCaches, getCachedUser, getMe, isProfileComplete, logout, saveProfile, setCachedUser } from '../../api/auth.js'
import { getApiErrorMessage, mediaUrl } from '../../api/client.js'
import { getCachedDistricts, getCachedRegions, getDistricts, getRegions } from '../../api/references.js'
import { getPublicApplications, returnToSource, usePublicApplications } from '../../api/sso.js'
import { ArrowRightIcon, LogOutIcon, PlusIcon, UserIcon } from '../../components/icons.jsx'
import { useI18n } from '../../i18n/context.js'
import { getSourceSite } from '../../utils/sourceSite.js'
import { Field, FormAlert } from './FormParts.jsx'
import DateField from './DateField.jsx'
import LinkedAccounts from './LinkedAccounts.jsx'
import RegisteredView from './RegisteredView.jsx'
import SearchSelect from './SearchSelect.jsx'

const thinIcon = (Icon) => (props) => <Icon strokeWidth={1.5} {...props} />
const ThinUserIcon = thinIcon(UserIcon)

// Telefonda select ichiga qisqa matn ("Tanlang") sig'adi — CSS'dagi 600px chegarasi bilan bir xil
const PHONE_QUERY = '(max-width: 600px)'
const subscribePhone = (onChange) => {
  const mql = window.matchMedia(PHONE_QUERY)
  mql.addEventListener('change', onChange)
  return () => mql.removeEventListener('change', onChange)
}
const useIsPhone = () =>
  useSyncExternalStore(subscribePhone, () => window.matchMedia(PHONE_QUERY).matches)

// Backend sanasi "YYYY-MM-DD" → "KK.OO.YYYY"
function fromApiDate(value) {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value ?? '')
  return match ? `${match[3]}.${match[2]}.${match[1]}` : ''
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
  const cachedUser = getCachedUser()

  const [form, setForm] = useState(() => ({
    firstName: cachedUser?.first_name || '',
    lastName: cachedUser?.last_name || '',
    region: cachedUser?.region_info?.id || '',
    district: cachedUser?.district_info?.id || '',
    birthDate: fromApiDate(cachedUser?.birth_date) || '',
  }))
  const [photo, setPhoto] = useState(() =>
    cachedUser?.avatar
      ? { file: null, url: mediaUrl(cachedUser.avatar), remote: true }
      : null,
  )
  const [submitted, setSubmitted] = useState(false)
  const isPhone = useIsPhone()
  const [submitting, setSubmitting] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)
  const [registered, setRegistered] = useState(false)
  const [currentUser, setCurrentUser] = useState(cachedUser)
  // Profil avval to'ldirilgan bo'lsa — bu tahrirlash: matnlar "to'ldiring" emas, "saqlash"
  const [existing, setExisting] = useState(() => isProfileComplete(cachedUser))
  const [saveError, setSaveError] = useState(null) // { message } | null
  const [regions, setRegions] = useState(() => {
    const cached = getCachedRegions()
    if (cached?.length) return cached
    if (cachedUser?.region_info) return [cachedUser.region_info]
    return []
  })
  const [loadedDistricts, setLoadedDistricts] = useState(() => {
    const rId = cachedUser?.region_info?.id
    if (rId) {
      const cached = getCachedDistricts(rId)
      if (cached?.length) return { region: rId, list: cached }
      if (cachedUser?.district_info) return { region: rId, list: [cachedUser.district_info] }
    }
    return { region: '', list: [] }
  })
  // Boshqa viloyat tanlangan bo'lsa eski ro'yxat ko'rinmaydi
  const districts = loadedDistricts.region === form.region ? loadedDistricts.list : []
  const { t, lang } = useI18n()
  const [source] = useState(getSourceSite)
  const apps = usePublicApplications()
  const matchedApp = Array.isArray(apps)
    ? apps.find((a) => {
        try {
          return a.url && new URL(a.url).hostname === source?.host
        } catch {
          return false
        }
      })
    : null
  const sourceName = matchedApp?.name ?? source?.service?.title?.[lang] ?? source?.host ?? ''

  // Oldingi surat uchun yaratilgan vaqtinchalik manzilni bo'shatamiz
  useEffect(() => {
    if (!photo || photo.remote) return
    return () => URL.revokeObjectURL(photo.url)
  }, [photo])

  // Viloyatlar ro'yxati va avval saqlangan profil ma'lumotlari
  useEffect(() => {
    let active = true
    getRegions()
      .then((list) => {
        if (!active || !Array.isArray(list)) return
        setRegions(list)
      })
      .catch(() => {})
    getMe()
      .then((me) => {
        if (!active || !me) return
        setCurrentUser(me)
        setExisting(isProfileComplete(me))
        setForm((f) => ({
          firstName: f.firstName || me.first_name || '',
          lastName: f.lastName || me.last_name || '',
          region: f.region || me.region_info?.id || '',
          district: f.district || me.district_info?.id || '',
          birthDate: f.birthDate || fromApiDate(me.birth_date),
        }))
        if (me.avatar) {
          setPhoto((p) => (p?.file ? p : { file: null, url: mediaUrl(me.avatar), remote: true }))
        }
      })
      .catch((err) => {
        // Sessiya tugagan — qaytadan kirish kerak
        if (err?.status === 401) {
          clearAllAuthCaches()
          window.location.hash = '#/'
        }
      })
    return () => {
      active = false
    }
  }, [])

  // Tanlangan viloyat tumanlari
  useEffect(() => {
    if (!form.region) return
    let active = true
    const region = form.region
    const cached = getCachedDistricts(region)
    if (cached?.length) {
      setLoadedDistricts({ region, list: cached })
    }
    getDistricts(region)
      .then((list) => active && setLoadedDistricts({ region, list }))
      .catch(() => {})
    return () => {
      active = false
    }
  }, [form.region])

  const pickPhoto = (file) => {
    if (file) setPhoto({ file, url: URL.createObjectURL(file) })
  }

  // Hamma maydon to'g'ri to'ldirilmaguncha "Davom etish" nofaol
  const allErrors = validate(form, t)
  const isComplete = Object.keys(allErrors).length === 0
  // Tugma nofaol bo'lgani uchun forma yuborilmaydi — sana to'liq yozilib, xato bo'lsa darhol ko'rsatamiz
  const errors = submitted
    ? allErrors
    : form.birthDate.length === 10 && allErrors.birthDate
      ? { birthDate: allErrors.birthDate }
      : {}

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitted(true)
    if (!isComplete || submitting) return
    setSubmitting(true)
    setSaveError(null)
    try {
      const updated = await saveProfile({ ...form, photo: photo?.file ?? null })
      if (updated) {
        setCurrentUser(updated)
        setCachedUser(updated)
      }
      getPublicApplications().catch(() => {})
      const source = getSourceSite()
      if (source) {
        await returnToSource(source)
        return
      }
      setRegistered(true)
    } catch (err) {
      if (err?.status === 401) {
        clearAllAuthCaches()
        window.location.hash = '#/'
        return
      }
      setSaveError({ message: getApiErrorMessage(err, t('common.errorText')) })
    } finally {
      setSubmitting(false)
    }
  }

  // Sessiyani yopib, boshqa akkaunt bilan kirish uchun login sahifasiga qaytaradi
  const handleLogout = async () => {
    if (loggingOut) return
    setLoggingOut(true)
    try {
      await logout()
    } catch {
      // Backend javob bermasa ham tokenlar o'chirildi — baribir chiqamiz
    }
    window.location.hash = '#/'
  }

  if (registered) {
    return (
      <RegisteredView
        updated={existing}
        onBack={() => setRegistered(false)}
        onLogout={handleLogout}
      />
    )
  }

  return (
    <form className="form form--profile" onSubmit={handleSubmit} noValidate>
      <div className="form__heading">
        <h2 className="form__title">{t(existing ? 'profile.editTitle' : 'profile.title')}</h2>
        <p className="form__subtitle">{t(existing ? 'profile.editSubtitle' : 'profile.subtitle')}</p>
      </div>

      {saveError && (
        <FormAlert title={t('phone.errorTitle')} message={saveError.message ?? t('common.errorText')} />
      )}

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
          <SearchSelect
            id="region"
            label={t('field.region')}
            placeholder={t(isPhone ? 'common.select' : 'field.regionPlaceholder')}
            searchPlaceholder={t('field.regionSearch')}
            options={regions}
            value={form.region}
            onChange={(region) =>
              setForm((f) => (f.region === region ? f : { ...f, region, district: '' }))
            }
            error={errors.region}
          />
          <SearchSelect
            id="district"
            label={t('field.district')}
            placeholder={t(isPhone ? 'common.select' : 'field.districtPlaceholder')}
            searchPlaceholder={t('field.districtSearch')}
            options={districts}
            value={form.district}
            onChange={(district) => setForm((f) => ({ ...f, district }))}
            align="end"
            error={errors.district}
            disabled={!form.region}
          />
        </div>

        <DateField
          id="birthDate"
          label={t('field.birthDate')}
          placeholder={t('field.birthDatePlaceholder')}
          value={form.birthDate}
          onChange={(birthDate) => setForm((f) => ({ ...f, birthDate }))}
          error={errors.birthDate}
        />
      </div>

      {currentUser && (
        <LinkedAccounts
          user={currentUser}
          onUserUpdated={(updatedUser) => {
            setCurrentUser(updatedUser)
            setCachedUser(updatedUser)
          }}
        />
      )}

      {source && (
        <button
          type="button"
          className="btn-primary btn-primary--lg registered__back"
          onClick={() => returnToSource(source)}
          style={{ width: '100%', marginBottom: '12px' }}
        >
          {t('registered.back', { name: sourceName })}
          <ArrowRightIcon />
        </button>
      )}

      <div className="profile__actions">
        <button
          type="submit"
          className="btn-primary btn-primary--lg"
          disabled={!isComplete || submitting || loggingOut}
        >
          {t(existing ? 'profile.save' : 'profile.submit')}
        </button>
        <button
          type="button"
          className="btn-logout"
          onClick={handleLogout}
          disabled={loggingOut || submitting}
        >
          <LogOutIcon width="18" height="18" />
          {t('profile.logout')}
        </button>
      </div>
    </form>
  )
}

export default ProfileForm
