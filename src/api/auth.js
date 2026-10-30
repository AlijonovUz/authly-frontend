import { request, tokens } from './client.js'

const AUTH = '/api/v1/accounts/auth'

// Javobdagi tokenlarni saqlaydi. Backend ularni turlicha qaytarishi mumkin:
// { access, refresh } | { access_token, refresh_token } | { tokens: {...} } | { token: {...} }
function saveTokens(data) {
  const raw = data?.tokens ?? data?.token ?? data
  const pair = { access: raw?.access ?? raw?.access_token, refresh: raw?.refresh ?? raw?.refresh_token }
  if (pair.access) tokens.set(pair)
  return Boolean(pair.access)
}

export const isLoggedIn = () => Boolean(tokens.access)

// Telegram bot yuborgan 6 xonali kod bilan kirish (yangi foydalanuvchi ham shu yo'l bilan yaratiladi)
export async function telegramLogin(code) {
  const data = await request(`${AUTH}/telegram/login/`, {
    method: 'POST',
    body: { code },
    auth: false,
  })
  if (!saveTokens(data)) throw new Error('Token qaytmadi')
  return data
}

// Google id_token bilan kirish (yangi foydalanuvchi ham shu yo'l bilan yaratiladi)
export async function googleLogin(idToken) {
  const data = await request(`${AUTH}/google/login/`, {
    method: 'POST',
    body: { id_token: idToken },
    auth: false,
  })
  if (!saveTokens(data)) throw new Error('Token qaytmadi')
  return data
}

// Tizimdan chiqish (refresh tokenni blacklistga kiritish va xotirani tozalash)
export async function logout() {
  const refresh = tokens.refresh
  try {
    if (refresh) await request(`${AUTH}/logout/`, { method: 'POST', body: { refresh } })
  } finally {
    tokens.clear()
  }
}

// Joriy foydalanuvchi profilini olish
export const getMe = () => request('/api/v1/accounts/me/')

// Profilda viloyat, tuman va tug'ilgan sana bo'lsa — to'ldirilgan hisoblanadi
export const isProfileComplete = (me) =>
  Boolean(me?.first_name && me?.last_name && me?.region_info && me?.district_info && me?.birth_date)

// Profil ma'lumotlarini yangilash
export function saveProfile({ firstName, lastName, region, district, birthDate, photo }) {
  const [d, m, y] = birthDate.split('.')
  const fields = {
    first_name: firstName.trim(),
    last_name: lastName.trim(),
    region,
    district,
    birth_date: `${y}-${m}-${d}`,
  }

  // Surat bo'lsa multipart, bo'lmasa oddiy JSON
  let body = fields
  if (photo) {
    body = new FormData()
    Object.entries(fields).forEach(([key, value]) => body.append(key, value))
    body.append('avatar', photo)
  }
  return request('/api/v1/accounts/me/', { method: 'PATCH', body })
}

// Profilga telefon raqam bog'lash (Telegram botdan olingan kod bilan)
export function linkPhone(code) {
  return request('/api/v1/accounts/me/phone/link/', {
    method: 'POST',
    body: { code },
  })
}

// Profilga Google akkauntini bog'lash
export function linkGoogle(idToken) {
  return request('/api/v1/accounts/me/google/link/', {
    method: 'POST',
    body: { id_token: idToken },
  })
}

// Tokenni tekshirish
export function verifyToken(token) {
  return request(`${AUTH}/token/verify/`, {
    method: 'POST',
    body: { token },
    auth: false,
  })
}

// --- Eski / bekor qilingan endpointlar (eski formalar import xatosi bermasligi uchun stublar) ---
export const login = () => Promise.reject(new Error('Parol orqali kirish backendda qo‘llab-quvvatlanmaydi'))
export const verifyIdentifier = () => Promise.reject(new Error('Ushbu amal backendda mavjud emas'))
export const registerPhone = () => Promise.reject(new Error('Ushbu amal backendda mavjud emas'))
export const verifyRegisterPhone = () => Promise.reject(new Error('Ushbu amal backendda mavjud emas'))
export const registerEmail = () => Promise.reject(new Error('Ushbu amal backendda mavjud emas'))
export const verifyRegisterEmail = () => Promise.reject(new Error('Ushbu amal backendda mavjud emas'))
