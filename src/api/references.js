import { requestAll } from './client.js'

// Ma'lumotnomalar ochiq: token yuborilmaydi — eskirgan token bilan ro'yxat bo'sh qolmasin.
// [{ id, name }] — tartib backend'dagidek
export async function getRegions() {
  const list = await requestAll('/api/v1/references/regions/', undefined, { auth: false })
  return list.map(({ id, name }) => ({ id, name }))
}

export async function getDistricts(regionId) {
  const list = await requestAll('/api/v1/references/districts/', { region: regionId }, { auth: false })
  return list.map(({ id, name }) => ({ id, name }))
}
