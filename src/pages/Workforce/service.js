/* eslint-disable import/prefer-default-export */
import { get, post, put, remove, download } from '@src/services/NetworkUtils'

export const WorkforceService = {
  getWorkforce: async (params) => await get('/v1/workforce', params),
  getWorkforceDetail: async (id, params) => await get(`/v1/workforce/${id}`, params),
  createWorkforce: async (data) => await post('/v1/workforce', data),
  updateWorkforce: async (id, data) => await put(`/v1/workforce/${id}`, data),
  deleteWorkforce: async (ids) => await remove('/v1/workforce', { ids }),
  exportWorkforce: (params) => download('/v1/workforce/export', params),
  downloadImportTemplate: () => download('/v1/workforce/import-template'),
  importWorkforce: async (file) => {
    const formData = new FormData()
    formData.append('file', file)
    return await post('/v1/workforce/import', formData, 'form-data')
  },
  // Option lookups for form dropdowns
  getCompanyOptions: async (params) => await get('/v1/option/company-list', params),
  getLevelOptions: async (params) => await get('/v1/settings/employment-level/levels', params),
  getPositionOptions: async (params) => await get('/v1/settings/employment-level/positions', params),
}
