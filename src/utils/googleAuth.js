// Google orqali kirish: o'zimizning tugma bosilganda Google oynasi (popup) ochiladi va
// OpenID Connect orqali id_token olinadi. Google shu saytning bosh sahifasiga qaytaradi
// ("#id_token=..."), popup natijani BroadcastChannel orqali asosiy oynaga yuboradi va yopiladi.
//
// Google Cloud Console → OAuth client → "Authorized redirect URIs" ga quyidagilar qo'shilishi kerak:
//   http://localhost:5173/   va   https://<frontend domeni>/

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID
const CHANNEL = 'passport-google-auth'

const redirectUri = () => new URL(import.meta.env.BASE_URL, window.location.origin).href

const randomString = () => {
  const bytes = crypto.getRandomValues(new Uint8Array(16))
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('')
}

// JWT ichidagi ma'lumot (imzo backend'da tekshiriladi, bu yerda faqat nonce solishtiriladi)
function jwtPayload(token) {
  try {
    const part = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
    const bytes = Uint8Array.from(atob(part), (c) => c.charCodeAt(0))
    return JSON.parse(new TextDecoder().decode(bytes))
  } catch {
    return null
  }
}

// Popup ichida chaqiriladi (main.jsx, ilova chizilishidan oldin).
// true — bu Google'dan qaytgan popup: natija yuborildi, ilovani chizish shart emas.
export function handleGoogleCallback() {
  const hash = window.location.hash.slice(1)
  if (!/(^|&)(id_token|error)=/.test(hash) || !/(^|&)state=/.test(hash)) return false

  const params = new URLSearchParams(hash)
  const message = {
    idToken: params.get('id_token'),
    error: params.get('error'),
    state: params.get('state'),
  }
  // Token manzil satrida qolmasin
  history.replaceState(null, '', window.location.pathname + window.location.search)

  const channel = new BroadcastChannel(CHANNEL)
  channel.postMessage(message)
  channel.close()
  window.close()
  return true
}

let pending = null

// Google oynasini ochadi va id_token bilan yakunlanadi. Foydalanuvchi oynani yopsa —
// va'da osilib qoladi, lekin tugmani qayta bosish yangi urinishni boshlaydi.
export function signInWithGoogle() {
  if (!CLIENT_ID) return Promise.reject(new Error('VITE_GOOGLE_CLIENT_ID berilmagan'))

  pending?.cancel()

  const state = randomString()
  const nonce = randomString()

  const url = new URL('https://accounts.google.com/o/oauth2/v2/auth')
  url.search = new URLSearchParams({
    client_id: CLIENT_ID,
    redirect_uri: redirectUri(),
    response_type: 'id_token',
    scope: 'openid email profile',
    prompt: 'select_account',
    state,
    nonce,
  })

  const width = 500
  const height = 640
  const left = window.screenX + (window.outerWidth - width) / 2
  const top = window.screenY + (window.outerHeight - height) / 2
  const popup = window.open(
    url.href,
    'passport-google',
    `width=${width},height=${height},left=${left},top=${top}`,
  )
  if (!popup) return Promise.reject(new Error('Popup bloklandi'))

  return new Promise((resolve, reject) => {
    const channel = new BroadcastChannel(CHANNEL)
    const finish = () => {
      channel.close()
      pending = null
    }
    pending = {
      cancel: () => {
        finish()
        reject(Object.assign(new Error('Bekor qilindi'), { cancelled: true }))
      },
    }
    channel.onmessage = ({ data }) => {
      if (data?.state !== state) return
      finish()
      if (data.error || !data.idToken) {
        const err = new Error(data.error || 'Google javob bermadi')
        err.cancelled = data.error === 'access_denied'
        reject(err)
        return
      }
      if (jwtPayload(data.idToken)?.nonce !== nonce) {
        reject(new Error('Google javobi tekshiruvdan o‘tmadi'))
        return
      }
      resolve(data.idToken)
    }
  })
}
