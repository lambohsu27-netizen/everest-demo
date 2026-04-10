/* eslint-disable import/prefer-default-export */
import { get, post, put, remove, download } from '@src/services/NetworkUtils'

export const CompanyService = {
  getCompany: async (params) => await get('/v1/company', params),
  getDetailCompany: async (id) => await get(`/v1/company/${id}`),
  createCompany: async (data) => await post('/v1/company', data),
  updateCompany: async (id, data) => await put(`/v1/company/${id}`, data),
  deleteCompany: async (ids) => await remove('/v1/company', { ids }),
  exportCompany: (params) => download('/v1/company/export', params),
}
