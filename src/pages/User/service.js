// Utils
import { get, post, patch, remove, download } from '../../services/NetworkUtils'

const Service = {
  getUser: async (params) => await get(`/v1/user-management`, params),
  showUser: async (id) => await get(`/v1/user-management/${id}`),
  getUserDetail: async (id, params) =>
    await get(`/v1/user-management/${id}/detail`, params),
  createUser: async (data) =>
    await post(`/v1/user-management`, data, 'form-data'),
  updateUser: async (id, data) =>
    await patch(`/v1/user-management/${id}`, data, {}, 'form-data'),
  enableUser: async (id) => await patch(`/v1/user-management/${id}/enable`),
  deleteUser: async (body) => await remove('/v1/user-management', body),
  restoreUser: async (body) => patch('/v1/user-management/restore', body),
  downloadExport: (params) => download('/v1/user-management/export', params),

  // option
  searchEauth: async (params) => await get(`/v1/option/eauth-list`, params),
  searchInstitution: async (params) =>
    await get(`/v1/option/institution-list`, params),
  searchBranch: async (params) => await get(`/v1/option/branch-list`, params),
  searchRole: async (params) => await get(`/v1/option/role-list`, params),
}

export default Service
