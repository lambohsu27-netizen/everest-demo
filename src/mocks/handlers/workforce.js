import { WORKFORCE, findWorkforce } from '../fixtures/workforce'
import { enquiriesForWorkforce } from '../fixtures/enquiries'
import { matchesSearch, ok, okList, paginate, sortBy } from '../utils'

const buildListRow = (w) => ({
  id: w.id,
  full_name: w.full_name,
  code: w.code,
  workforce_code: w.code,
  category: w.category,
  consent_status: w.consent_status,
  consent_expiry_at: w.consent_expiry_at,
  avatar_url: w.avatar_url,
  employment_level: w.employment_level,
  employment_position: w.employment_position,
  company: w.company,
  email: w.email,
  mobile_phone: w.mobile_phone,
  created_at: w.created_at,
  updated_at: w.updated_at,
})

// ─── Report payload builders (per archetype) ───────────────────────────────

const ARCHETYPE_NARRATIVE = {
  clean: {
    overall: 'low',
    key_takeaway:
      'Profil kredit subjek tergolong sehat: tidak ada catatan negatif, riwayat pembayaran lancar, dan utilisasi kredit rendah. Kandidat ini memiliki disiplin pembayaran yang konsisten serta beban utang yang terkelola, sehingga risiko keuangan secara keseluruhan dinilai rendah.',
    indicators: {
      financial_responsibility: {
        level: 'low',
        rationale: 'Subjek menunjukkan tanggung jawab finansial yang baik dengan riwayat pembayaran lancar di seluruh fasilitas.',
      },
      debt_burden: {
        level: 'low',
        rationale: 'Total outstanding masih jauh di bawah plafon kredit; beban utang rendah dibanding kapasitas.',
      },
      payment_discipline: {
        level: 'low',
        rationale: '12 bulan terakhir menunjukkan KOL 1 (Lancar) tanpa keterlambatan pembayaran.',
      },
      contract_reputation: {
        level: 'low',
        rationale: 'Mayoritas pengajuan kredit disetujui, tidak ada pengajuan ditolak yang signifikan.',
      },
      employment_stability: {
        level: 'low',
        rationale: 'Riwayat pekerjaan stabil dengan tenor lebih dari 2 tahun pada perusahaan saat ini.',
      },
      legal_exposure: {
        level: 'low',
        rationale: 'Tidak ditemukan catatan pengadilan atau peristiwa hukum negatif.',
      },
    },
  },
  mid_risk: {
    overall: 'medium',
    key_takeaway:
      'Subjek memiliki profil kredit moderat dengan utilisasi yang cukup tinggi pada beberapa fasilitas. Terdapat tunggakan ringan (KOL 2) pada satu fasilitas KKB serta utilisasi kredit di atas 60%. Diperlukan pemantauan lanjutan terhadap rasio cicilan dan disiplin pembayaran sebelum onboarding pada level senior.',
    indicators: {
      financial_responsibility: {
        level: 'medium',
        rationale: 'Sebagian besar fasilitas dibayar tepat waktu, namun terdapat keterlambatan singkat pada bulan tertentu.',
      },
      debt_burden: {
        level: 'medium',
        rationale: 'Outstanding mendekati 60% plafon; beban utang berada di zona perhatian.',
      },
      payment_discipline: {
        level: 'medium',
        rationale: '1–2 bulan KOL 2 tercatat dalam 12 bulan terakhir.',
      },
      contract_reputation: {
        level: 'medium',
        rationale: 'Rasio penolakan pengajuan sekitar 15%, masih dalam batas wajar.',
      },
      employment_stability: {
        level: 'low',
        rationale: 'Tenor pekerjaan saat ini di atas 18 bulan tanpa job hopping.',
      },
      legal_exposure: {
        level: 'low',
        rationale: 'Tidak ada catatan pengadilan dalam basis CLIK.',
      },
    },
  },
  high_risk: {
    overall: 'high',
    key_takeaway:
      'Profil kredit subjek menunjukkan risiko tinggi dengan tunggakan signifikan pada beberapa fasilitas (KOL 4 - Diragukan), terdapat catatan pengadilan, dan utilisasi kredit hampir penuh. Disarankan untuk menahan keputusan onboarding hingga klarifikasi hukum dan rencana penyelesaian utang dapat divalidasi langsung dengan kandidat.',
    indicators: {
      financial_responsibility: {
        level: 'high',
        rationale: 'Beberapa fasilitas dalam status tunggakan lebih dari 90 hari; tanggung jawab finansial menurun signifikan.',
      },
      debt_burden: {
        level: 'critical',
        rationale: 'Outstanding melebihi 80% dari plafon agregat; rasio utang terhadap kapasitas sangat tinggi.',
      },
      payment_discipline: {
        level: 'high',
        rationale: 'Riwayat 12 bulan didominasi KOL 3–4 dengan keterlambatan pembayaran konsisten.',
      },
      contract_reputation: {
        level: 'high',
        rationale: 'Beberapa pengajuan ditolak dalam 12 bulan terakhir, mencerminkan ketidakpercayaan lembaga keuangan.',
      },
      employment_stability: {
        level: 'medium',
        rationale: 'Pernah berpindah kerja dalam 24 bulan terakhir; perlu verifikasi kontrak terbaru.',
      },
      legal_exposure: {
        level: 'high',
        rationale: 'Terdapat 1 putusan pengadilan negeri terkait sengketa keuangan pada 2024.',
      },
    },
  },
  no_match: {
    overall: 'medium',
    key_takeaway:
      'Tidak ditemukan catatan kredit di basis CLIK untuk subjek ini. Profil kredit masih tipis sehingga belum dapat dinilai secara penuh — disarankan untuk mengandalkan verifikasi referensi pekerjaan, rekening tabungan, dan dokumen pendukung lain selama proses background check.',
    indicators: {
      financial_responsibility: { level: null, rationale: 'Belum ada riwayat kredit yang dapat dievaluasi.' },
      debt_burden: { level: 'low', rationale: 'Tidak ada outstanding tercatat.' },
      payment_discipline: { level: null, rationale: 'Belum ada riwayat pembayaran kredit.' },
      contract_reputation: { level: null, rationale: 'Belum ada pengajuan kredit yang tercatat.' },
      employment_stability: { level: 'low', rationale: 'Riwayat pekerjaan dalam basis HR menunjukkan tenor stabil.' },
      legal_exposure: { level: 'low', rationale: 'Tidak ditemukan catatan pengadilan.' },
    },
  },
}

const ARCHETYPE_SIGNALS = {
  clean: { phone_numbers: 4, address_records: 2, court_decisions: 0, employment_records: 2, footprint: 5 },
  mid_risk: { phone_numbers: 6, address_records: 3, court_decisions: 1, employment_records: 3, footprint: 11 },
  high_risk: { phone_numbers: 10, address_records: 5, court_decisions: 3, employment_records: 5, footprint: 18 },
  no_match: { phone_numbers: 1, address_records: 1, court_decisions: 0, employment_records: 1, footprint: 0 },
}

const SIGNAL_RATIONALES = {
  phone_numbers: {
    clean: 'Dua nomor kontak tercatat lintas laporan, semuanya aktif dan terverifikasi WhatsApp.',
    mid_risk: 'Tiga nomor kontak tercatat; satu nomor sudah tidak aktif sejak 2024.',
    high_risk: 'Lima nomor kontak berbeda terdeteksi dalam 24 bulan terakhir — frekuensi pergantian nomor cukup tinggi.',
    no_match: 'Tidak ada catatan nomor kontak di laporan CLIK.',
  },
  address_records: {
    clean: 'Dua alamat tercatat (KTP + domisili kerja), keduanya konsisten dengan dokumen yang diserahkan.',
    mid_risk: 'Dua alamat tercatat; perlu konfirmasi alamat domisili terbaru.',
    high_risk: 'Empat alamat berbeda dalam 36 bulan; pola perpindahan menjadi sinyal perhatian.',
    no_match: 'Tidak ada catatan alamat di laporan CLIK.',
  },
  court_decisions: {
    clean: 'Tidak ada putusan pengadilan ditemukan dalam basis CLIK.',
    mid_risk: 'Tidak ada putusan pengadilan ditemukan dalam basis CLIK.',
    high_risk: 'Satu putusan pengadilan negeri terkait wanprestasi pinjaman pada 2024.',
    no_match: 'Tidak ada catatan pengadilan di basis CLIK.',
  },
  employment_records: {
    clean: 'Dua riwayat pekerjaan tercatat dengan tenor stabil, transisi karier yang wajar.',
    mid_risk: 'Tiga riwayat pekerjaan dalam 5 tahun, tenor rata-rata di atas 18 bulan.',
    high_risk: 'Empat riwayat pekerjaan dalam 4 tahun terakhir, tenor rata-rata kurang dari 12 bulan.',
    no_match: 'Tidak ada riwayat pekerjaan dari laporan CLIK.',
  },
  footprint: {
    clean: 'Empat enquiry eksternal dalam 12 bulan, semuanya disetujui dan didanai.',
    mid_risk: 'Sembilan enquiry eksternal; sebagian masih dalam tahap pengajuan.',
    high_risk: 'Empat belas enquiry dalam 12 bulan; pola "credit shopping" perlu diverifikasi.',
    no_match: 'Tidak ada footprint enquiry di basis CLIK.',
  },
}

const ARCHETYPE_NUMBERS = {
  clean: {
    outstanding: 12_450_000,
    overdue: 0,
    plafon: 145_000_000,
    utilization: 9,
    monthly_installment: 2_150_000,
  },
  mid_risk: {
    outstanding: 318_780_000,
    overdue: 4_120_000,
    plafon: 525_000_000,
    utilization: 61,
    monthly_installment: 9_050_000,
  },
  high_risk: {
    outstanding: 712_440_000,
    overdue: 45_900_000,
    plafon: 845_000_000,
    utilization: 84,
    monthly_installment: 15_400_000,
  },
  no_match: {
    outstanding: 0,
    overdue: 0,
    plafon: 0,
    utilization: 0,
    monthly_installment: 0,
  },
}

const SCORE_BANDS = {
  clean: { score: 798, range: 'Excellent', message: 'Performansi pembayaran sangat baik.' },
  mid_risk: { score: 612, range: 'Good', message: 'Performansi pembayaran cukup, perlu pemantauan.' },
  high_risk: { score: 412, range: 'Poor', message: 'Risiko kredit tinggi, terdapat tunggakan signifikan.' },
  no_match: { score: 0, range: '—', message: 'Tidak ada kontrak kredit yang dapat dinilai.' },
}

const COMPOSITION_TEMPLATES = {
  clean: [
    { key: 'credit_card', category: 'Credit Card', total: 12_450_000 },
    { key: 'paylater', category: 'Paylater', total: 0 },
    { key: 'consumer', category: 'Consumer', total: 0 },
    { key: 'installment', category: 'Installment', total: 0 },
    { key: 'working_capital', category: 'Working Capital', total: 0 },
  ],
  mid_risk: [
    { key: 'credit_card', category: 'Credit Card', total: 22_280_000 },
    { key: 'paylater', category: 'Paylater', total: 850_000 },
    { key: 'kkb', category: 'KKB', total: 187_500_000 },
    { key: 'kta', category: 'KTA', total: 88_300_000 },
    { key: 'other', category: 'Other', total: 19_850_000 },
  ],
  high_risk: [
    { key: 'kpr', category: 'KPR', total: 481_220_000 },
    { key: 'kta', category: 'KTA', total: 142_220_000 },
    { key: 'kkb', category: 'KKB', total: 47_120_000 },
    { key: 'credit_card', category: 'Credit Card', total: 31_440_000 },
    { key: 'other', category: 'Other', total: 10_440_000 },
  ],
  no_match: [],
}

const NEW_FACILITIES_TEMPLATES = {
  clean: [
    { date: '2025-05', count: 0, total_limit: 0 },
    { date: '2025-06', count: 0, total_limit: 0 },
    { date: '2025-07', count: 1, total_limit: 50_000_000 },
    { date: '2025-08', count: 0, total_limit: 0 },
    { date: '2025-09', count: 0, total_limit: 0 },
    { date: '2025-10', count: 0, total_limit: 0 },
    { date: '2025-11', count: 1, total_limit: 75_000_000 },
    { date: '2025-12', count: 0, total_limit: 0 },
    { date: '2026-01', count: 0, total_limit: 0 },
    { date: '2026-02', count: 0, total_limit: 0 },
    { date: '2026-03', count: 0, total_limit: 0 },
    { date: '2026-04', count: 0, total_limit: 0 },
  ],
  mid_risk: [
    { date: '2025-05', count: 1, total_limit: 25_000_000 },
    { date: '2025-06', count: 0, total_limit: 0 },
    { date: '2025-07', count: 1, total_limit: 100_000_000 },
    { date: '2025-08', count: 2, total_limit: 30_000_000 },
    { date: '2025-09', count: 1, total_limit: 250_000_000 },
    { date: '2025-10', count: 0, total_limit: 0 },
    { date: '2025-11', count: 1, total_limit: 18_000_000 },
    { date: '2025-12', count: 1, total_limit: 12_000_000 },
    { date: '2026-01', count: 0, total_limit: 0 },
    { date: '2026-02', count: 1, total_limit: 22_000_000 },
    { date: '2026-03', count: 0, total_limit: 0 },
    { date: '2026-04', count: 1, total_limit: 8_500_000 },
  ],
  high_risk: [
    { date: '2025-05', count: 2, total_limit: 75_000_000 },
    { date: '2025-06', count: 1, total_limit: 50_000_000 },
    { date: '2025-07', count: 1, total_limit: 30_000_000 },
    { date: '2025-08', count: 2, total_limit: 120_000_000 },
    { date: '2025-09', count: 3, total_limit: 145_000_000 },
    { date: '2025-10', count: 2, total_limit: 60_000_000 },
    { date: '2025-11', count: 3, total_limit: 90_000_000 },
    { date: '2025-12', count: 2, total_limit: 35_000_000 },
    { date: '2026-01', count: 2, total_limit: 28_000_000 },
    { date: '2026-02', count: 1, total_limit: 15_000_000 },
    { date: '2026-03', count: 1, total_limit: 12_000_000 },
    { date: '2026-04', count: 1, total_limit: 9_000_000 },
  ],
  no_match: [],
}

const NEGATIVE_EVENTS_BY_ARCHETYPE = {
  clean: [],
  mid_risk: [
    {
      provider: 'PT Bank Rakyat Indonesia (Persero) Tbk',
      provider_type: 'Bank Umum',
      description: 'Keterlambatan pembayaran KKB > 30 hari',
      date: '2025-08-15',
      expiry_date: '2027-08-15',
      status: 'resolved',
      amount: 1_120_000,
      type: 'late_payment',
    },
  ],
  high_risk: [
    {
      provider: 'Pengadilan Negeri Jakarta Selatan',
      provider_type: 'Lembaga Peradilan',
      description: 'Putusan wanprestasi - sengketa pembayaran kredit',
      date: '2024-08-12',
      expiry_date: '2029-08-12',
      status: 'active',
      amount: 0,
      type: 'court_decision',
    },
    {
      provider: 'PT Mega Finance',
      provider_type: 'Lembaga Pembiayaan',
      description: 'Tunggakan KTA > 90 hari',
      date: '2025-04-30',
      expiry_date: '2028-04-30',
      status: 'active',
      amount: 18_400_000,
      type: 'default',
    },
    {
      provider: 'PT Bank Negara Indonesia (Persero) Tbk',
      provider_type: 'Bank Umum',
      description: 'Macet KPR > 180 hari (KOL 5)',
      date: '2025-09-20',
      expiry_date: '2028-09-20',
      status: 'active',
      amount: 27_500_000,
      type: 'default',
    },
  ],
  no_match: [],
}

// ── Time-series helpers ────────────────────────────────────────────────────

const TWELVE_MONTHS = [
  '2025-05', '2025-06', '2025-07', '2025-08', '2025-09', '2025-10',
  '2025-11', '2025-12', '2026-01', '2026-02', '2026-03', '2026-04',
]

const buildCreditScoreTrend = (archetype, anchor) => {
  if (archetype === 'no_match') {
    return TWELVE_MONTHS.map((date) => ({ date, outstanding: 0, overdue: 0 }))
  }
  const wave = [0.78, 0.82, 0.86, 0.90, 0.94, 0.97, 0.99, 1.01, 1.0, 0.98, 0.96, 0.95]
  const overdueWave =
    archetype === 'high_risk'
      ? [0.4, 0.55, 0.7, 0.78, 0.82, 0.9, 0.95, 1.0, 1.05, 1.1, 1.08, 1.05]
      : archetype === 'mid_risk'
        ? [0, 0, 0.2, 0.3, 0.5, 0.7, 0.9, 1.0, 0.7, 0.4, 0.6, 1.0]
        : Array(12).fill(0)
  return TWELVE_MONTHS.map((date, i) => ({
    date,
    outstanding: Math.round(anchor.outstanding * wave[i]),
    overdue: Math.round(anchor.overdue * overdueWave[i]),
  }))
}

const buildCollectabilityTrend = (archetype) => {
  if (archetype === 'no_match') {
    return TWELVE_MONTHS.map((date) => ({ date, dpd: 0, kol: 0 }))
  }
  const dpdProfiles = {
    clean: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    mid_risk: [0, 0, 12, 0, 0, 18, 5, 0, 0, 25, 0, 0],
    high_risk: [35, 60, 75, 90, 95, 110, 130, 140, 150, 165, 180, 195],
  }
  const kolProfiles = {
    clean: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    mid_risk: [1, 1, 2, 1, 1, 2, 1, 1, 1, 2, 1, 1],
    high_risk: [2, 2, 3, 3, 3, 4, 4, 4, 4, 4, 5, 5],
  }
  const dpd = dpdProfiles[archetype] ?? dpdProfiles.clean
  const kol = kolProfiles[archetype] ?? kolProfiles.clean
  return TWELVE_MONTHS.map((date, i) => ({ date, dpd: dpd[i], kol: kol[i] }))
}

// ── Per-workforce signal item generators ──────────────────────────────────
// All seeded by the workforce id so each person gets a deterministic but
// distinct set of phones, addresses, employment history, and footprints.

const hashSeed = (s) => {
  let h = 2166136261 >>> 0
  for (let i = 0; i < s.length; i += 1) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619) >>> 0
  }
  return h
}

const seededInt = (seed, salt, max) => ((seed ^ hashSeed(String(salt))) >>> 0) % max

const PROVIDER_NAMES = [
  ['PT Bank Mandiri (Persero) Tbk', 'Bank Umum'],
  ['PT Bank Central Asia Tbk', 'Bank Umum'],
  ['PT Bank Rakyat Indonesia (Persero) Tbk', 'Bank Umum'],
  ['PT Bank Negara Indonesia (Persero) Tbk', 'Bank Umum'],
  ['PT Adira Dinamika Multi Finance', 'Lembaga Pembiayaan'],
  ['PT Mega Finance', 'Lembaga Pembiayaan'],
  ['PT Maybank Indonesia Finance', 'Lembaga Pembiayaan'],
  ['Kredivo', 'Fintech P2P'],
  ['Akulaku Finance', 'Fintech P2P'],
  ['Indodana', 'Fintech P2P'],
  ['Home Credit Indonesia', 'Lembaga Pembiayaan'],
  ['BFI Finance Indonesia', 'Lembaga Pembiayaan'],
]

const FOOTPRINT_PURPOSES = [
  'Credit Card application',
  'Vehicle loan (KKB)',
  'Personal loan (KTA)',
  'Paylater enrollment',
  'Mortgage application (KPR)',
  'Onboarding / Background Check',
  'Working capital loan',
  'Multi-purpose loan',
  'Re-enquiry / monitoring',
]

const ADDRESS_VARIATIONS = [
  ['Jl. Kemang Raya No. ', ' RT 03/RW 04', 'Mampang Prapatan'],
  ['Jl. Hibiskus Blok B', '/9', 'Cilandak'],
  ['Jl. Palm Regency Blok ', ' No. 7', 'Pondok Indah'],
  ['Jl. H. Junaidi Naim No. ', '', 'Tebet'],
  ['Jl. Bendungan Hilir Raya No. ', ' Apt. 5B', 'Bendungan Hilir'],
  ['Jl. Cipete Selatan No. ', '', 'Cipete'],
  ['Komplek Bukit Permai Blok C', '/12', 'Cipayung'],
  ['Jl. Kebon Jeruk Raya No. ', '', 'Kebon Jeruk'],
]

const CITY_BY_ARCHETYPE = ['Jakarta Selatan', 'Jakarta Barat', 'Tangerang Selatan', 'Depok', 'Bekasi']

const OCCUPATIONS = [
  ['Product Manager', 'Other / Mixed Industry'],
  ['Customer Service', 'Banking & Financial Services'],
  ['Operations Manager', 'Logistics & Distribution'],
  ['Senior Software Engineer', 'Technology & Software'],
  ['HR Business Partner', 'Other / Mixed Industry'],
  ['Senior Accountant', 'Banking & Financial Services'],
  ['Marketing Specialist', 'Retail & E-commerce'],
  ['Compliance Officer', 'Banking & Financial Services'],
]

const formatDateAgo = (daysAgo) => {
  const d = new Date('2026-04-30T00:00:00Z')
  d.setDate(d.getDate() - daysAgo)
  return d.toISOString().slice(0, 10)
}

const formatDateAgingLabel = (daysAgo) => {
  if (daysAgo < 31) return `${Math.max(1, daysAgo)} day${daysAgo === 1 ? '' : 's'}`
  const months = Math.round(daysAgo / 30)
  return `${months} month${months === 1 ? '' : 's'}`
}

const buildPhoneItems = (workforce, count) => {
  if (!count) return []
  const seed = hashSeed(workforce.id)
  const baseDigits = (workforce.mobile_phone || '+62 812 0000 0000').replace(/\D/g, '').slice(-10)
  const items = []
  for (let i = 0; i < count; i += 1) {
    const lastFour = String((Number(baseDigits.slice(-4)) + i * 137) % 9999).padStart(4, '0')
    const prefix = ['818', '877', '812', '813', '811', '821', '815'][seededInt(seed, `phone-pre-${i}`, 7)]
    const middle = String((seededInt(seed, `phone-mid-${i}`, 9000)) + 1000).padStart(4, '0')
    const ageDays = i === 0 ? 30 : 30 + i * (45 + seededInt(seed, `phone-age-${i}`, 90))
    items.push({
      number: `+62 ${prefix} ${middle} ${lastFour}`,
      aging: formatDateAgingLabel(ageDays),
      lastUpdate: formatDateAgo(ageDays),
      status: i === 0 ? 'Current' : null,
    })
  }
  return items
}

const buildDiscoveredContacts = (workforce, listedItems) => {
  if (!listedItems.length) return []
  const seed = hashSeed(workforce.id)
  const labels = [
    workforce.full_name,
    `${workforce.full_name} - ${workforce.company?.name || 'Office'}`,
    `${workforce.full_name} (HR)`,
    'Marketing Contact',
    'Family',
    'Loan Agent',
    'Spam',
  ]
  const len = Math.min(labels.length, Math.max(3, Math.ceil(listedItems.length * 1.2)))
  return labels.slice(0, len).map((label, i) => ({
    label,
    count: 1 + seededInt(seed, `disc-${i}`, 18),
    numbers: listedItems
      .slice(0, 1 + seededInt(seed, `disc-pick-${i}`, Math.min(3, listedItems.length)))
      .map((p) => p.number),
    extra: i === 0 ? seededInt(seed, `disc-extra-${i}`, 6) : 0,
  }))
}

const buildAddressItems = (workforce, count) => {
  if (!count) return []
  const seed = hashSeed(workforce.id)
  const items = []
  for (let i = 0; i < count; i += 1) {
    const tpl = ADDRESS_VARIATIONS[seededInt(seed, `addr-${i}`, ADDRESS_VARIATIONS.length)]
    const num = 5 + seededInt(seed, `addr-num-${i}`, 95)
    const ageDays = 30 + i * (60 + seededInt(seed, `addr-age-${i}`, 120))
    items.push({
      address: i === 0
        ? workforce.address?.full_address ?? `${tpl[0]}${num}${tpl[1]}`
        : `${tpl[0]}${num}${tpl[1]}`,
      aging: formatDateAgingLabel(ageDays),
      count: String(2 + seededInt(seed, `addr-count-${i}`, 240)),
      lastUpdate: formatDateAgo(ageDays),
      city: i === 0 ? workforce.address?.city : tpl[2],
    })
  }
  return items
}

const buildEmploymentItems = (workforce, count) => {
  if (!count) return []
  const seed = hashSeed(workforce.id)
  const items = []
  // Always include the current employment first
  items.push({
    occupation: workforce.employment_position?.name || 'Specialist',
    subtext: workforce.company?.name || 'Current Company',
    industry: 'Other / Mixed Industry',
    location: 'Jakarta Selatan',
    count: '1',
    lastUpdate: '2026-03-12',
  })
  for (let i = 1; i < count; i += 1) {
    const occ = OCCUPATIONS[seededInt(seed, `emp-occ-${i}`, OCCUPATIONS.length)]
    const ageDays = 90 + i * (180 + seededInt(seed, `emp-age-${i}`, 240))
    items.push({
      occupation: occ[0],
      subtext: ['PT Anugerah Texindo', 'PT Bank Central Asia', 'PT Tirtayasa', 'PT Cendana Mitra Sejahtera', 'PT Pratama Logistik Nusantara'][seededInt(seed, `emp-co-${i}`, 5)],
      industry: occ[1],
      location: CITY_BY_ARCHETYPE[seededInt(seed, `emp-loc-${i}`, CITY_BY_ARCHETYPE.length)],
      count: String(1 + seededInt(seed, `emp-count-${i}`, 5)),
      lastUpdate: formatDateAgo(ageDays),
    })
  }
  return items
}

const buildFootprintItems = (workforce, count) => {
  if (!count) return []
  const seed = hashSeed(workforce.id)
  const items = []
  for (let i = 0; i < count; i += 1) {
    const provider = PROVIDER_NAMES[seededInt(seed, `fp-prov-${i}`, PROVIDER_NAMES.length)]
    const purpose = FOOTPRINT_PURPOSES[seededInt(seed, `fp-purp-${i}`, FOOTPRINT_PURPOSES.length)]
    const ageDays = 7 + i * (15 + seededInt(seed, `fp-age-${i}`, 30))
    items.push({
      institution: provider[0],
      provider_type: provider[1],
      purpose,
      enquiry_date: formatDateAgo(ageDays),
    })
  }
  return items
}

const buildFootprintBuckets = (items) => {
  const today = new Date('2026-04-30T00:00:00Z')
  const dayAge = (iso) => Math.round((today - new Date(iso)) / (1000 * 60 * 60 * 24))
  const buckets = { '1_month': 0, '3_months': 0, '6_months': 0, '12_months': 0 }
  items.forEach((it) => {
    const d = dayAge(it.enquiry_date)
    if (d <= 30) buckets['1_month'] += 1
    if (d <= 90) buckets['3_months'] += 1
    if (d <= 180) buckets['6_months'] += 1
    if (d <= 365) buckets['12_months'] += 1
  })
  return buckets
}

const buildSignals = (workforce) => {
  const archetype = archetypeOf(workforce)
  const counts = ARCHETYPE_SIGNALS[archetype] ?? ARCHETYPE_SIGNALS.no_match
  const phoneItems = buildPhoneItems(workforce, counts.phone_numbers)
  const addressItems = buildAddressItems(workforce, counts.address_records)
  const employmentItems = buildEmploymentItems(workforce, counts.employment_records)
  const footprintItems = buildFootprintItems(workforce, counts.footprint)
  return {
    phone_numbers: {
      count: phoneItems.length,
      rationale: SIGNAL_RATIONALES.phone_numbers[archetype] ?? '',
      items: phoneItems,
      discovered_contacts: buildDiscoveredContacts(workforce, phoneItems),
    },
    address_records: {
      count: addressItems.length,
      rationale: SIGNAL_RATIONALES.address_records[archetype] ?? '',
      items: addressItems,
    },
    court_decisions: {
      count: counts.court_decisions,
      rationale: SIGNAL_RATIONALES.court_decisions[archetype] ?? '',
    },
    employment_records: {
      count: employmentItems.length,
      rationale: SIGNAL_RATIONALES.employment_records[archetype] ?? '',
      items: employmentItems,
    },
    footprint: {
      count: footprintItems.length,
      rationale: SIGNAL_RATIONALES.footprint[archetype] ?? '',
      items: footprintItems,
      bucket_counts: buildFootprintBuckets(footprintItems),
    },
  }
}

const archetypeOf = (w) => w.credit_archetype ?? 'no_match'

const buildOverview = (w) => {
  const arch = archetypeOf(w)
  const narrative = ARCHETYPE_NARRATIVE[arch] ?? ARCHETYPE_NARRATIVE.no_match
  return {
    key_takeaway: narrative.key_takeaway,
    risk_assessment_indicators: {
      ...narrative.indicators,
      overall_risk: {
        level: narrative.overall,
        rationale: 'Penilaian agregat berdasarkan tanggung jawab finansial, riwayat pembayaran, stabilitas pekerjaan, dan eksposur hukum.',
      },
    },
  }
}

const buildCreditSummary = (w) => {
  const arch = archetypeOf(w)
  const numbers = ARCHETYPE_NUMBERS[arch] ?? ARCHETYPE_NUMBERS.no_match
  const score = SCORE_BANDS[arch] ?? SCORE_BANDS.no_match
  const collect = w.credit_summary?.collectibility_status ?? null
  const earliest =
    arch === 'no_match'
      ? null
      : arch === 'high_risk'
        ? '2020-11-22'
        : arch === 'mid_risk'
          ? '2023-02-10'
          : '2022-09-01'
  const latest =
    arch === 'no_match'
      ? null
      : arch === 'high_risk'
        ? '2026-04-04'
        : arch === 'mid_risk'
          ? '2026-04-04'
          : '2025-11-19'
  return {
    collectibility_status: collect,
    credit_score: { score: score.score || null, range: score.range, message: score.message },
    total_outstanding_loans: numbers.outstanding,
    total_overdue_loans: numbers.overdue,
    total_plafon_efektif: numbers.plafon,
    credit_score_trend: buildCreditScoreTrend(arch, numbers),
    collectability_trend: buildCollectabilityTrend(arch),
    lorem_ipsum: {
      estimated_monthly_installment: numbers.monthly_installment,
      earliest_facility: earliest,
      latest_facility: latest,
    },
  }
}

const buildCreditOverview = (w) => {
  const arch = archetypeOf(w)
  const numbers = ARCHETYPE_NUMBERS[arch] ?? ARCHETYPE_NUMBERS.no_match
  const utilizationLevel =
    numbers.utilization >= 80
      ? 'critical'
      : numbers.utilization >= 60
        ? 'high'
        : numbers.utilization >= 30
          ? 'medium'
          : 'low'
  const utilizationHeadline = {
    critical: 'Utilisasi mendekati batas plafon',
    high: 'Utilisasi tinggi, perlu perhatian',
    medium: 'Utilisasi moderat',
    low: 'Utilisasi rendah, profil sehat',
  }[utilizationLevel]
  const utilizationRationale = {
    critical: `Pemakaian sebesar ${numbers.utilization}% dari total plafon menandakan beban kredit yang sangat tinggi dan rentan terhadap tekanan likuiditas.`,
    high: `Pemakaian ${numbers.utilization}% dari plafon mengindikasikan ketergantungan kredit yang cukup tinggi.`,
    medium: `Pemakaian ${numbers.utilization}% berada pada level moderat — masih sehat, namun perlu pemantauan.`,
    low: `Pemakaian hanya ${numbers.utilization}% dari plafon yang tersedia — utilisasi rendah dan terkelola.`,
  }[utilizationLevel]
  return {
    credit_utilization: {
      percentage: numbers.utilization,
      level: utilizationLevel,
      headline: utilizationHeadline,
      rationale: utilizationRationale,
    },
    credit_composition: COMPOSITION_TEMPLATES[arch] ?? [],
    new_credit_facilities: NEW_FACILITIES_TEMPLATES[arch] ?? [],
  }
}

const buildLoanCategoryDetail = (w) => {
  const lc = w.loan_category ?? {}
  return Object.fromEntries(
    Object.entries(lc).map(([k, count]) => [k, Number(count) || 0])
  )
}

const buildReportPayload = (w) => {
  const enquiries = enquiriesForWorkforce(w.id)
  return {
    id: w.id,
    full_name: w.full_name,
    code: w.code,
    workforce_code: w.code,
    category: w.category,
    company: w.company,
    employment_level: w.employment_level,
    employment_position: w.employment_position,
    consent_status: w.consent_status,
    consent_expiry_at: w.consent_expiry_at,
    avatar_url: w.avatar_url,
    overview: buildOverview(w),
    risk_background_signals: buildSignals(w),
    credit_summary: buildCreditSummary(w),
    credit_overview: buildCreditOverview(w),
    loan_category: buildLoanCategoryDetail(w),
    risk_signals: w.risk_signals,
    negative_events: NEGATIVE_EVENTS_BY_ARCHETYPE[archetypeOf(w)] ?? [],
    linked_enquiries: enquiries.map((e) => ({
      id: e.id,
      reference_number: e.reference_number,
      status: e.status,
      requester: e.requester,
      created_at: e.created_at,
      submitted_at: e.submitted_at,
      completed_at: e.completed_at,
    })),
  }
}

const buildPersonalPayload = (w) => ({
  id: w.id,
  general_information: {
    name: w.full_name,
    code: w.code,
    workforce_code: w.code,
    nik: w.nik,
    npwp: w.npwp,
    mobile_phone: w.mobile_phone,
    email: w.email,
    gender: w.gender,
    place_of_birth: w.place_of_birth,
    date_of_birth: w.date_of_birth,
    level: w.employment_level?.name,
    position: w.employment_position?.name,
    category: w.category,
    company: w.company?.name,
    consent_status: w.consent_status,
    consent_expiry_at: w.consent_expiry_at,
    address: w.address,
    family: w.family,
  },
  employment_history: w.employment_history,
  attachments: w.attachments,
  activity_log: w.activity_log,
  activity: w.activity_log,
})

export const workforceHandlers = {
  'GET /v1/workforce': ({ params }) => {
    const page = Number(params?.page || 1)
    const limit = Number(params?.limit || 10)
    const search = params?.search
    const category = params?.category
    let filtered = WORKFORCE.map(buildListRow)
    if (search) filtered = filtered.filter((r) => matchesSearch(r, search))
    if (category) filtered = filtered.filter((r) => r.category === category)
    if (params?.sort) filtered = sortBy(filtered, params.sort, params.order)
    return okList(paginate(filtered, page, limit), page, limit, filtered.length)
  },
  'GET /v1/workforce/:id': ({ pathParams, params }) => {
    const w = findWorkforce(pathParams.id) ?? WORKFORCE[0]
    if (params?.type === 'personal_information') {
      return ok(buildPersonalPayload(w))
    }
    return ok(buildReportPayload(w))
  },
  'POST /v1/workforce': () => ok(buildListRow(WORKFORCE[0]), { message: 'Workforce created.' }),
  'PUT /v1/workforce/:id': ({ pathParams }) =>
    ok(buildListRow(findWorkforce(pathParams.id) ?? WORKFORCE[0]), {
      message: 'Workforce updated.',
    }),
  'DELETE /v1/workforce': () => ok(null, { message: 'Workforce deleted.' }),
  'POST /v1/workforce/import': () => ok({ imported: 0 }, { message: 'Import complete.' }),
}
