import { get, put } from '@src/services/NetworkUtils'

export const SettingsService = {
  getGeneral: async () => await get('/v1/settings/general'),
  updateGeneral: async (data) => await put('/v1/settings/general', data),
}
