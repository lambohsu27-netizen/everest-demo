import { post, get, patch } from '../../services/NetworkUtils'

const HOMEPAGE = import.meta.env.VITE_HOMEPAGE

export const LoginService = {
  // login: async (data) => await post(`/${HOMEPAGE}/v1/auth/`, data),
  login: async (data) => await post(`/v1/auth/`, data),
  detail: async () => await get(`/v1/auth/detail`),
  update: async (data) => await patch(`/v1/auth/update`, data, {}, 'form-data'),
  changePassword: async (data) => await patch(`/v1/auth/change-password`, data),
}
