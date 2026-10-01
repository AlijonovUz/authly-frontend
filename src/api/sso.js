import { request } from './client.js'

// Javobdan qaytish manzilini topadi. Backend turlicha qaytarishi mumkin:
// { redirect_url } | { redirect_to } | { url } | { location } | { code } (manzilni o'zimiz yig'amiz)
function redirectFrom(data, { redirectUri, state }) {
  const direct = data?.redirect_url ?? data?.redirect_to ?? data?.url ?? data?.location
  if (typeof direct === 'string' && direct) return direct
  if (data?.code) {
    const url = new URL(redirectUri)
    url.searchParams.set('code', data.code)
    if (state) url.searchParams.set('state', state)
    return url.href
  }
  return null
}

// Kirgan foydalanuvchi uchun SSO ruxsatini oladi va mijoz saytining qaytish manzilini beradi
export async function ssoAuthorize({ clientId, redirectUri, scope, state }) {
  const data = await request('/api/v1/sso/authorize/', {
    method: 'POST',
    body: { client_id: clientId, redirect_uri: redirectUri, scope },
  })
  const url = redirectFrom(data, { redirectUri, state })
  if (!url) throw new Error('SSO javobida qaytish manzili yo‘q')
  return url
}

// Foydalanuvchini kelgan saytiga qaytaradi (source — getSourceSite() natijasi)
export async function returnToSource(source) {
  const url = source.sso ? await ssoAuthorize(source.sso) : source.url
  window.location.assign(url)
}
