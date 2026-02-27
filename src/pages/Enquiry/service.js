// Utils
import { get, post, patch, remove, download } from '../../services/NetworkUtils'

const Service = {
  getEnquiry: async (params) => await get(`/v1/inquiry`, params),
  showEnquiry: async (id) => await get(`/v1/inquiry/${id}`),
  getEnquiryDetail: async (id, params) => await get(`/v1/inquiry/${id}/detail`, params),
  createEnquiry: async (data) => await post(`/v1/inquiry`, data, 'form-data'),
  updateEnquiry: async (id, data) => await patch(`/v1/inquiry/${id}`, data, {}, 'form-data'),
  enableEnquiry: async (id) => await patch(`/v1/inquiry/${id}/enable`),
  deleteEnquiry: async (body) => await remove('/v1/inquiry', body),
  restoreEnquiry: async (body) => patch('/v1/inquiry/restore', body),
  downloadExport: (params) => download('/v1/inquiry/export', params),

  // option
  searchEauth: async (params) => await get(`/v1/option/eauth-list`, params),
  searchInstitution: async (params) => await get(`/v1/option/institution-list`, params),
  searchBranch: async (params) => await get(`/v1/option/branch-list`, params),
  searchRole: async (params) => await get(`/v1/option/role-list`, params),
}

export default Service
