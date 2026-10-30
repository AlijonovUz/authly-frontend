import { requestAll } from './client.js'

const REGIONS_KEY = 'authly.regions'
const DISTRICTS_KEY = 'authly.districts'

let cachedRegionsMem = null
const cachedDistrictsMem = {}

export function getCachedRegions() {
  if (cachedRegionsMem) return cachedRegionsMem
  try {
    const raw = localStorage.getItem(REGIONS_KEY)
    if (raw) {
      cachedRegionsMem = JSON.parse(raw)
      return cachedRegionsMem
    }
  } catch {}
  return []
}

export function getCachedDistricts(regionId) {
  if (!regionId) return []
  if (cachedDistrictsMem[regionId]) return cachedDistrictsMem[regionId]
  try {
    const raw = localStorage.getItem(`${DISTRICTS_KEY}.${regionId}`)
    if (raw) {
      cachedDistrictsMem[regionId] = JSON.parse(raw)
      return cachedDistrictsMem[regionId]
    }
  } catch {}
  return []
}

// Ma'lumotnomalar ochiq: token yuborilmaydi — eskirgan token bilan ro'yxat bo'sh qolmasin.
// [{ id, name }] — tartib backend'dagidek
export async function getRegions() {
  try {
    const list = await requestAll('/api/v1/references/regions/', undefined, { auth: false })
    const mapped = list.map(({ id, name }) => ({ id, name }))
    cachedRegionsMem = mapped
    try {
      localStorage.setItem(REGIONS_KEY, JSON.stringify(mapped))
    } catch {}
    return mapped
  } catch (err) {
    const cached = getCachedRegions()
    if (cached.length) return cached
    throw err
  }
}

export async function getDistricts(regionId) {
  if (!regionId) return []
  try {
    const list = await requestAll('/api/v1/references/districts/', { region: regionId }, { auth: false })
    const mapped = list.map(({ id, name }) => ({ id, name }))
    cachedDistrictsMem[regionId] = mapped
    try {
      localStorage.setItem(`${DISTRICTS_KEY}.${regionId}`, JSON.stringify(mapped))
    } catch {}
    return mapped
  } catch (err) {
    const cached = getCachedDistricts(regionId)
    if (cached.length) return cached
    throw err
  }
}
