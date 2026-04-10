/* eslint-disable import/prefer-default-export */
import { get, post, put, remove, download } from '@src/services/NetworkUtils'

export const SettingsService = {
  getGeneral: async () => await get('/v1/settings/general'),
  updateGeneral: async (data) => await put('/v1/settings/general', data),

  getRoles: async (params) => await get('/v1/settings/roles', params),
  getRoleDetail: async (id) => await get(`/v1/settings/roles/${id}`),
  createRole: async (data) => await post('/v1/settings/roles', data),
  updateRole: async (id, data) => await put(`/v1/settings/roles/${id}`, data),
  deleteRoles: async (ids) => await remove('/v1/settings/roles', { ids }),
  exportRoles: (params) => download('/v1/settings/roles/export', params),

  getPermissions: async () => await get('/v1/permissions'),

  getUsers: async (params) => await get('/v1/settings/users', params),
  getUserDetail: async (id) => await get(`/v1/settings/users/${id}`),
  createUser: async (data) => await post('/v1/settings/users', data, 'form-data'),
  updateUser: async (id, data) => await put(`/v1/settings/users/${id}`, data, 'form-data'),
  deleteUsers: async (ids) => await remove('/v1/settings/users', { ids }),

  downloadUserTemplate: () => download('/v1/settings/users/import-template'),
  exportUsers: (params) => download('/v1/settings/users/export', params),

  // Options (for dropdowns)
  getOptionRoles: async (params) => await get('/v1/option/role-list', params),
  getOptionStatuses: async (params) => await get('/v1/option/active-status-list', params),
  getOptionCompanies: async (params) => await get('/v1/option/company-list', params),
  getOptionUsers: async (params) => await get('/v1/option/user-list', params),

  // Employment Level
  // level
  getEmploymentLevel: async (params) => await get('/v1/settings/employment-level/levels', params),
  getEmploymentLevelDetail: async (id) => await get(`/v1/settings/employment-level/levels/${id}`),
  createEmploymentLevel: async (data) => await post('/v1/settings/employment-level/levels', data),
  updateEmploymentLevel: async (id, data) => await put(`/v1/settings/employment-level/levels/${id}`, data),
  deleteEmploymentLevel: async (ids) => await remove('/v1/settings/employment-level/levels', { ids }),

  // position
  getEmploymentPosition: async (params) => await get('/v1/settings/employment-level/positions', params),
  getEmploymentPositionDetail: async (id) => await get(`/v1/settings/employment-level/positions/${id}`),
  createEmploymentPosition: async (data) => await post('/v1/settings/employment-level/positions', data),
  updateEmploymentPosition: async (id, data) => await put(`/v1/settings/employment-level/positions/${id}`, data),
  deleteEmploymentPosition: async (ids) => await remove('/v1/settings/employment-level/positions', { ids }),

  // consent editor
  getConsentEditor: async () => await get('/v1/settings/consent-editor'),
  updateConsentEditor: async (data) => await put('/v1/settings/consent-editor', data),
}
