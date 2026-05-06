import { ENQUIRIES, findEnquiry } from '../fixtures/enquiries'
import { WORKFORCE, findWorkforce } from '../fixtures/workforce'
import { buildClikResult } from '../fixtures/clik-results'
import { matchesSearch, ok, okList, paginate, sortBy } from '../utils'

const buildMetrics = (rows) => {
  const counts = rows.reduce(
    (acc, e) => {
      acc.total += 1
      acc.all_status += 1
      acc[e.status] = (acc[e.status] || 0) + 1
      return acc
    },
    { total: 0, all_status: 0 }
  )
  return counts
}

const REPEAT_BY_LEVEL = {
  'lvl-01': 'annually',
  'lvl-02': 'annually',
  'lvl-03': 'semi_annually',
  'lvl-04': 'semi_annually',
  'lvl-05': 'quarterly',
  'lvl-06': 'quarterly',
  'lvl-07': 'monthly',
  'lvl-08': 'monthly',
}

const buildActivity = (e) => {
  const items = [
    {
      id: `act-${e.id}-001`,
      event_type: 'enquiry_created',
      event_description: `Enquiry ${e.reference_number} was created by ${e.requester?.name}.`,
      actor_name: e.requester?.name ?? 'System',
      actor: { name: e.requester?.name, avatar_url: null },
      occurred_at: e.created_at,
    },
    {
      id: `act-${e.id}-002`,
      event_type: 'consent_form_sent',
      event_description: `Consent form sent to ${e.workforce?.full_name} via WhatsApp and email.`,
      actor_name: e.requester?.name ?? 'System',
      actor: { name: e.requester?.name, avatar_url: null },
      occurred_at: new Date(new Date(e.created_at).getTime() + 5 * 60 * 1000).toISOString(),
    },
  ]
  if (e.submitted_at) {
    items.push({
      id: `act-${e.id}-003`,
      event_type: 'submitted_to_clik',
      event_description: 'Application submitted to CLIK for credit report.',
      actor_name: 'System',
      actor: { name: 'System', avatar_url: null },
      occurred_at: e.submitted_at,
    })
  }
  if (e.completed_at) {
    items.push({
      id: `act-${e.id}-004`,
      event_type: 'enquiry_completed',
      event_description: 'CLIK report received and verification completed.',
      actor_name: 'System',
      actor: { name: 'System', avatar_url: null },
      occurred_at: e.completed_at,
    })
  }
  if (e.status === 'form_revision') {
    items.push({
      id: `act-${e.id}-r1`,
      event_type: 'rejected',
      event_description: e.rejection_note ?? 'Form rejected, awaiting reupload.',
      actor_name: e.requester?.name ?? 'System',
      actor: { name: e.requester?.name, avatar_url: null },
      occurred_at: new Date(new Date(e.created_at).getTime() + 60 * 60 * 1000).toISOString(),
    })
  }
  if (e.status === 'canceled') {
    items.push({
      id: `act-${e.id}-c1`,
      event_type: 'canceled',
      event_description: e.notes ?? 'Enquiry was canceled.',
      actor_name: e.requester?.name ?? 'System',
      actor: { name: e.requester?.name, avatar_url: null },
      occurred_at: new Date(new Date(e.created_at).getTime() + 30 * 60 * 1000).toISOString(),
    })
  }
  return items
}

const hashSeed = (str) => {
  let h = 0
  const s = String(str ?? '')
  for (let i = 0; i < s.length; i += 1) {
    h = (h * 31 + s.charCodeAt(i)) >>> 0
  }
  return h
}

const escapeXml = (raw) =>
  String(raw ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')

const formatDob = (iso) => {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  const dd = String(d.getDate()).padStart(2, '0')
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  return `${dd}-${mm}-${d.getFullYear()}`
}

const buildKtpDataUrl = (workforce, photoUrl) => {
  const province = (workforce.address?.province || 'DKI JAKARTA').toUpperCase()
  const city = (workforce.address?.city || 'JAKARTA SELATAN').toUpperCase()
  const fullName = (workforce.full_name || '').toUpperCase()
  const placeDob = `${(workforce.place_of_birth || '').toUpperCase()}, ${formatDob(workforce.date_of_birth)}`
  const gender =
    workforce.gender === 'M' ? 'LAKI-LAKI' : workforce.gender === 'F' ? 'PEREMPUAN' : '-'
  const street = (workforce.address?.full_address || '').toUpperCase()
  const district = (workforce.address?.district || '').toUpperCase()
  const subdistrict = (workforce.address?.subdistrict || '').toUpperCase()
  const religion = 'ISLAM'
  const marital = 'KAWIN'
  const occupation = (workforce.employment_position?.name || 'PEGAWAI SWASTA').toUpperCase()
  const nationality = 'WNI'

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 470" font-family="Arial, sans-serif">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#e9efff"/>
      <stop offset="100%" stop-color="#cbd6ff"/>
    </linearGradient>
    <pattern id="grain" x="0" y="0" width="6" height="6" patternUnits="userSpaceOnUse">
      <rect width="6" height="6" fill="rgba(255,255,255,0.05)"/>
      <rect x="0" y="0" width="3" height="3" fill="rgba(255,255,255,0.08)"/>
    </pattern>
  </defs>
  <rect width="720" height="470" fill="url(#bg)" stroke="#7e8bd1" stroke-width="2"/>
  <rect width="720" height="470" fill="url(#grain)"/>
  <text x="360" y="34" text-anchor="middle" font-size="18" font-weight="700" fill="#1a1f4d">PROVINSI ${escapeXml(province)}</text>
  <text x="360" y="56" text-anchor="middle" font-size="16" font-weight="700" fill="#1a1f4d">KOTA ${escapeXml(city)}</text>
  <line x1="60" y1="70" x2="660" y2="70" stroke="#7e8bd1" stroke-width="1"/>
  <g font-size="11" fill="#1a1f4d">
    <text x="40" y="100" font-weight="700">NIK</text>
    <text x="120" y="100" font-size="18" font-weight="700" letter-spacing="2">: ${escapeXml(workforce.nik || '')}</text>

    <text x="40" y="138">Nama</text>
    <text x="120" y="138" font-size="13" font-weight="700">: ${escapeXml(fullName)}</text>

    <text x="40" y="160">Tempat/Tgl Lahir</text>
    <text x="170" y="160" font-size="12">: ${escapeXml(placeDob)}</text>

    <text x="40" y="180">Jenis Kelamin</text>
    <text x="170" y="180" font-size="12">: ${escapeXml(gender)}</text>

    <text x="40" y="200">Alamat</text>
    <text x="120" y="200" font-size="11">: ${escapeXml(street.slice(0, 48))}</text>
    <text x="124" y="216" font-size="11">${escapeXml(street.slice(48, 92))}</text>

    <text x="40" y="238">Kel/Desa</text>
    <text x="170" y="238" font-size="11">: ${escapeXml(subdistrict)}</text>

    <text x="40" y="258">Kecamatan</text>
    <text x="170" y="258" font-size="11">: ${escapeXml(district)}</text>

    <text x="40" y="278">Agama</text>
    <text x="170" y="278" font-size="11">: ${escapeXml(religion)}</text>

    <text x="40" y="298">Status Perkawinan</text>
    <text x="170" y="298" font-size="11">: ${escapeXml(marital)}</text>

    <text x="40" y="318">Pekerjaan</text>
    <text x="170" y="318" font-size="11">: ${escapeXml(occupation)}</text>

    <text x="40" y="338">Kewarganegaraan</text>
    <text x="170" y="338" font-size="11">: ${escapeXml(nationality)}</text>

    <text x="40" y="358">Berlaku Hingga</text>
    <text x="170" y="358" font-size="11">: SEUMUR HIDUP</text>
  </g>
  <g>
    <rect x="500" y="90" width="180" height="220" fill="#ffffff" stroke="#1a1f4d" stroke-width="1.5"/>
    <image x="500" y="90" width="180" height="220" href="${escapeXml(photoUrl)}" preserveAspectRatio="xMidYMid slice"/>
    <text x="590" y="332" text-anchor="middle" font-size="10" fill="#4a4f6d">${escapeXml(city)}</text>
    <text x="590" y="346" text-anchor="middle" font-size="10" fill="#4a4f6d">${escapeXml(formatDob(new Date().toISOString()))}</text>
    <g transform="translate(515,360)" stroke="#1a1f4d" stroke-width="1" fill="none">
      <path d="M5 10 Q 30 -10 70 10 T 150 10" />
      <path d="M5 18 Q 35 5 65 18 T 145 18" />
    </g>
  </g>
  <text x="40" y="448" font-size="9" fill="#4a4f6d">REPUBLIK INDONESIA · KARTU TANDA PENDUDUK</text>
</svg>`
  // base64 encode the SVG so the resulting data URL is short, stable, and renders without quoting issues
  return `data:image/svg+xml;base64,${typeof btoa === 'function' ? btoa(unescape(encodeURIComponent(svg))) : ''}`
}

const buildPhotoUrls = (e, workforce) => {
  const seed = hashSeed(e.id)
  // Stable pravatar pool, biased so adjacent enquiries don't collide
  const selfieIdx = ((seed * 7) % 70) + 1
  const selfieUrl = `https://i.pravatar.cc/600?img=${selfieIdx}`
  const score = 78 + (seed % 22)
  return {
    // selfie_photo_url is the actual selfie of the person (used in modal RIGHT slot)
    selfie_photo_url: selfieUrl,
    // ktp_photo_url is a generated KTP card SVG showing the person's identity data
    // (used in modal LEFT slot)
    ktp_photo_url: buildKtpDataUrl(workforce, selfieUrl),
    face_match_score: score,
  }
}

const buildVerificationPayload = (e, workforce) => {
  const photos = buildPhotoUrls(e, workforce)
  const genderApi = workforce.gender === 'M' ? 'male' : workforce.gender === 'F' ? 'female' : null
  return {
    id: e.id,
    reference_number: e.reference_number,
    created_at: e.created_at,
    status: e.status,
    selfie_photo_url: photos.selfie_photo_url,
    ktp_photo_url: photos.ktp_photo_url,
    face_match_score: photos.face_match_score,
    verification: {
      identity: {
        nik: workforce.nik,
        full_name: workforce.full_name,
        date_of_birth: workforce.date_of_birth,
        gender: genderApi,
        birth_place: workforce.place_of_birth,
        city: workforce.address?.city,
        district: workforce.address?.district,
        subdistrict: workforce.address?.subdistrict,
        postal_code: workforce.address?.postal_code,
        province: workforce.address?.province,
        street_address: workforce.address?.full_address,
        address: workforce.address?.full_address,
      },
      whatsapp: {
        number: workforce.mobile_phone,
        verified: true,
      },
    },
  }
}

const buildGeneralInfoPayload = (e, workforce, baseDetail) => ({
  id: e.id,
  reference_number: e.reference_number,
  created_at: e.created_at,
  status: e.status,
  category: e.category,
  general_information: {
    category: e.category,
    email: workforce.email,
    consent_expiry: baseDetail.consent_expiry,
    repeat_every: baseDetail.repeat_every,
    employment_level: workforce.employment_level,
    company: { id: workforce.company.id, name: workforce.company.name },
    target: {
      full_name: workforce.full_name,
      code: workforce.code,
      phone: workforce.mobile_phone,
      email: workforce.email,
      avatar_url: workforce.avatar_url,
      position: workforce.employment_position,
    },
  },
})

const buildActivityPayload = (e, activity) => ({
  id: e.id,
  reference_number: e.reference_number,
  created_at: e.created_at,
  status: e.status,
  activity,
})

const buildEnquiryDetail = (e) => {
  const workforce = findWorkforce(e.workforce.id) ?? WORKFORCE[0]
  const includeClik = ['completed', 'sent_to_clik', 'failed'].includes(e.status)
  const levelId = workforce.employment_level?.id
  const consentBaseDate = new Date(e.created_at)
  const consentExpiry = new Date(consentBaseDate.getTime() + 365 * 24 * 60 * 60 * 1000)
  const photos = buildPhotoUrls(e, workforce)
  return {
    selfie_photo_url: photos.selfie_photo_url,
    ktp_photo_url: photos.ktp_photo_url,
    face_match_score: photos.face_match_score,
    ...e,
    clik_result: includeClik ? buildClikResult(workforce) : null,
    target: {
      id: workforce.id,
      full_name: workforce.full_name,
      code: workforce.code,
      phone: workforce.mobile_phone,
      email: workforce.email,
      avatar_url: workforce.avatar_url,
      gender: workforce.gender,
      nik: workforce.nik,
      npwp: workforce.npwp,
      place_of_birth: workforce.place_of_birth,
      date_of_birth: workforce.date_of_birth,
      address: workforce.address,
    },
    employment_level: workforce.employment_level,
    position: workforce.employment_position,
    consent_expiry: consentExpiry.toISOString(),
    repeat_every: REPEAT_BY_LEVEL[levelId] ?? 'monthly',
    creator: {
      id: e.requester?.id,
      name: e.requester?.name,
      avatar_url: null,
    },
    activity: buildActivity(e),
    workforce: {
      ...e.workforce,
      family: workforce.family,
      address: workforce.address,
      employment_history: workforce.employment_history,
      attachments: workforce.attachments,
    },
  }
}

export const reportEnquiryHandlers = {
  'GET /v1/report-enquiry': ({ params }) => {
    const page = Number(params?.page || 1)
    const limit = Number(params?.limit || 10)
    const search = params?.search
    const category = params?.category
    const status = params?.status
    let filtered = ENQUIRIES.slice()
    if (search) filtered = filtered.filter((e) => matchesSearch({ ...e, name: e.workforce?.full_name }, search))
    if (category) filtered = filtered.filter((e) => e.category === category)
    if (status) filtered = filtered.filter((e) => e.status === status)
    if (params?.sort) filtered = sortBy(filtered, params.sort, params.order)
    const metrics = buildMetrics(ENQUIRIES)
    return okList(paginate(filtered, page, limit), page, limit, filtered.length, { metrics })
  },
  'GET /v1/report-enquiry/:id': ({ pathParams, params }) => {
    const e = findEnquiry(pathParams.id) ?? ENQUIRIES[0]
    const workforce = findWorkforce(e.workforce.id) ?? WORKFORCE[0]
    const fullDetail = buildEnquiryDetail(e)
    switch (params?.type) {
      case 'verification':
        return ok(buildVerificationPayload(e, workforce))
      case 'general_info':
        return ok(buildGeneralInfoPayload(e, workforce, fullDetail))
      case 'activity':
        return ok(buildActivityPayload(e, fullDetail.activity))
      default:
        return ok(fullDetail)
    }
  },
  'POST /v1/report-enquiry': () =>
    ok(buildEnquiryDetail(ENQUIRIES[0]), { message: 'Report enquiry created.' }),
  'POST /v1/report-enquiry/import': () =>
    ok({ imported: 0 }, { message: 'Import complete.' }),
  'DELETE /v1/report-enquiry': () => ok(null, { message: 'Report enquiry deleted.' }),
  'GET /v1/report-enquiry/employees': ({ params }) => {
    const page = Number(params?.page || 1)
    const limit = Number(params?.limit || 10)
    const search = params?.search
    let rows = WORKFORCE.map((w) => ({
      id: w.id,
      full_name: w.full_name,
      workforce_code: w.code,
      category: w.category,
      company: w.company,
      consent_status: w.consent_status,
    }))
    if (search) rows = rows.filter((r) => matchesSearch(r, search))
    return okList(paginate(rows, page, limit), page, limit, rows.length)
  },
  'GET /v1/report-enquiry/employees/:id': ({ pathParams }) => {
    const w = findWorkforce(pathParams.id) ?? WORKFORCE[0]
    return ok({
      id: w.id,
      full_name: w.full_name,
      workforce_code: w.code,
      nik: w.nik,
      npwp: w.npwp,
      gender: w.gender,
      mobile_phone: w.mobile_phone,
      email: w.email,
      place_of_birth: w.place_of_birth,
      date_of_birth: w.date_of_birth,
      address: w.address,
      family: w.family,
      employment_level: w.employment_level,
      employment_position: w.employment_position,
      company: w.company,
      consent_status: w.consent_status,
    })
  },
  'PATCH /v1/report-enquiry/:id/cancel': () => ok(null, { message: 'Enquiry cancelled.' }),
  'PATCH /v1/report-enquiry/:id/resend': () => ok(null, { message: 'Form resent.' }),
  'PATCH /v1/report-enquiry/:id/reject': () => ok(null, { message: 'Enquiry rejected.' }),
  'PATCH /v1/report-enquiry/:id/submit': () => ok(null, { message: 'Submitted to CLIK.' }),
}
