/**
 * Indonesian Address Service
 * Uses: https://emsifa.github.io/api-wilayah-indonesia
 * Hierarchy: Province -> Regency (Kota/Kabupaten) -> District (Kecamatan) -> Village (Kelurahan/Desa)
 *
 * asyncFunction contract for MyAsyncDropdown:
 *   receives: { search: string, ...extraData }
 *   returns:  Promise<{ loading: boolean, data: Array }>
 */

const BASE_URL = 'https://emsifa.github.io/api-wilayah-indonesia/api'

// Simple in-memory cache to avoid re-fetching static JSON files
const cache = {}

async function fetchCached(url) {
  if (cache[url]) return cache[url]
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Address API error: ${res.status}`)
  const data = await res.json()
  cache[url] = data
  return data
}

/** Normalize a string for case-insensitive search */
const normalize = (str) => str?.toLowerCase().replace(/[^a-z0-9 ]/g, '') ?? ''

/**
 * Search all regencies (Kota/Kabupaten) across all provinces.
 * Fetches all 34 provinces then their regencies; results are cached after first call.
 *
 * @param {{ search: string }} params
 * @returns {Promise<{ loading: boolean, data: Array }>}
 */
export async function searchKota({ search = '' } = {}) {
  try {
    // 1. Fetch all provinces (34 provinces, cached)
    const provinces = await fetchCached(`${BASE_URL}/provinces.json`)

    // 2. Fetch all regencies for every province in parallel (cached per province)
    const allRegencies = (
      await Promise.all(provinces.map((p) => fetchCached(`${BASE_URL}/regencies/${p.id}.json`)))
    ).flat()

    // 3. Filter by search term
    const keyword = normalize(search)
    const data = keyword
      ? allRegencies.filter((r) => normalize(r.name).includes(keyword))
      : allRegencies

    return { loading: false, data: data.slice(0, 50) }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[searchKota]', err)
    return { loading: false, data: [] }
  }
}

/**
 * Search districts (Kecamatan) by regency ID.
 * Requires extraData: { regency_id: string }
 *
 * @param {{ search: string, regency_id: string }} params
 * @returns {Promise<{ loading: boolean, data: Array }>}
 */
export async function searchKecamatan({ search = '', regency_id } = {}) {
  if (!regency_id) return { loading: false, data: [] }

  try {
    const districts = await fetchCached(`${BASE_URL}/districts/${regency_id}.json`)
    const keyword = normalize(search)
    const data = keyword ? districts.filter((d) => normalize(d.name).includes(keyword)) : districts

    return { loading: false, data }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[searchKecamatan]', err)
    return { loading: false, data: [] }
  }
}

/**
 * Search villages (Kelurahan/Desa) by district ID.
 * Requires extraData: { district_id: string }
 *
 * @param {{ search: string, district_id: string }} params
 * @returns {Promise<{ loading: boolean, data: Array }>}
 */
export async function searchKelurahan({ search = '', district_id } = {}) {
  if (!district_id) return { loading: false, data: [] }

  try {
    const villages = await fetchCached(`${BASE_URL}/villages/${district_id}.json`)
    const keyword = normalize(search)
    const data = keyword ? villages.filter((v) => normalize(v.name).includes(keyword)) : villages

    return { loading: false, data }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[searchKelurahan]', err)
    return { loading: false, data: [] }
  }
}
