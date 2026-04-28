import { post } from '../../services/NetworkUtils'

/** Endpoints aligned with Everest backoffice-service /v1/auth */
const Service = {
  sendEmail: async (params) => await post('/v1/auth/forgot-password', params),
  sendOTP: async (body) => await post('/v1/auth/verify-otp', body),
  verifyForgotPasswordOtp: async (body) => await post('/v1/auth/forgot-password/verify-otp', body),
  updateForgottenPassword: async (body) => await patch('/v1/auth/reset-password', body),
  resendEmail: async (body) => await post('/v1/auth/forgot-password/resend', body),
}

export default Service
