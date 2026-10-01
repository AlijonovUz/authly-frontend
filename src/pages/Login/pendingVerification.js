// Kod kiritish sahifasi odatda Telegram bot kodi bilan kirish uchun. Lekin backend OTP yuborgan
// holatlarda (parol bilan kirishda tasdiqlanmagan raqam/email, telefon bilan ro'yxatdan o'tish)
// shu sahifa o'sha OTP'ni qabul qiladi. Nima kutilayotgani shu yerda saqlanadi.
//
// kind: 'login' — auth/verify/ dan so'ng parol bilan qayta kiriladi
//       'phone' — register/phone/verify/
// Parol sessionStorage'ga yozilmaydi — faqat xotirada turadi.

const KEY = 'passport.pendingVerification'
let password = null
let fallback = null // sessionStorage yopiq bo'lsa

export function setPending({ kind, identifier, password: pass = null }) {
  password = pass
  try {
    sessionStorage.setItem(KEY, JSON.stringify({ kind, identifier }))
  } catch {
    // fallback yetarli
  }
  fallback = { kind, identifier }
}

export function getPending() {
  let saved = fallback
  try {
    saved = JSON.parse(sessionStorage.getItem(KEY)) ?? fallback
  } catch {
    // zaxiradagisi
  }
  if (!saved) return null
  // Sahifa yangilansa parol yo'qoladi — 'login' holatini davom ettirib bo'lmaydi
  if (saved.kind === 'login' && !password) return null
  return { ...saved, password }
}

export function clearPending() {
  password = null
  fallback = null
  try {
    sessionStorage.removeItem(KEY)
  } catch {
    // e'tiborsiz
  }
}
