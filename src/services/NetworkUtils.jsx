import axios from 'axios'
import moment from 'moment-timezone'
import { pick } from 'lodash'
import { fromObject } from './Helper'

// import { getClientLocation } from './getClientLocation'

const baseURL = import.meta.env.VITE_API_BASE_URL
export const instance = axios.create({ baseURL })
const refreshInstance = axios.create({ baseURL })

// ─── GEOLOCATION INTERCEPTOR ────────────────────────────────────────────────
// cache last–known coords for this tab
/* let _cachedGeo = null

instance.interceptors.request.use(
  async (config) => {
    // only look up once
    if (_cachedGeo === null) {
      _cachedGeo = await getClientLocation().catch(() => null)
    }

    if (_cachedGeo) {
      const { latitude, longitude } = _cachedGeo
      // use a custom header; adjust name to taste
      config.headers['X-Geolocation'] = `${latitude},${longitude}`
    }

    return config
  },
  (error) => Promise.reject(error)
) */
// ─────────────────────────────────────────────────────────────────────────────

export const getCookie = (name) => {
  try {
    const value = `; ${document.cookie}`
    const parts = value.split(`; ${name}=`)
    if (parts.length === 2) return parts.pop().split(';').shift()
  } catch (error) {
    // console.log('getCookie', error)
    return null
  }
  return null
}

export const setCookie = (key, value, expiry) => {
  const expires = new Date()
  expires.setTime(expires.getTime() + expiry * 60 * 60 * 1000)
  document.cookie = `${key}=${value};expires=${expires.toUTCString()};path=/`
}

const logout = () => {
  setCookie('token-backoffice', null, '-1')
  setCookie('refresh-token-backoffice', null, '-1')
  window.location.href = '/login'
}

// ─── SILENT REFRESH ──────────────────────────────────────────────────────────
let isRefreshing = false
let failedQueue = []

const processQueue = (error, token = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error)
    else resolve(token)
  })
  failedQueue = []
}

instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error)
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject })
      })
        .then((token) => {
          originalRequest.headers.authorization = `Bearer ${token}`
          return instance(originalRequest)
        })
        .catch((err) => Promise.reject(err))
    }

    originalRequest._retry = true
    isRefreshing = true

    const refreshToken = getCookie('refresh-token-backoffice')
    if (!refreshToken) {
      isRefreshing = false
      logout()
      return Promise.reject(error)
    }

    try {
      const { data } = await refreshInstance.post('/v1/auth/refresh', {
        refresh_token: refreshToken,
      })
      const newToken = data?.data?.access_token
      const newRefreshToken = data?.data?.refresh_token

      setCookie('token-backoffice', newToken, 1)
      setCookie('refresh-token-backoffice', newRefreshToken, 24 * 30)

      instance.defaults.headers.common.authorization = `Bearer ${newToken}`
      originalRequest.headers.authorization = `Bearer ${newToken}`
      processQueue(null, newToken)
      return instance(originalRequest)
    } catch (refreshError) {
      processQueue(refreshError, null)
      logout()
      return Promise.reject(refreshError)
    } finally {
      isRefreshing = false
    }
  }
)
// ─────────────────────────────────────────────────────────────────────────────

const getHeader = (type) => {
  const timezone = moment.tz.guess()
  let headers = { authorization: `Bearer ${getCookie('token-backoffice')}` }
  switch (type) {
    case 'json': {
      headers = {
        ...headers,
        'Content-Type': 'application/json',
        'Accept-Language': 'en',
        'Time-Zone': timezone,
      }
      break
    }
    case 'form-data': {
      // Do NOT set Content-Type for FormData – axios sets multipart/form-data with boundary automatically.
      // Setting application/x-www-form-urlencoded breaks file uploads (multer cannot parse the file).
      headers = {
        ...headers,
        'Accept-Language': 'en',
        'Time-Zone': timezone,
      }
      break
    }
    default:
  }
  return headers
}

export const get = async (endpoint, params, type = 'json', timeout = 60000) => {
  try {
    const headers = getHeader(type)
    const url = `${baseURL}${endpoint}`
    const response = await instance.get(url, { headers, params, timeout })
    return response.data
  } catch (error) {
    // if (error.response?.status === 401) logout()
    throw error.response?.data ?? { message: error.message ?? 'Something wrong' }
  }
}

export const post = async (
  endpoint,
  data,
  type = 'json',
  timeout = 60 * 60 * 6000,
  config = {}
) => {
  try {
    const headers = getHeader(type)
    const url = `${baseURL}${endpoint}`

    const response = await instance.post(url, data, {
      headers,
      timeout,
      ...config,
    })
    return response.data
  } catch (error) {
    if (error.response?.status === 401) logout()
    throw error.response?.data ?? { message: error.message ?? 'Something wrong' }
  }
}

export const patch = async (
  endpoint,
  data,
  params,
  type = 'json',
  timeout = 60 * 60 * 6000,
  config = {}
) => {
  try {
    const headers = getHeader(type)
    const url = `${baseURL}${endpoint}`
    const response = await instance.patch(url, data, {
      headers,
      params,
      timeout,
      ...config,
    })
    return response.data
  } catch (error) {
    if (error.response?.status === 401) logout()
    throw error.response?.data ?? { message: error.message ?? 'Something wrong' }
  }
}

export const remove = async (endpoint, data, timeout = 60000) => {
  try {
    const headers = { authorization: `Bearer ${getCookie('token-backoffice')}` }
    const url = `${baseURL}${endpoint}`
    const response = await instance.delete(url, { headers, timeout, data })
    return response.data
  } catch (error) {
    if (error.response?.status === 401) logout()
    throw (
      error.response?.data ?? {
        message: error.message ?? 'Something went wrong',
      }
    )
  }
}

// export const download = (endpoint, params) => {
//   let url = `${baseURL}${endpoint}?token=${getCookie('token-backoffice')}`
//   if (params) {
//     const newParams = { ...params }
//     delete newParams.filter
//     Object.keys(newParams).forEach((key) => {
//       url += `&${key}=${newParams[key] ?? ''}`
//     })
//   }
//   return url
// }

// export const download = (endpoint, params) => {
//   var url = `${baseURL}${endpoint}?token=${getCookie('token-backoffice')}`
//   var where = {
//     ...pick(params, ['page', 'search']),
//   }
//   if (params && where)
//     Object.keys(where).forEach((key) => {
//       url += `&${key}=${where[key] ?? ''}`
//     })
//   if (params?.filter && params?.filter?.length != 0) {
//     console.log('filter[0]' + fromObject(params.filter).slice(1))
//     url +=
//       '&filter[0]' +
//       fromObject(params.filter).slice(1).replace(/&0/g, '&filter[0]')
//   }

//   console.log(`url_download: ${url}`)
//   return url
// }

export const download = (endpoint, params) => {
  let url = `${baseURL}${endpoint}?token=${getCookie('token-backoffice')}`
  const where = {
    ...pick(params, [
      'page',
      'search',
      'type',
      'start_date',
      'end_date',
      'status',
      'archive',
    ]),
  }

  if (params && where) {
    Object.keys(where).forEach((key) => {
      const value = where[key] ?? ''
      if (String(value).trim() !== '' || key === 'search') {
        url += `&${key}=${encodeURIComponent(value)}`
      }
    })
  }

  if (params?.filter && params?.filter?.length !== 0) {
    let filterQueryString = fromObject(params.filter, false, 'filter')

    if (filterQueryString.endsWith('&')) {
      filterQueryString = filterQueryString.slice(0, -1)
    }

    if (filterQueryString) {
      url += `&${filterQueryString}`
    }
  }

  // console.log(`url_download: ${url}`)
  return url
}
