import { createContext, useContext } from 'react'

export const LANGS = ['uz', 'ru', 'en']
export const DEFAULT_LANG = 'uz'

export const LanguageContext = createContext(null)

// { lang, setLang, t } — t('kalit', { n: 3 }) matndagi {n} o'rniga qiymat qo'yadi
export function useI18n() {
  return useContext(LanguageContext)
}
