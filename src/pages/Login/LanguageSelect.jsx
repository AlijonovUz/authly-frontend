import { useEffect, useRef, useState } from 'react'
import { ChevronDownIcon, FlagEn, FlagRu, FlagUz } from '../../components/icons.jsx'
import { useI18n } from '../../i18n/context.js'

const LANGUAGES = [
  { code: 'uz', Flag: FlagUz },
  { code: 'ru', Flag: FlagRu },
  { code: 'en', Flag: FlagEn },
]

function LanguageSelect() {
  const [open, setOpen] = useState(false)
  const { lang, setLang, t } = useI18n()
  const ref = useRef(null)
  const current = LANGUAGES.find((item) => item.code === lang) ?? LANGUAGES[0]

  useEffect(() => {
    if (!open) return
    const close = (e) => {
      if (!ref.current?.contains(e.target)) setOpen(false)
    }
    const closeOnEscape = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', close)
    document.addEventListener('keydown', closeOnEscape)
    return () => {
      document.removeEventListener('mousedown', close)
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [open])

  return (
    <div className="lang" ref={ref}>
      <button
        type="button"
        className="lang__trigger"
        aria-label={t('lang.label')}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <current.Flag />
        <span>{current.code.toUpperCase()}</span>
        <ChevronDownIcon className={open ? 'lang__chevron is-open' : 'lang__chevron'} />
      </button>
      {open && (
        <ul className="lang__menu" role="listbox">
          {LANGUAGES.map((item) => (
            <li key={item.code}>
              <button
                type="button"
                role="option"
                aria-selected={item.code === lang}
                className="lang__option"
                onClick={() => {
                  setLang(item.code)
                  setOpen(false)
                }}
              >
                <item.Flag />
                <span>{item.code.toUpperCase()}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default LanguageSelect
