import { get, post, put, remove } from '@src/services/NetworkUtils'

export const SettingsService = {
  getGeneral: async () => await get('/v1/settings/general'),
  updateGeneral: async (data) => await put('/v1/settings/general', data),

  getRoles: async (params) => await get('/v1/roles', params),
  getRoleDetail: async (id) => await get(`/v1/roles/${id}`),
  createRole: async (data) => await post('/v1/roles', data),
  updateRole: async (id, data) => await put(`/v1/roles/${id}`, data),
  deleteRoles: async (ids) => await remove('/v1/roles', { ids }),

  getPermissions: async () => await get('/v1/permissions'),

  getUsers: async (params) => await get('/v1/users', params),
  getUserDetail: async (id) => await get(`/v1/users/${id}`),
  createUser: async (data) => await post('/v1/users', data, 'form-data'),
  updateUser: async (id, data) => await put(`/v1/users/${id}`, data, 'form-data'),
  deleteUsers: async (ids) => await remove('/v1/users', { ids }),
}
