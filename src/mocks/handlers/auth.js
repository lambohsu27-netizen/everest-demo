import CryptoJS from 'crypto-js'
import { DEMO_PERMISSIONS, DEMO_USER, DEMO_USER_ID } from '../fixtures/users'
import { MockError, ok } from '../utils'

const DEMO_PASSWORD = 'Everest@2026!'
const DEMO_EMAIL = 'superadmin@everest.io'

const decryptPassword = (encrypted) => {
  if (!encrypted || typeof encrypted !== 'string' || !encrypted.includes(':')) return null
  try {
    const [ivBase64, ciphertextBase64] = encrypted.split(':')
    const key = CryptoJS.enc.Utf8.parse(import.meta.env.VITE_APP_SECRET_KEY)
    const iv = CryptoJS.enc.Base64.parse(ivBase64)
    const ciphertext = CryptoJS.enc.Base64.parse(ciphertextBase64)
    const decrypted = CryptoJS.AES.decrypt({ ciphertext }, key, {
      iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    })
    return decrypted.toString(CryptoJS.enc.Utf8)
  } catch {
    return null
  }
}

const buildToken = (suffix) => {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
  const payload = btoa(
    JSON.stringify({
      sub: DEMO_USER_ID,
      email: DEMO_EMAIL,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
    })
  )
  const signature = `mock-${suffix}-${Math.random().toString(36).slice(2, 10)}`
  return `${header}.${payload}.${signature}`
}

const session = {
  user: DEMO_USER,
  permissions: DEMO_PERMISSIONS,
}

export const authHandlers = {
  'POST /v1/auth/login': ({ body }) => {
    const email = String(body?.email || '').toLowerCase().trim()
    const password = decryptPassword(body?.password)
    if (email !== DEMO_EMAIL.toLowerCase() || password !== DEMO_PASSWORD) {
      throw new MockError(401, {
        status: 'error',
        message: 'Login failed, the email or password you entered is incorrect.',
      })
    }
    return {
      status: 'success',
      message: 'Login successful.',
      user_id: DEMO_USER_ID,
      data: {
        access_token: buildToken('access'),
        refresh_token: buildToken('refresh'),
        user: DEMO_USER,
      },
    }
  },

  'POST /v1/auth/refresh': () => ({
    status: 'success',
    message: 'Token refreshed.',
    data: {
      access_token: buildToken('access'),
      refresh_token: buildToken('refresh'),
    },
  }),

  'POST /v1/auth/logout': () => ok(null, { message: 'Logged out.' }),

  'GET /v1/auth/session': () => ok(session, { message: 'Session loaded.' }),

  'GET /v1/auth/detail': () => ok(DEMO_USER, { message: 'Profile loaded.' }),

  'PATCH /v1/auth/change-password': () => ok(null, { message: 'Password updated.' }),

  'PATCH /v1/auth/update': () => ok(DEMO_USER, { message: 'Profile updated.' }),

  'POST /v1/auth/forgot-password': () => ok(null, { message: 'Recovery email sent.' }),
  'POST /v1/auth/forgot-password/verify-otp': () => ok(null, { message: 'OTP verified.' }),
  'POST /v1/auth/forgot-password/resend': () => ok(null, { message: 'OTP resent.' }),
  'POST /v1/auth/verify-otp': () => ok(null, { message: 'OTP verified.' }),
  'POST /v1/auth/resend-otp': () => ok(null, { message: 'OTP resent.' }),
  'PATCH /v1/auth/reset-password': () => ok(null, { message: 'Password reset.' }),
}
