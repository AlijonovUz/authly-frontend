import { request } from './client.js'

const APPS_ENDPOINT = '/api/v1/sso/developer/applications/'
const WEBHOOKS_ENDPOINT = '/api/v1/sso/developer/webhooks/'

// In-flight so'rovlarni deduplikatsiya qilish (bir xil so'rov bir vaqtda qayta ketmasligi uchun)
const inFlightRequests = new Map()

/**
 * Foydalanuvchining OAuth2 ilovalar ro'yxatini olish (sahifalangan)
 */
export async function getDeveloperApplications({ page = 1 } = {}) {
  const key = `apps_page_${page}`
  if (inFlightRequests.has(key)) {
    return inFlightRequests.get(key)
  }

  const promise = request(APPS_ENDPOINT, {
    method: 'GET',
    query: { page },
  }).finally(() => {
    inFlightRequests.delete(key)
  })

  inFlightRequests.set(key, promise)
  return promise
}

/**
 * Yangi OAuth2 ilova yaratish
 * @param {{ name: string, redirect_uris: string }} data
 */
export async function createDeveloperApplication({ name, redirect_uris }) {
  return request(APPS_ENDPOINT, {
    method: 'POST',
    body: {
      name: name.trim(),
      redirect_uris: redirect_uris.trim(),
    },
  })
}

/**
 * Ilova tafsilotlarini olish (client_id, client_secret, webhook_info)
 * @param {number|string} id
 */
export async function getDeveloperApplication(id) {
  const key = `app_detail_${id}`
  if (inFlightRequests.has(key)) {
    return inFlightRequests.get(key)
  }

  const promise = request(`${APPS_ENDPOINT}${id}/`, {
    method: 'GET',
  }).finally(() => {
    inFlightRequests.delete(key)
  })

  inFlightRequests.set(key, promise)
  return promise
}

/**
 * Ilova ma'lumotlarini qisman yangilash (name, redirect_uris)
 * @param {number|string} id
 * @param {{ name?: string, redirect_uris?: string }} data
 */
export async function updateDeveloperApplication(id, data) {
  const body = {}
  if (data.name !== undefined) body.name = data.name.trim()
  if (data.redirect_uris !== undefined) body.redirect_uris = data.redirect_uris.trim()

  return request(`${APPS_ENDPOINT}${id}/`, {
    method: 'PATCH',
    body,
  })
}

/**
 * Ilovani o'chirish
 * @param {number|string} id
 */
export async function deleteDeveloperApplication(id) {
  return request(`${APPS_ENDPOINT}${id}/`, {
    method: 'DELETE',
  })
}

/**
 * Ilovaning client_secret kalitini yangilash (reset)
 * @param {number|string} id
 */
export async function resetDeveloperApplicationSecret(id) {
  return request(`${APPS_ENDPOINT}${id}/reset-secret/`, {
    method: 'POST',
    body: {},
  })
}

// ----------------------------------------------------
// Webhooks API
// ----------------------------------------------------

/**
 * Foydalanuvchining barcha webhooklarini olish
 */
export async function getDeveloperWebhooks({ page = 1 } = {}) {
  const key = `webhooks_page_${page}`
  if (inFlightRequests.has(key)) {
    return inFlightRequests.get(key)
  }

  const promise = request(WEBHOOKS_ENDPOINT, {
    method: 'GET',
    query: { page },
  }).finally(() => {
    inFlightRequests.delete(key)
  })

  inFlightRequests.set(key, promise)
  return promise
}

/**
 * Tanlangan ilovaga webhook biriktirish
 * @param {{ application: number|string, url: string }} data
 */
export async function createDeveloperWebhook({ application, url }) {
  return request(WEBHOOKS_ENDPOINT, {
    method: 'POST',
    body: {
      application: Number(application),
      url: url.trim(),
    },
  })
}

/**
 * Webhook tafsilotlarini olish
 * @param {string} id
 */
export async function getDeveloperWebhook(id) {
  return request(`${WEBHOOKS_ENDPOINT}${id}/`, {
    method: 'GET',
  })
}

/**
 * Webhookni tahrirlash (url, is_active)
 * @param {string} id
 * @param {{ url?: string, is_active?: boolean }} data
 */
export async function updateDeveloperWebhook(id, data) {
  const body = {}
  if (data.url !== undefined) body.url = data.url.trim()
  if (data.is_active !== undefined) body.is_active = Boolean(data.is_active)

  return request(`${WEBHOOKS_ENDPOINT}${id}/`, {
    method: 'PATCH',
    body,
  })
}

/**
 * Webhookni o'chirish
 * @param {string} id
 */
export async function deleteDeveloperWebhook(id) {
  return request(`${WEBHOOKS_ENDPOINT}${id}/`, {
    method: 'DELETE',
  })
}

/**
 * Webhook HMAC Secretini yangilash
 * @param {string} id
 */
export async function resetDeveloperWebhookSecret(id) {
  return request(`${WEBHOOKS_ENDPOINT}${id}/reset-secret/`, {
    method: 'POST',
    body: {},
  })
}

/**
 * Webhook yetkazilish loglarini (delivery logs) sahifalangan holda olish
 * GET /api/v1/sso/developer/webhooks/{id}/logs/?page=1
 * @param {string|number} id
 * @param {{ page?: number }} params
 */
export async function getDeveloperWebhookLogs(id, { page = 1 } = {}) {
  const key = `webhook_logs_${id}_${page}`
  if (inFlightRequests.has(key)) {
    return inFlightRequests.get(key)
  }

  const promise = request(`${WEBHOOKS_ENDPOINT}${id}/logs/`, {
    method: 'GET',
    query: { page },
  }).finally(() => {
    inFlightRequests.delete(key)
  })

  inFlightRequests.set(key, promise)
  return promise
}
