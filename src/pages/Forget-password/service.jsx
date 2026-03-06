import { post, patch } from '../../services/NetworkUtils'

const Service = {
  sendEmail: async (params) => await post('/v1/forget-password/', params),
  sendOTP: async (body) => await post('/v1/forget-password/check-otp', body),
  updateForgottenPassword: async (body) =>
    await patch('/v1/forget-password/update', body),
  resendEmail: async (body) =>
    await post('/v1/forget-password/resend-otp', body),
}

export default Service
