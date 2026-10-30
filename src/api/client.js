// Backend bilan ishlash uchun umumiy fetch o'rami: manzil, JWT token, token yangilash va xatolar.

// Masalan: VITE_API_URL=https://api.example.uz  (bo'sh bo'lsa — shu domenning o'zi, /api/...)
// .env bo'lmasa yoki qiymat bo'sh bo'lsa (masalan, serverda build qilinganda) — production backend.
// Bo'sh qolsa so'rov frontend domeniga ketib, nginx 405 qaytaradi.
const BASE_URL = (import.meta.env.VITE_API_URL || 'https://api.authly.uz').replace(
  /\/+$/,
  '',
)

// Backend fayl manzilini nisbiy ("/media/...") qaytarsa, API domenini qo'shamiz
export const mediaUrl = (path) => (path?.startsWith('/') ? `${BASE_URL}${path}` : path)

const ACCESS_KEY = 'authly.access'
const REFRESH_KEY = 'authly.refresh'

// localStorage yopiq bo'lishi mumkin (maxfiy oyna va h.k.) — xotirada ham saqlab turamiz
const memory = {}
const storage = {
  get: (key) => {
    try {
      return localStorage.getItem(key) ?? memory[key] ?? null
    } catch {
      return memory[key] ?? null
    }
  },
  set: (key, value) => {
    memory[key] = value
    try {
      if (value == null) localStorage.removeItem(key)
      else localStorage.setItem(key, value)
    } catch {
      // xotiradagisi yetarli
    }
  },
}

export const tokens = {
  get access() {
    return storage.get(ACCESS_KEY)
  },
  get refresh() {
    return storage.get(REFRESH_KEY)
  },
  set({ access, refresh }) {
    if (access) storage.set(ACCESS_KEY, access)
    if (refresh) storage.set(REFRESH_KEY, refresh)
  },
  clear() {
    storage.set(ACCESS_KEY, null)
    storage.set(REFRESH_KEY, null)
  },
}

// Backend javobi o'ralgan: { data, error: { errorId, errorCode, isFriendly, errorMsg, details }, success }
const isEnvelope = (body) =>
  body && typeof body === 'object' && !Array.isArray(body) && 'success' in body && 'data' in body

export class ApiError extends Error {
  constructor(status, body) {
    const error = isEnvelope(body) ? body.error : null
    const fieldMsg = errorMessage(error?.details)
    const generalMsg =
      typeof error?.errorMsg === 'string' && error.errorMsg.trim() ? error.errorMsg.trim() : null

    // Maydon xatosi ("Bu telefon raqam allaqachon...") umumiy matndan aniqroq
    super(fieldMsg ?? generalMsg ?? errorMessage(body) ?? `HTTP ${status}`)
    this.status = status
    this.code = error?.errorCode ?? body?.code ?? null
    this.errorMsg = generalMsg
    this.details = error?.details && typeof error.details === 'object' ? error.details : null
    // Qo'shimcha ma'lumot (masalan, attempts_left) — details ichida yoki body
    this.data = error?.details ?? body
  }
}

// DRF xatolaridan foydalanuvchiga ko'rsatsa bo'ladigan birinchi matnni oladi:
// { detail: '...' } | { message: '...' } | { [field]: '...' } | { [field]: ['...'] } | ['...']
export function errorMessage(data) {
  if (!data) return null
  if (typeof data === 'string') return data.length < 300 ? data : null
  if (Array.isArray(data)) return errorMessage(data[0])
  if (typeof data === 'object') {
    for (const key of ['detail', 'message', 'non_field_errors', 'error']) {
      const msg = errorMessage(data[key])
      if (msg) return msg
    }
    for (const value of Object.values(data)) {
      const msg = errorMessage(value)
      if (msg) return msg
    }
  }
  return null
}

// Har qanday backend xatosidan toza xato matnini oladi
export function getApiErrorMessage(err, fallback = null) {
  if (!err) return fallback
  if (typeof err === 'string') return err

  // 1. err.details yoki err.data bo'lsa (details ichidagi { [field]: 'matn' | ['matn'] })
  if (err.details && typeof err.details === 'object') {
    const fromDetails = errorMessage(err.details)
    if (fromDetails) return fromDetails
  }
  if (err.data && typeof err.data === 'object') {
    const fromData = errorMessage(err.data)
    if (fromData) return fromData
  }

  // 2. err.message (ApiError ichidagi matn)
  if (err.message && !err.message.startsWith('HTTP ')) {
    return err.message
  }

  // 3. err.errorMsg (backend yuborgan umumiy xabar)
  if (err.errorMsg && typeof err.errorMsg === 'string') {
    return err.errorMsg
  }

  return fallback ?? err.message ?? null
}

// Toast sarlavhasi (title) va matnini (message) ajratib oladi:
// Backend yuborgan errorMsg umumiy sarlavha, details ichidagi field xatosi esa asosiy matn bo'ladi.
export function getApiErrorToast(err, { defaultTitle = 'Xatolik', defaultMessage = null } = {}) {
  if (!err) {
    return { title: defaultTitle, message: defaultMessage }
  }
  if (typeof err === 'string') {
    return { title: defaultTitle, message: err }
  }

  const fieldMsg =
    (err.details && typeof err.details === 'object' && errorMessage(err.details)) ||
    (err.data && typeof err.data === 'object' && errorMessage(err.data)) ||
    (err.message && !err.message.startsWith('HTTP ') ? err.message : null)

  const generalMsg =
    typeof err.errorMsg === 'string' && err.errorMsg.trim() ? err.errorMsg.trim() : null

  // 1. Ikkalasi ham mavjud va har xil bo'lsa:
  // Title = generalMsg ("Ma'lumotlarni tekshirishda xatolik yuzaga keldi.")
  // Message = fieldMsg ("Bu telefon raqam allaqachon boshqa akkauntga biriktirilgan.")
  if (generalMsg && fieldMsg && generalMsg !== fieldMsg) {
    return {
      title: generalMsg,
      message: fieldMsg,
    }
  }

  // 2. Faqat maydon xatosi bo'lsa:
  if (fieldMsg) {
    return {
      title: defaultTitle,
      message: fieldMsg,
    }
  }

  // 3. Faqat umumiy xabar bo'lsa:
  if (generalMsg) {
    return {
      title: defaultTitle,
      message: generalMsg,
    }
  }

  // 4. Standart xatolik
  return {
    title: defaultTitle,
    message: defaultMessage ?? err.message ?? null,
  }
}

async function parse(res) {
  if (res.status === 204) return null
  const text = await res.text()
  if (!text) return null
  try {
    return JSON.parse(text)
  } catch {
    return text
  }
}

// Bir vaqtda bir nechta so'rov 401 olsa ham, refresh faqat bir marta yuboriladi
let refreshing = null
function refreshAccess() {
  const refresh = tokens.refresh
  if (!refresh) return Promise.resolve(false)
  refreshing ??= fetch(`${BASE_URL}/api/v1/accounts/auth/token/refresh/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ refresh }),
  })
    .then(async (res) => {
      if (!res.ok) {
        tokens.clear()
        return false
      }
      const body = await parse(res)
      tokens.set(isEnvelope(body) ? body.data : body)
      return true
    })
    .catch(() => false)
    .finally(() => {
      refreshing = null
    })
  return refreshing
}

// body: oddiy obyekt (JSON bo'lib ketadi) yoki FormData (fayl yuklash uchun)
// auth: false — tokensiz (kirish, ro'yxatdan o'tish)
export async function request(path, { method = 'GET', body, query, auth = true } = {}) {
  let url = `${BASE_URL}${path}`
  if (query) {
    const params = new URLSearchParams(
      Object.entries(query).filter(([, v]) => v != null && v !== ''),
    )
    if ([...params].length) url += `?${params}`
  }

  const send = () => {
    const headers = { Accept: 'application/json' }
    const access = auth ? tokens.access : null
    if (access) headers.Authorization = `Bearer ${access}`
    let payload = body
    if (body != null && !(body instanceof FormData)) {
      headers['Content-Type'] = 'application/json'
      payload = JSON.stringify(body)
    }
    return fetch(url, { method, headers, body: payload })
  }

  let res = await send()
  if (res.status === 401 && auth && tokens.refresh && (await refreshAccess())) {
    res = await send()
  }
  // Token yangilanmadi — sessiya tugagan, eski tokenlar "kirgan" deb chalg'itmasin
  if (res.status === 401 && auth) tokens.clear()

  const data = await parse(res)
  if (!res.ok || (isEnvelope(data) && data.success === false)) throw new ApiError(res.status, data)
  return isEnvelope(data) ? data.data : data
}

// Sahifalangan ro'yxatning barcha sahifalarini yig'ib beradi ({ count, next, results })
export async function requestAll(path, query, { auth = true } = {}) {
  const all = []
  let page = 1
  for (;;) {
    const data = await request(path, { query: { ...query, page }, auth })
    if (Array.isArray(data)) return data
    all.push(...(data?.results ?? []))
    if (!data?.next) return all
    page += 1
  }
}
