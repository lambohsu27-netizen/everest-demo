import { post, patch } from '../../services/NetworkUtils'

const Service = {
  sendEmail: async (params) => await post('/v1/auth/forgot-password/', params),
  sendOTP: async (body) => await post('/v1/auth/forgot-password/check-otp', body),
  updateForgottenPassword: async (body) => await patch('/v1/auth/forgot-password/update', body),
  resendEmail: async (body) => await post('/v1/auth/forgot-password/resend-otp', body),
}

export default Service
