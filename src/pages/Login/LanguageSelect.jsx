import { useEffect, useRef, useState } from 'react'
import { ChevronDownIcon, FlagEn, FlagRu, FlagUz } from '../../components/icons.jsx'

const LANGUAGES = [
  { code: 'UZ', Flag: FlagUz },
  { code: 'RU', Flag: FlagRu },
  { code: 'EN', Flag: FlagEn },
]

function LanguageSelect() {
  const [open, setOpen] = useState(false)
  const [lang, setLang] = useState(LANGUAGES[0])
  const ref = useRef(null)

  useEffect(() => {
    if (!open) return
    const close = (e) => {
      if (!ref.current?.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [open])

  return (
    <div className="lang" ref={ref}>
      <button
        type="button"
        className="lang__trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <lang.Flag />
        <span>{lang.code}</span>
        <ChevronDownIcon className={open ? 'lang__chevron is-open' : 'lang__chevron'} />
      </button>
      {open && (
        <ul className="lang__menu" role="listbox">
          {LANGUAGES.map((item) => (
            <li key={item.code}>
              <button
                type="button"
                role="option"
                aria-selected={item.code === lang.code}
                className="lang__option"
                onClick={() => {
                  setLang(item)
                  setOpen(false)
                }}
              >
                <item.Flag />
                <span>{item.code}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default LanguageSelect
