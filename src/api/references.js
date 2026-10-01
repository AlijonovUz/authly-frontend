import { requestAll } from './client.js'

// [{ id, name }] — tartib backend'dagidek
export async function getRegions() {
  const list = await requestAll('/api/v1/references/regions/')
  return list.map(({ id, name }) => ({ id, name }))
}

export async function getDistricts(regionId) {
  const list = await requestAll('/api/v1/references/districts/', { region: regionId })
  return list.map(({ id, name }) => ({ id, name }))
}
