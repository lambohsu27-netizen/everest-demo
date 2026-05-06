export class MockError extends Error {
  constructor(status, body) {
    super(body?.message || 'Mock error')
    this.status = status
    this.response = { status, data: body }
  }
}

export const ok = (data, extra = {}) => ({ status: 'success', message: 'OK', data, ...extra })
export const okList = (rows, page, limit, total, extras = {}) => {
  const totalPage = Math.max(1, Math.ceil((total ?? rows.length) / limit))
  return {
    status: 'success',
    message: 'OK',
    data: rows,
    meta: {
      current_page: page,
      per_page: limit,
      prev_page: page > 1 ? page - 1 : null,
      next_page: page < totalPage ? page + 1 : null,
      total: total ?? rows.length,
      total_page: totalPage,
    },
    filter: [],
    ...extras,
  }
}

export const paginate = (rows, page = 1, limit = 10) => {
  const p = Number(page) || 1
  const l = Number(limit) || 10
  const start = (p - 1) * l
  return rows.slice(start, start + l)
}

export const matchesSearch = (haystack, needle) => {
  if (!needle) return true
  const lower = String(needle).toLowerCase()
  return Object.values(haystack || {})
    .filter((v) => typeof v === 'string' || typeof v === 'number')
    .some((v) => String(v).toLowerCase().includes(lower))
}

export const sortBy = (rows, field, order) => {
  if (!field) return rows
  const sign = order === 'asc' ? 1 : -1
  return [...rows].sort((a, b) => {
    const va = a?.[field]
    const vb = b?.[field]
    if (va == null) return 1
    if (vb == null) return -1
    if (va > vb) return sign
    if (va < vb) return -sign
    return 0
  })
}

export const pickBody = (body) => {
  if (!body) return {}
  if (body instanceof FormData) {
    const obj = {}
    body.forEach((value, key) => {
      obj[key] = value
    })
    return obj
  }
  return body
}
