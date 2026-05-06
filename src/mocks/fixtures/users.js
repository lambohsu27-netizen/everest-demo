import { Access } from '@src/services/Helper'

export const DEMO_USER_ID = 'u0000001-0000-0000-0000-000000000001'

const SUB_PERMS = ['view', 'add_new', 'edit', 'delete']

export const DEMO_USER = {
  id: DEMO_USER_ID,
  name: 'Super Admin',
  username: 'superadmin',
  email: 'superadmin@everest.io',
  whatsapp: '+62 812 3456 7890',
  avatar_url: null,
  photo_url: null,
  role: { id: 'role-superadmin', name: 'Super Admin' },
  company: null,
  status: 'active',
  is_active: true,
  created_at: '2025-04-01T00:00:00Z',
  updated_at: '2026-05-01T00:00:00Z',
}

export const DEMO_PERMISSIONS = Object.values(Access).map((moduleKey) => ({
  module_key: moduleKey,
  sub_permissions: SUB_PERMS,
}))
