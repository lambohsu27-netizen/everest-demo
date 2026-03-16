/* eslint-disable import/prefer-default-export */
import { post, get, patch } from '../../services/NetworkUtils'

export const RegisterService = {
  register: async (data) => await post(`/v1/auth/`, data),
  detail: async () => await get(`/v1/auth/detail`),
  update: async (data) => await patch(`/v1/auth/update`, data, {}, 'form-data'),
  changePassword: async (data) => await patch(`/v1/auth/change-password`, data),
}
