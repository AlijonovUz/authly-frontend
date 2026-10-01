// Backend bilan ishlash uchun umumiy fetch o'rami: manzil, JWT token, token yangilash va xatolar.

// Masalan: VITE_API_URL=https://api.example.uz  (bo'sh bo'lsa — shu domenning o'zi, /api/...)
// .env bo'lmasa yoki qiymat bo'sh bo'lsa (masalan, serverda build qilinganda) — production backend.
// Bo'sh qolsa so'rov frontend domeniga ketib, nginx 405 qaytaradi.
const BASE_URL = (import.meta.env.VITE_API_URL || 'https://backend-passport.raqamlinazorat.uz').replace(
  /\/+$/,
  '',
)

// Backend fayl manzilini nisbiy ("/media/...") qaytarsa, API domenini qo'shamiz
export const mediaUrl = (path) => (path?.startsWith('/') ? `${BASE_URL}${path}` : path)

const ACCESS_KEY = 'passport.access'
const REFRESH_KEY = 'passport.refresh'

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
    // Maydon xatosi ("Kod noto'g'ri yoki muddati o'tgan.") umumiy matndan aniqroq
    super(errorMessage(error?.details) ?? error?.errorMsg ?? errorMessage(body) ?? `HTTP ${status}`)
    this.status = status
    this.code = error?.errorCode ?? body?.code ?? null
    // Qo'shimcha ma'lumot (masalan, attempts_left) — details ichida
    this.data = error?.details ?? body
  }
}

// DRF xatolaridan foydalanuvchiga ko'rsatsa bo'ladigan birinchi matnni oladi:
// { detail: '...' } | { message: '...' } | { field: ['...'] } | ['...']
function errorMessage(data) {
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
