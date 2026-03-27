/* eslint-disable import/prefer-default-export */
import { post, get, patch } from '../../services/NetworkUtils'

export const LoginService = {
  login: async (data) => await post(`/v1/auth/login`, data),
  detail: async () => await get(`/v1/auth/detail`),
  update: async (data) => await patch(`/v1/auth/update`, data, {}, 'form-data'),
  changePassword: async (data) => await patch(`/v1/auth/change-password`, data),
}
