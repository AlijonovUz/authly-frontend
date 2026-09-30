// TODO: backend API bilan ulash. Hozircha soxta (mock) javoblar qaytaradi.

// Mock rejimida faqat shu kod to'g'ri hisoblanadi
export const DEMO_CODE = '123456'

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

export async function verifyCode(code) {
  await delay(400)
  if (code !== DEMO_CODE) throw new Error('Yaroqsiz kod')
  return { isNewUser: true }
}

export async function saveProfile(profile) {
  await delay(400)
  return profile
}
