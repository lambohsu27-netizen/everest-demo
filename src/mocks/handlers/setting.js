import {
  GENERAL_SETTINGS,
  EMPLOYMENT_LEVELS,
  EMPLOYMENT_POSITIONS,
  CONSENT_TEMPLATES,
} from '../fixtures/settings'
import { ROLES } from '../fixtures/options'
import { DEMO_PERMISSIONS, DEMO_USER } from '../fixtures/users'
import { COMPANIES } from '../fixtures/companies'
import { matchesSearch, ok, okList, paginate } from '../utils'

const buildList = (rows, params) => {
  const page = Number(params?.page || 1)
  const limit = Number(params?.limit || 10)
  const search = params?.search
  const filtered = rows.filter((r) => matchesSearch(r, search))
  return okList(paginate(filtered, page, limit), page, limit, filtered.length)
}

const ROLE_DETAIL = ROLES.map((r) => ({
  ...r,
  description: `${r.name} role with default permissions`,
  is_default: r.id === 'role-superadmin',
  permissions: DEMO_PERMISSIONS,
  user_count: 1,
  created_at: '2025-04-01T00:00:00Z',
  updated_at: '2026-04-30T00:00:00Z',
}))

const USER_RECORDS = [
  {
    ...DEMO_USER,
    role: ROLES[0],
    phone: '6281234567890',
    companies: COMPANIES.map((c) => ({ id: c.id, name: c.name })),
    user_companies: COMPANIES.map((c) => ({ id: c.id, name: c.name, company: { id: c.id, name: c.name } })),
  },
  {
    id: 'u0000002-0000-0000-0000-000000000002',
    name: 'Citra Wulandari',
    username: 'citra.wulandari',
    email: 'citra.wulandari@everest.io',
    whatsapp: '+62 813 4444 5678',
    phone: '6281344445678',
    role: ROLES[2],
    avatar_url: null,
    status: 'active',
    is_active: true,
    companies: [{ id: COMPANIES[0].id, name: COMPANIES[0].name }],
    user_companies: [
      { id: COMPANIES[0].id, name: COMPANIES[0].name, company: { id: COMPANIES[0].id, name: COMPANIES[0].name } },
    ],
    created_at: '2025-09-12T00:00:00Z',
    updated_at: '2026-04-04T00:00:00Z',
  },
  {
    id: 'u0000003-0000-0000-0000-000000000003',
    name: 'Bagus Hartanto',
    username: 'bagus.hartanto',
    email: 'bagus.hartanto@everest.io',
    whatsapp: '+62 812 9999 1122',
    phone: '6281299991122',
    role: ROLES[3],
    avatar_url: null,
    status: 'active',
    is_active: true,
    companies: [
      { id: COMPANIES[1].id, name: COMPANIES[1].name },
      { id: COMPANIES[2].id, name: COMPANIES[2].name },
    ],
    user_companies: [
      { id: COMPANIES[1].id, name: COMPANIES[1].name, company: { id: COMPANIES[1].id, name: COMPANIES[1].name } },
      { id: COMPANIES[2].id, name: COMPANIES[2].name, company: { id: COMPANIES[2].id, name: COMPANIES[2].name } },
    ],
    created_at: '2025-11-08T00:00:00Z',
    updated_at: '2026-03-19T00:00:00Z',
  },
  {
    id: 'u0000004-0000-0000-0000-000000000004',
    name: 'Ratna Pradipta',
    username: 'ratna.pradipta',
    email: 'ratna.pradipta@everest.io',
    whatsapp: '+62 811 2233 4455',
    phone: '6281122334455',
    role: ROLES[4],
    avatar_url: null,
    status: 'invited',
    is_active: false,
    companies: [{ id: COMPANIES[3].id, name: COMPANIES[3].name }],
    user_companies: [
      { id: COMPANIES[3].id, name: COMPANIES[3].name, company: { id: COMPANIES[3].id, name: COMPANIES[3].name } },
    ],
    created_at: '2026-04-22T00:00:00Z',
    updated_at: '2026-04-22T00:00:00Z',
  },
]

export const settingHandlers = {
  'GET /v1/settings/general': () => ok(GENERAL_SETTINGS),
  'PUT /v1/settings/general': () => ok(GENERAL_SETTINGS, { message: 'General settings updated.' }),

  'GET /v1/settings/roles': ({ params }) => buildList(ROLE_DETAIL, params),
  'GET /v1/settings/roles/:id': ({ pathParams }) =>
    ok(ROLE_DETAIL.find((r) => r.id === pathParams.id) ?? ROLE_DETAIL[0]),
  'POST /v1/settings/roles': () => ok(ROLE_DETAIL[0], { message: 'Role created.' }),
  'PUT /v1/settings/roles/:id': ({ pathParams }) =>
    ok(ROLE_DETAIL.find((r) => r.id === pathParams.id) ?? ROLE_DETAIL[0], { message: 'Role updated.' }),
  'DELETE /v1/settings/roles': () => ok(null, { message: 'Roles deleted.' }),

  'GET /v1/permissions': () => ok(DEMO_PERMISSIONS),

  'GET /v1/settings/users': ({ params }) => buildList(USER_RECORDS, params),
  'GET /v1/settings/users/:id': ({ pathParams }) =>
    ok(USER_RECORDS.find((u) => u.id === pathParams.id) ?? USER_RECORDS[0]),
  'POST /v1/settings/users': () => ok(USER_RECORDS[0], { message: 'User created.' }),
  'PUT /v1/settings/users/:id': ({ pathParams }) =>
    ok(USER_RECORDS.find((u) => u.id === pathParams.id) ?? USER_RECORDS[0], { message: 'User updated.' }),
  'DELETE /v1/settings/users': () => ok(null, { message: 'Users deleted.' }),
  'POST /v1/settings/users/import': () => ok({ imported: 0 }, { message: 'Import complete.' }),

  'GET /v1/settings/employment-level/levels': ({ params }) => buildList(EMPLOYMENT_LEVELS, params),
  'GET /v1/settings/employment-level/levels/:id': ({ pathParams }) =>
    ok(EMPLOYMENT_LEVELS.find((l) => l.id === pathParams.id) ?? EMPLOYMENT_LEVELS[0]),
  'POST /v1/settings/employment-level/levels': () =>
    ok(EMPLOYMENT_LEVELS[0], { message: 'Level created.' }),
  'PUT /v1/settings/employment-level/levels/:id': ({ pathParams }) =>
    ok(EMPLOYMENT_LEVELS.find((l) => l.id === pathParams.id) ?? EMPLOYMENT_LEVELS[0], {
      message: 'Level updated.',
    }),
  'DELETE /v1/settings/employment-level/levels': () => ok(null, { message: 'Levels deleted.' }),

  'GET /v1/settings/employment-level/positions': ({ params }) =>
    buildList(EMPLOYMENT_POSITIONS, params),
  'GET /v1/settings/employment-level/positions/:id': ({ pathParams }) =>
    ok(EMPLOYMENT_POSITIONS.find((p) => p.id === pathParams.id) ?? EMPLOYMENT_POSITIONS[0]),
  'POST /v1/settings/employment-level/positions': () =>
    ok(EMPLOYMENT_POSITIONS[0], { message: 'Position created.' }),
  'PUT /v1/settings/employment-level/positions/:id': ({ pathParams }) =>
    ok(EMPLOYMENT_POSITIONS.find((p) => p.id === pathParams.id) ?? EMPLOYMENT_POSITIONS[0], {
      message: 'Position updated.',
    }),
  'DELETE /v1/settings/employment-level/positions': () =>
    ok(null, { message: 'Positions deleted.' }),

  'GET /v1/settings/consent-editor': () =>
    ok({
      candidate: {
        code: 'candidate',
        content: CANDIDATE_CONSENT_HTML,
        updated_at: '2026-04-08T05:30:00Z',
      },
      existing: {
        code: 'existing',
        content: EXISTING_CONSENT_HTML,
        updated_at: '2026-03-22T07:10:00Z',
      },
    }),
  'PUT /v1/settings/consent-editor/:code': ({ pathParams }) =>
    ok(
      {
        code: pathParams.code,
        content:
          pathParams.code === 'candidate' ? CANDIDATE_CONSENT_HTML : EXISTING_CONSENT_HTML,
      },
      { message: 'Consent template updated.' }
    ),
}

const CANDIDATE_CONSENT_HTML = `<h3>Surat Persetujuan Pemeriksaan Latar Belakang Kandidat</h3>
<p>Yang bertanda tangan di bawah ini menyatakan bersedia memberikan persetujuan kepada {COMPANY_NAME} untuk melakukan pemeriksaan latar belakang dalam rangka proses rekrutmen, termasuk namun tidak terbatas pada:</p>
<ul>
  <li>Verifikasi identitas dan dokumen kependudukan (KTP, NPWP).</li>
  <li>Pemeriksaan riwayat kredit melalui Sistem Layanan Informasi Keuangan ("CLIK") sesuai POJK No. 64/POJK.03/2020.</li>
  <li>Verifikasi riwayat pekerjaan, pendidikan, dan referensi profesional.</li>
  <li>Pemeriksaan catatan negatif termasuk putusan pengadilan dan daftar hitam OJK.</li>
</ul>
<p>Persetujuan ini berlaku selama proses rekrutmen berlangsung dan akan dicabut secara otomatis jika kandidat tidak melanjutkan proses lebih lanjut.</p>
<p>Saya memahami bahwa data pribadi saya akan diproses sesuai dengan Undang-Undang No. 27 Tahun 2022 tentang Pelindungan Data Pribadi, dan saya berhak menarik persetujuan ini sewaktu-waktu dengan menghubungi {COMPANY_NAME}.</p>`

const EXISTING_CONSENT_HTML = `<h3>Surat Persetujuan Pemeriksaan Latar Belakang Karyawan Aktif</h3>
<p>Sebagai karyawan {COMPANY_NAME}, saya memberikan persetujuan kepada perusahaan untuk melakukan pemeriksaan latar belakang berkala selama hubungan kerja berlangsung, mencakup:</p>
<ul>
  <li>Pemantauan riwayat kredit melalui CLIK secara berkala sesuai kebijakan internal.</li>
  <li>Verifikasi ulang dokumen kependudukan dan pajak ketika diperlukan.</li>
  <li>Pengecekan catatan negatif termasuk putusan pengadilan, daftar hitam, dan publikasi resmi.</li>
  <li>Pembaruan data kepegawaian sesuai jenjang dan posisi terbaru.</li>
</ul>
<p>Saya memahami bahwa hasil pemeriksaan akan digunakan untuk keperluan internal perusahaan sesuai dengan kebijakan tata kelola, manajemen risiko, dan kepatuhan yang berlaku.</p>
<p>Pemrosesan data pribadi saya tunduk pada Undang-Undang No. 27 Tahun 2022 tentang Pelindungan Data Pribadi. Saya berhak meminta penjelasan, koreksi, atau penarikan persetujuan ini melalui kanal resmi {COMPANY_NAME}.</p>`
