import { useState } from 'react'
import { getCachedApplications } from '../../api/sso.js'
import { useI18n } from '../../i18n/context.js'
import { getSourceSite } from '../../utils/sourceSite.js'

const initials = (name) =>
  name
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? '')
    .join('')

function RedirectingView() {
  const { t, lang } = useI18n()
  const [source] = useState(getSourceSite)
  const apps = getCachedApplications() || []
  const matchedApp = Array.isArray(apps)
    ? apps.find((a) => {
        try {
          return a.url && new URL(a.url).hostname === source?.host
        } catch {
          return false
        }
      })
    : null
  const name = matchedApp?.name ?? source?.service?.title?.[lang] ?? source?.host ?? ''

  return (
    <div className="form registered">
      <span className="registered__icon registered__icon--redirect" aria-hidden="true">
        <svg
          className="redirecting-spinner"
          width="36"
          height="36"
          viewBox="0 0 36 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx="18"
            cy="18"
            r="14"
            stroke="currentColor"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeDasharray="65 30"
          />
        </svg>
      </span>

      <div className="form__heading" role="status">
        <h2 className="form__title">{t('sso.redirecting')}</h2>
        <p className="form__subtitle registered__text">
          {t('sso.redirectingHint', { name: name || source?.host || '' })}
        </p>
      </div>

      {source && (
        <div className="registered__source">
          <span className="registered__badge" aria-hidden="true">
            {initials(name)}
          </span>
          <div className="registered__source-text">
            <p className="registered__label">{t('registered.source')}</p>
            <p className="registered__name">{name}</p>
            {source.host && <span className="registered__link">{source.host}</span>}
          </div>
        </div>
      )}
    </div>
  )
}

export default RedirectingView
