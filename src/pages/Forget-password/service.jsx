import { post } from '../../services/NetworkUtils'

/** Endpoints aligned with Everest backoffice-service /v1/auth */
const Service = {
  sendEmail: async (params) => await post('/v1/auth/forgot-password', params),
  resendEmail: async (body) => await post('/v1/auth/forgot-password/resend', body),
}

export default Service
