import { get, post, put, remove } from '@src/services/NetworkUtils'

export const SettingsService = {
  getGeneral: async () => await get('/v1/settings/general'),
  updateGeneral: async (data) => await put('/v1/settings/general', data),

  getRoles: async (params) => await get('/v1/settings/roles', params),
  getRoleDetail: async (id) => await get(`/v1/settings/roles/${id}`),
  createRole: async (data) => await post('/v1/settings/roles', data),
  updateRole: async (id, data) => await put(`/v1/settings/roles/${id}`, data),
  deleteRoles: async (ids) => await remove('/v1/settings/roles', { ids }),

  getPermissions: async () => await get('/v1/permissions'),

  getUsers: async (params) => await get('/v1/settings/users', params),
  getUserDetail: async (id) => await get(`/v1/settings/users/${id}`),
  createUser: async (data) => await post('/v1/settings/users', data, 'form-data'),
  updateUser: async (id, data) => await put(`/v1/settings/users/${id}`, data, 'form-data'),
  deleteUsers: async (ids) => await remove('/v1/settings/users', { ids }),
}
