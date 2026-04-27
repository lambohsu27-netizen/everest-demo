import { get, post, patch, remove, download } from '../../services/NetworkUtils'

const Service = {
  getList: async (params) => await get('/v1/report-enquiry', params),
  show: async (id, params) => await get(`/v1/report-enquiry/${id}`, params),
  create: async (data) => await post('/v1/report-enquiry', data),
  import: async (data) => await post('/v1/report-enquiry/import', data, 'form-data'),
  delete: async (body) => await remove('/v1/report-enquiry', body),
  getEmployees: async (params) =>
    await get('/v1/report-enquiry/employees', params),
  getEmployeeDetail: async (id, params) =>
    await get(`/v1/report-enquiry/employees/${id}`, params),

  // Export
  downloadExport: (params) => download('/v1/report-enquiry/export', params),

  // Actions
  cancel: async (id) => await patch(`/v1/report-enquiry/${id}/cancel`),
  resend: async (id) => await patch(`/v1/report-enquiry/${id}/resend`),
  reject: async (id, data) => await patch(`/v1/report-enquiry/${id}/reject`, data),
  submit: async (id) => await patch(`/v1/report-enquiry/${id}/submit`),

  // Options
  getCompanyOptions: async (params) =>
    await get('/v1/option/my-company-list', params),
  getLevelOptions: async (params) =>
    await get('/v1/settings/employment-level/levels', params),
  getPositionOptions: async (params) =>
    await get('/v1/settings/employment-level/positions', params),
}

export default Service
