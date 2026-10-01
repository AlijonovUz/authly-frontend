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

// Parol bilan kirish. Telefon/email tasdiqlanmagan bo'lsa backend OTP yuborib 403 qaytaradi —
// bunday holatda xato `verificationRequired: true` bilan otiladi.
export async function login(phoneOrEmail, password) {
  try {
    const data = await request(`${AUTH}/login/`, {
      method: 'POST',
      body: { phone_or_email: phoneOrEmail, password },
      auth: false,
    })
    if (!saveTokens(data)) throw new Error('Token qaytmadi')
    return data
  } catch (err) {
    if (err.status === 403 && err.code === 'verification_required') err.verificationRequired = true
    throw err
  }
}

// Kirishda yuborilgan OTP bilan telefon/emailni tasdiqlaydi (token bermaydi)
export function verifyIdentifier(phoneOrEmail, code) {
  return request(`${AUTH}/verify/`, {
    method: 'POST',
    body: { phone_or_email: phoneOrEmail, code },
    auth: false,
  })
}

// Telefon bilan ro'yxatdan o'tish: OTP Telegram bot orqali keladi.
// Raqam botga bog'lanmagan bo'lsa javobda bot_url bo'ladi.
export function registerPhone({ firstName, lastName, phone, password }) {
  return request(`${AUTH}/register/phone/`, {
    method: 'POST',
    body: { first_name: firstName, last_name: lastName, phone_number: phone, password },
    auth: false,
  })
}

// Telefon OTP'ni tasdiqlab foydalanuvchini yaratadi. Token qaytsa — saqlanadi (true)
export async function verifyRegisterPhone(phone, code) {
  const data = await request(`${AUTH}/register/phone/verify/`, {
    method: 'POST',
    body: { phone_number: phone, code },
    auth: false,
  })
  return saveTokens(data)
}

export function registerEmail({ firstName, lastName, email, password }) {
  return request(`${AUTH}/register/email/`, {
    method: 'POST',
    body: { first_name: firstName, last_name: lastName, email, password },
    auth: false,
  })
}

export async function verifyRegisterEmail(email, code) {
  const data = await request(`${AUTH}/register/email/verify/`, {
    method: 'POST',
    body: { email, code },
    auth: false,
  })
  return saveTokens(data)
}

export async function logout() {
  const refresh = tokens.refresh
  try {
    if (refresh) await request(`${AUTH}/logout/`, { method: 'POST', body: { refresh } })
  } finally {
    tokens.clear()
  }
}

export const getMe = () => request('/api/v1/accounts/me/')

// Profilda viloyat, tuman va tug'ilgan sana bo'lsa — to'ldirilgan hisoblanadi
export const isProfileComplete = (me) =>
  Boolean(me?.first_name && me?.last_name && me?.region_info && me?.district_info && me?.birth_date)

// profile: { firstName, lastName, region (uuid), district (uuid), birthDate: 'KK.OO.YYYY', photo: File|null }
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
