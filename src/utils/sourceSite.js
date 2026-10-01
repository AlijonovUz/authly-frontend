import { DOMAIN, SERVICES } from '../data/services.js'

const isOurHost = (host) => host === DOMAIN || host.endsWith(`.${DOMAIN}`)

const parseUrl = (value) => {
  try {
    const url = new URL(value)
    return /^https?:$/.test(url.protocol) ? url : null
  } catch {
    return null
  }
}

// Foydalanuvchi qaysi saytdan kelganini aniqlaydi.
// 1) SSO: "?client_id=...&redirect_uri=...[&state=...][&scope=...]" — qaytish manzilini backend
//    (/sso/authorize/) tekshiradi va beradi.
// 2) "?redirect=" yoki "?return_url=", bo'lmasa document.referrer — faqat *.raqamlinazorat.uz
//    manzillari qabul qilinadi (begona saytga yo'naltirib yuborish imkoni bo'lmasligi uchun).
function readSource() {
  const params = new URLSearchParams(window.location.search)

  const clientId = params.get('client_id')
  const redirectUri = parseUrl(params.get('redirect_uri'))
  if (clientId && redirectUri) {
    return {
      url: redirectUri,
      sso: {
        clientId,
        redirectUri: redirectUri.href,
        scope: params.get('scope') || 'read',
        state: params.get('state'),
      },
    }
  }

  const candidates = [params.get('redirect'), params.get('return_url'), document.referrer]
  for (const value of candidates) {
    const url = value && parseUrl(value)
    if (url && isOurHost(url.hostname) && url.hostname !== window.location.hostname) {
      return { url, sso: null }
    }
  }
  return null
}

// { url, host, service, sso } yoki null. service — SERVICES ro'yxatidagi mos yozuv (topilmasa null)
export function getSourceSite() {
  const source = readSource()
  if (!source) return null
  const host = source.url.hostname
  const service = SERVICES.find((s) => s.url === host) ?? null
  return { url: source.url.href, host, service, sso: source.sso }
}
