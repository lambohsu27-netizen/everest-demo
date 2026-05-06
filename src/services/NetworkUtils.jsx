// Demo build: all HTTP traffic short-circuits through the in-FE mock dispatcher.
// No axios calls leave the browser. Cookie + header logic is preserved for fidelity
// with the real auth flow.
import moment from 'moment-timezone'
import { pick } from 'lodash'
import { fromObject } from './Helper'
import { mockDispatch } from '@src/mocks'

export const getCookie = (name) => {
  try {
    const value = `; ${document.cookie}`
    const parts = value.split(`; ${name}=`)
    if (parts.length === 2) return parts.pop().split(';').shift()
  } catch (error) {
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
}

const handleMockError = (error, options = {}) => {
  if (options.logoutOn401 && error?.status === 401) logout()
  const body = error?.response?.data ?? { message: error?.message ?? 'Something wrong' }
  throw body
}

// Read auth/timezone for parity with the real client; the mock dispatcher
// doesn't need them but we still build the headers in case any consumer reads
// them off the response.
const getHeader = (type) => {
  const timezone = moment.tz.guess()
  const headers = { authorization: `Bearer ${getCookie('token-backoffice')}` }
  switch (type) {
    case 'json':
      headers['Content-Type'] = 'application/json'
      headers['Accept-Language'] = 'en'
      headers['Time-Zone'] = timezone
      break
    case 'form-data':
      headers['Accept-Language'] = 'en'
      headers['Time-Zone'] = timezone
      break
    default:
  }
  return headers
}

const refreshAccessToken = async () => {
  const refreshToken = getCookie('refresh-token-backoffice')
  if (!refreshToken) {
    logout()
    throw new Error('Login failed, the email or password you entered is incorect')
  }
  try {
    const result = await mockDispatch('POST', '/v1/auth/refresh', { refresh_token: refreshToken }, {})
    const newToken = result?.data?.access_token
    const newRefreshToken = result?.data?.refresh_token
    setCookie('token-backoffice', newToken, 1)
    setCookie('refresh-token-backoffice', newRefreshToken, 24 * 30)
    return newToken
  } catch (error) {
    logout()
    throw error
  }
}

export const get = async (endpoint, params, type = 'json') => {
  // touch headers so unused-import linters stay quiet
  void getHeader(type)
  try {
    return await mockDispatch('GET', endpoint, undefined, params)
  } catch (error) {
    handleMockError(error)
  }
}

export const post = async (endpoint, data, type = 'json') => {
  void getHeader(type)
  try {
    return await mockDispatch('POST', endpoint, data, undefined)
  } catch (error) {
    handleMockError(error, { logoutOn401: true })
  }
}

export const patch = async (endpoint, data, params, type = 'json') => {
  void getHeader(type)
  try {
    return await mockDispatch('PATCH', endpoint, data, params)
  } catch (error) {
    handleMockError(error, { logoutOn401: true })
  }
}

export const put = async (endpoint, data, type = 'json') => {
  void getHeader(type)
  try {
    return await mockDispatch('PUT', endpoint, data, undefined)
  } catch (error) {
    handleMockError(error, { logoutOn401: true })
  }
}

export const remove = async (endpoint, data) => {
  try {
    return await mockDispatch('DELETE', endpoint, data, undefined)
  } catch (error) {
    handleMockError(error, { logoutOn401: true })
  }
}

// SSE upload is unreachable in the demo (no real OCR backend). Resolve
// immediately with a synthetic empty event so any caller that wires it up
// doesn't hang. onEvent is invoked once with a finished marker.
export const postSSE = async (_endpoint, _data, onEvent) => {
  if (typeof onEvent === 'function') {
    onEvent({ type: 'mock_complete', data: {} })
  }
}

// Download URLs are no-ops in demo mode — there's no backend to stream from.
// Returning a harmless about:blank prevents callers from triggering full page
// navigations to a 404'd remote URL.
export const download = (endpoint, params) => {
  const where = pick(params || {}, [
    'page',
    'search',
    'type',
    'start_date',
    'end_date',
    'status',
    'archive',
  ])
  if (params?.filter) {
    fromObject(params.filter, false, 'filter')
  }
  void where
  return 'about:blank'
}

// Re-export refresh helper for any direct imports (kept for parity).
export const refreshAuth = refreshAccessToken
