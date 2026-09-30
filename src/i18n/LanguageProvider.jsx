import { useCallback, useEffect, useMemo, useState } from 'react'
import { DEFAULT_LANG, LANGS, LanguageContext } from './context.js'
import { TRANSLATIONS } from './translations.js'

const STORAGE_KEY = 'lang'

// Oldin tanlangan til, bo'lmasa — o'zbekcha
function getInitialLang() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (LANGS.includes(saved)) return saved
  } catch {
    // localStorage yopiq bo'lishi mumkin (maxfiy rejim)
  }
  return DEFAULT_LANG
}

function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(getInitialLang)

  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  const setLang = useCallback((next) => {
    setLangState(next)
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // saqlab bo'lmasa ham til shu sessiyada almashadi
    }
  }, [])

  const value = useMemo(() => {
    const t = (key, vars) => {
      const text = TRANSLATIONS[lang][key] ?? TRANSLATIONS[DEFAULT_LANG][key] ?? key
      return vars ? text.replace(/\{(\w+)\}/g, (_, name) => vars[name] ?? '') : text
    }
    return { lang, setLang, t }
  }, [lang, setLang])

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export default LanguageProvider
