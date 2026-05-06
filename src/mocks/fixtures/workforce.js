import { COMPANIES } from './companies'
import { EMPLOYMENT_LEVELS, EMPLOYMENT_POSITIONS } from './settings'

const PERSONAS = [
  ['Adit Pranowo', 'M', 'Jakarta', '1989-04-12'],
  ['Bagus Hartanto', 'M', 'Surabaya', '1985-09-21'],
  ['Citra Wulandari', 'F', 'Bandung', '1992-02-08'],
  ['Damar Setiawan', 'M', 'Yogyakarta', '1987-11-30'],
  ['Eka Prameswari', 'F', 'Semarang', '1994-06-17'],
  ['Fajar Nugroho', 'M', 'Jakarta', '1990-12-03'],
  ['Galih Pamungkas', 'M', 'Malang', '1988-03-25'],
  ['Hesti Maharani', 'F', 'Bekasi', '1993-07-14'],
  ['Indra Saputra', 'M', 'Tangerang', '1986-10-09'],
  ['Jasmine Putri', 'F', 'Depok', '1995-01-22'],
  ['Krisna Wibowo', 'M', 'Jakarta', '1991-08-05'],
  ['Larasati Dewi', 'F', 'Bandung', '1989-05-18'],
  ['Mahesa Pratama', 'M', 'Surabaya', '1987-02-26'],
  ['Nadia Hapsari', 'F', 'Yogyakarta', '1996-09-11'],
  ['Oka Maharaj', 'M', 'Denpasar', '1984-12-29'],
  ['Putri Anggraini', 'F', 'Semarang', '1992-04-07'],
  ['Qori Ramadhan', 'M', 'Jakarta', '1990-11-15'],
  ['Ratna Pradipta', 'F', 'Bandung', '1988-06-23'],
  ['Surya Adinata', 'M', 'Bekasi', '1993-08-31'],
  ['Tania Puspita', 'F', 'Jakarta', '1991-03-19'],
  ['Umar Salim', 'M', 'Surabaya', '1985-07-04'],
  ['Vera Sasmita', 'F', 'Tangerang', '1994-10-12'],
  ['Wahyu Setiadi', 'M', 'Depok', '1989-01-28'],
  ['Xenia Karunia', 'F', 'Jakarta', '1995-05-06'],
  ['Yoga Permana', 'M', 'Yogyakarta', '1986-09-13'],
  ['Zahra Salsabila', 'F', 'Bandung', '1992-12-21'],
  ['Arif Wicaksono', 'M', 'Jakarta', '1990-03-08'],
  ['Bella Anjani', 'F', 'Surabaya', '1988-11-25'],
  ['Cahya Ramadhani', 'F', 'Semarang', '1993-04-30'],
  ['Dimas Aryasatya', 'M', 'Jakarta', '1987-08-18'],
  ['Elvira Tresnawati', 'F', 'Malang', '1994-02-14'],
  ['Faisal Rahman', 'M', 'Bekasi', '1991-06-26'],
  ['Gita Kusuma', 'F', 'Bandung', '1989-10-03'],
  ['Hadi Pranata', 'M', 'Tangerang', '1986-05-20'],
  ['Intan Permatasari', 'F', 'Jakarta', '1995-08-09'],
  ['Jaya Wiradinata', 'M', 'Surabaya', '1984-12-12'],
  ['Kayla Tarina', 'F', 'Depok', '1996-03-27'],
  ['Lukman Hakim', 'M', 'Jakarta', '1988-09-16'],
  ['Maya Kusumawardhani', 'F', 'Yogyakarta', '1992-07-23'],
  ['Naufal Ardhana', 'M', 'Bandung', '1990-01-31'],
  ['Olivia Anastasya', 'F', 'Jakarta', '1993-11-08'],
  ['Pandu Winarto', 'M', 'Semarang', '1987-04-15'],
  ['Qonita Larasati', 'F', 'Surabaya', '1995-09-29'],
  ['Reno Bayu', 'M', 'Bekasi', '1989-06-11'],
  ['Saskia Permata', 'F', 'Jakarta', '1991-02-28'],
  ['Teguh Iman', 'M', 'Tangerang', '1986-10-22'],
  ['Ulfa Hidayati', 'F', 'Bandung', '1994-05-04'],
  ['Vino Aldebaran', 'M', 'Jakarta', '1988-12-17'],
  ['Wira Sasongko', 'M', 'Yogyakarta', '1990-07-08'],
  ['Yanti Kusumadewi', 'F', 'Surabaya', '1992-03-14'],
]

const CONSENT_STATUSES = ['active', 'pending', 'expired', 'revoked']

const padNum = (n, width) => String(n).padStart(width, '0')

const buildNik = (idx, dob) => {
  const district = '317402' // Kebayoran Baru
  const dd = String(new Date(dob).getDate()).padStart(2, '0')
  const mm = String(new Date(dob).getMonth() + 1).padStart(2, '0')
  const yy = String(new Date(dob).getFullYear()).slice(-2)
  return `${district}${dd}${mm}${yy}${padNum(idx, 4)}`
}

const buildNpwp = (idx) => {
  const a = padNum(10 + idx, 2)
  const b = padNum(100 + idx * 7, 3)
  const c = padNum(200 + idx * 11, 3)
  return `${a}.${b}.${c}.4-001.000`
}

const buildPhone = (idx) => `+62 81${padNum(idx % 10, 1)} ${padNum(1000 + idx * 7, 4)} ${padNum((idx * 13) % 10000, 4)}`

const buildEmail = (name) => {
  const slug = name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '.')
    .replace(/^\.+|\.+$/g, '')
  return `${slug}@example.co.id`
}

const buildCode = (idx, category) => {
  const prefix = category === 'employee' ? 'EMP' : 'CND'
  return `${prefix}-${padNum(1000 + idx, 5)}`
}

const ATTACHMENT_TEMPLATE = (name, code) => [
  {
    id: `att-${code}-ktp`,
    document_type: 'ktp',
    label: 'KTP (National ID)',
    file_name: `KTP_${code}.pdf`,
    file_url: `/demo-assets/documents/ktp-sample.pdf`,
    mime_type: 'application/pdf',
    file_size: 312_456,
    uploaded_at: '2026-03-12T03:25:00Z',
  },
  {
    id: `att-${code}-npwp`,
    document_type: 'npwp',
    label: 'NPWP (Tax ID)',
    file_name: `NPWP_${code}.pdf`,
    file_url: `/demo-assets/documents/npwp-sample.pdf`,
    mime_type: 'application/pdf',
    file_size: 218_300,
    uploaded_at: '2026-03-12T03:26:00Z',
  },
  {
    id: `att-${code}-contract`,
    document_type: 'contract',
    label: 'Employment Contract',
    file_name: `Contract_${code}.pdf`,
    file_url: `/demo-assets/documents/contract-sample.pdf`,
    mime_type: 'application/pdf',
    file_size: 1_024_512,
    uploaded_at: '2026-03-12T03:28:00Z',
  },
  {
    id: `att-${code}-consent`,
    document_type: 'consent',
    label: 'Signed Consent Form',
    file_name: `Consent_${code}.pdf`,
    file_url: `/demo-assets/documents/consent-sample.pdf`,
    mime_type: 'application/pdf',
    file_size: 167_980,
    uploaded_at: '2026-03-12T03:29:00Z',
  },
]

const ACTIVITY_TEMPLATE = (name) => [
  {
    id: 'act-001',
    actor: 'Super Admin',
    action: 'created',
    description: `Created workforce record for ${name}`,
    created_at: '2026-03-10T02:30:00Z',
  },
  {
    id: 'act-002',
    actor: 'HR Manager',
    action: 'consent_uploaded',
    description: 'Uploaded signed consent form',
    created_at: '2026-03-12T03:29:00Z',
  },
  {
    id: 'act-003',
    actor: 'HR Officer',
    action: 'updated',
    description: 'Updated contact information',
    created_at: '2026-04-04T07:15:00Z',
  },
  {
    id: 'act-004',
    actor: 'Super Admin',
    action: 'enquiry_submitted',
    description: 'Submitted background check enquiry to CLIK',
    created_at: '2026-04-18T05:42:00Z',
  },
]

const CREDIT_PROFILE_BY_ARCHETYPE = {
  clean: {
    score: 'A',
    score_label: 'Excellent',
    score_value: 798,
    risk_level: 'low',
    collectibility_status: { kol: 1, label: 'Lancar' },
    total_facilities: 4,
    active_facilities: 3,
    total_credit_limit: 145_000_000,
    total_outstanding: 12_450_000,
    paydex: 92,
    flags: [],
    risk_signals: { court_decisions: 0, negative_events: 0, address_changes: 1, employment_changes: 1 },
    loan_category: { credit_card: 2, paylater: 1, kkb: 0, kpr: 0, kta: 0, other: 0 },
  },
  mid_risk: {
    score: 'B',
    score_label: 'Fair',
    score_value: 602,
    risk_level: 'medium',
    collectibility_status: { kol: 2, label: 'Dalam Perhatian Khusus' },
    total_facilities: 6,
    active_facilities: 5,
    total_credit_limit: 525_000_000,
    total_outstanding: 318_780_000,
    paydex: 71,
    flags: ['late_payment_30d'],
    risk_signals: { court_decisions: 0, negative_events: 1, address_changes: 2, employment_changes: 2 },
    loan_category: { credit_card: 2, paylater: 1, kkb: 1, kpr: 1, kta: 0, other: 1 },
  },
  high_risk: {
    score: 'D',
    score_label: 'Poor',
    score_value: 412,
    risk_level: 'high',
    collectibility_status: { kol: 4, label: 'Diragukan' },
    total_facilities: 9,
    active_facilities: 7,
    total_credit_limit: 845_000_000,
    total_outstanding: 712_440_000,
    paydex: 38,
    flags: ['late_payment_90d', 'court_decision', 'default'],
    risk_signals: { court_decisions: 1, negative_events: 3, address_changes: 4, employment_changes: 3 },
    loan_category: { credit_card: 3, paylater: 2, kkb: 1, kpr: 1, kta: 1, other: 1 },
  },
  no_match: {
    score: null,
    score_label: 'No CLIK Record',
    score_value: null,
    risk_level: 'unknown',
    collectibility_status: null,
    total_facilities: 0,
    active_facilities: 0,
    total_credit_limit: 0,
    total_outstanding: 0,
    paydex: null,
    flags: [],
    risk_signals: { court_decisions: 0, negative_events: 0, address_changes: 0, employment_changes: 0 },
    loan_category: { credit_card: 0, paylater: 0, kkb: 0, kpr: 0, kta: 0, other: 0 },
  },
}

const ARCHETYPE_BY_INDEX = (i) => {
  const cycle = ['clean', 'mid_risk', 'clean', 'clean', 'high_risk', 'mid_risk', 'no_match']
  return cycle[i % cycle.length]
}

const CREDIT_COMPOSITION_TIMESERIES = (archetype) => {
  if (archetype === 'no_match') return []
  const baseline = archetype === 'high_risk' ? 700_000_000 : archetype === 'mid_risk' ? 280_000_000 : 14_000_000
  return Array.from({ length: 12 }, (_, i) => ({
    month: ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'][i],
    outstanding: Math.round(baseline * (0.85 + Math.sin(i / 2) * 0.1)),
    limit: archetype === 'high_risk' ? 850_000_000 : archetype === 'mid_risk' ? 525_000_000 : 145_000_000,
  }))
}

const buildAddress = (idx) => ({
  full_address: `Jl. Demo No. ${10 + idx}, RT 0${(idx % 9) + 1}/RW 0${(idx % 7) + 1}`,
  province: 'DKI Jakarta',
  city: 'Jakarta Selatan',
  district: 'Kebayoran Baru',
  subdistrict: 'Senayan',
  postal_code: '12190',
})

export const WORKFORCE = PERSONAS.map((p, i) => {
  const [name, gender, birthCity, dob] = p
  const company = COMPANIES[i % COMPANIES.length]
  const level = EMPLOYMENT_LEVELS[i % EMPLOYMENT_LEVELS.length]
  const positions = EMPLOYMENT_POSITIONS.filter((pos) => pos.level_id === level.id)
  const position = positions[i % Math.max(1, positions.length)] || EMPLOYMENT_POSITIONS[i % EMPLOYMENT_POSITIONS.length]
  const category = i % 4 === 0 ? 'candidate' : 'employee'
  const consentStatus = CONSENT_STATUSES[i % CONSENT_STATUSES.length]
  const code = buildCode(i + 1, category)
  const archetype = ARCHETYPE_BY_INDEX(i)
  const credit = CREDIT_PROFILE_BY_ARCHETYPE[archetype]
  const today = new Date('2026-05-05T00:00:00Z')
  const consentExpiry = new Date(today.getTime() + (i % 30) * 86_400_000 * (consentStatus === 'expired' ? -1 : 1))

  return {
    id: `w0000${padNum(i + 1, 3)}-0000-0000-0000-000000000${padNum(i + 1, 3)}`,
    full_name: name,
    code,
    workforce_code: code,
    category,
    gender,
    nik: buildNik(i + 1, dob),
    npwp: buildNpwp(i + 1),
    place_of_birth: birthCity,
    date_of_birth: dob,
    mobile_phone: buildPhone(i + 1),
    email: buildEmail(name),
    avatar_url: null,
    company: { id: company.id, name: company.name },
    employment_level: { id: level.id, name: level.name },
    employment_position: { id: position.id, name: position.name },
    consent_status: consentStatus,
    consent_expiry_at: consentExpiry.toISOString(),
    is_active: consentStatus !== 'revoked',
    address: buildAddress(i + 1),
    family: {
      mother_maiden_name: 'Sari Wulandari',
      spouse_name: gender === 'M' ? 'Dian Anggraini' : 'Bayu Pratama',
      number_of_dependents: i % 4,
    },
    employment_history: [
      {
        id: `eh-${i}-1`,
        company_name: company.name,
        position: position.name,
        level: level.name,
        start_date: '2024-01-15',
        end_date: null,
        is_current: true,
      },
      {
        id: `eh-${i}-2`,
        company_name: 'PT Pendahulu Karya',
        position: 'Junior ' + position.name,
        level: 'Staff / Junior',
        start_date: '2021-08-01',
        end_date: '2023-12-31',
        is_current: false,
      },
    ],
    credit_archetype: archetype,
    credit_summary: credit,
    credit_composition: CREDIT_COMPOSITION_TIMESERIES(archetype),
    loan_category: credit.loan_category,
    risk_signals: credit.risk_signals,
    attachments: ATTACHMENT_TEMPLATE(name, code),
    activity_log: ACTIVITY_TEMPLATE(name),
    created_at: '2026-03-10T02:30:00Z',
    updated_at: '2026-04-22T07:11:00Z',
  }
})

export const findWorkforce = (id) => WORKFORCE.find((w) => w.id === id) ?? null
