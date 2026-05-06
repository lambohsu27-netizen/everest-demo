const baseSubject = (workforce) => ({
  subjectType: 'Individual',
  individual: {
    fullName: workforce.full_name,
    placeOfBirth: workforce.place_of_birth,
    dateOfBirth: workforce.date_of_birth,
    gender: workforce.gender,
    maritalStatus: 'Married',
    motherMaidenName: workforce.family?.mother_maiden_name ?? 'Sari Wulandari',
  },
  identification: [
    { type: 'KTP', number: workforce.nik, country: 'IDN' },
    { type: 'NPWP', number: workforce.npwp, country: 'IDN' },
  ],
  addressHistory: [
    {
      address: workforce.address.full_address,
      city: workforce.address.city,
      province: workforce.address.province,
      postalCode: workforce.address.postal_code,
      country: 'IDN',
      reportedAt: '2025-09-12',
    },
  ],
  contactHistory: [
    { type: 'mobile', value: workforce.mobile_phone, reportedAt: '2025-09-12' },
    { type: 'email', value: workforce.email, reportedAt: '2025-09-12' },
  ],
  employmentDataHistory: [
    {
      employer: workforce.company.name,
      position: workforce.employment_position?.name ?? 'Specialist',
      since: '2024-01-15',
      reportedAt: '2025-12-04',
    },
  ],
})

const buildContractsHistory = (archetype) => {
  if (archetype === 'no_match') {
    return {
      aggregatedData: {
        numbersSummary: {
          numberOfFacility: 0,
          numberOfActiveFacility: 0,
          numberOfDelinquentFacility: 0,
          numberOfClosedFacility: 0,
        },
        currentBalance: 0,
        creditLimit: 0,
        numberOfNoteContracts: 0,
      },
      credit: { numbersSummary: {}, grantedCredit: [], notGrantedCredit: [] },
    }
  }
  const profiles = {
    clean: [
      {
        commonData: {
          providerCode: 'BANK001',
          providerName: 'PT Bank Mandiri (Persero) Tbk',
          contractCode: 'CC',
          contractName: 'Credit Card',
          currency: 'IDR',
          startDate: '2023-04-15',
          endDate: '2027-04-15',
        },
        grantedCredit: { creditLimit: 50_000_000, currentBalance: 4_280_000, monthlyInstallment: 0, overdue: 0 },
        creditProfile: Array.from({ length: 12 }, (_, m) => ({
          period: `2025-${String(m + 1).padStart(2, '0')}`,
          collectibility: 1,
          status: 'Lancar',
        })),
      },
      {
        commonData: {
          providerCode: 'BANK002',
          providerName: 'PT Bank Central Asia Tbk',
          contractCode: 'CC',
          contractName: 'Credit Card',
          currency: 'IDR',
          startDate: '2022-09-01',
          endDate: '2026-09-01',
        },
        grantedCredit: { creditLimit: 75_000_000, currentBalance: 8_170_000, monthlyInstallment: 0, overdue: 0 },
        creditProfile: Array.from({ length: 12 }, (_, m) => ({
          period: `2025-${String(m + 1).padStart(2, '0')}`,
          collectibility: 1,
          status: 'Lancar',
        })),
      },
    ],
    mid_risk: [
      {
        commonData: {
          providerCode: 'BANK003',
          providerName: 'PT Bank Rakyat Indonesia (Persero) Tbk',
          contractCode: 'KKB',
          contractName: 'Kredit Kendaraan Bermotor',
          currency: 'IDR',
          startDate: '2023-02-10',
          endDate: '2027-02-10',
        },
        grantedCredit: { creditLimit: 250_000_000, currentBalance: 187_500_000, monthlyInstallment: 5_650_000, overdue: 1_120_000 },
        creditProfile: Array.from({ length: 12 }, (_, m) => ({
          period: `2025-${String(m + 1).padStart(2, '0')}`,
          collectibility: m % 7 === 0 ? 2 : 1,
          status: m % 7 === 0 ? 'Dalam Perhatian Khusus' : 'Lancar',
        })),
      },
      {
        commonData: {
          providerCode: 'BANK004',
          providerName: 'PT Adira Dinamika Multi Finance',
          contractCode: 'KTA',
          contractName: 'Kredit Tanpa Agunan',
          currency: 'IDR',
          startDate: '2024-05-08',
          endDate: '2027-05-08',
        },
        grantedCredit: { creditLimit: 100_000_000, currentBalance: 88_300_000, monthlyInstallment: 3_400_000, overdue: 0 },
        creditProfile: Array.from({ length: 12 }, (_, m) => ({
          period: `2025-${String(m + 1).padStart(2, '0')}`,
          collectibility: 1,
          status: 'Lancar',
        })),
      },
    ],
    high_risk: [
      {
        commonData: {
          providerCode: 'BANK005',
          providerName: 'PT Bank Negara Indonesia (Persero) Tbk',
          contractCode: 'KPR',
          contractName: 'Kredit Pemilikan Rumah',
          currency: 'IDR',
          startDate: '2020-11-22',
          endDate: '2030-11-22',
        },
        grantedCredit: { creditLimit: 600_000_000, currentBalance: 481_220_000, monthlyInstallment: 8_900_000, overdue: 27_500_000 },
        creditProfile: Array.from({ length: 12 }, (_, m) => ({
          period: `2025-${String(m + 1).padStart(2, '0')}`,
          collectibility: m > 7 ? 4 : m > 3 ? 3 : 2,
          status: m > 7 ? 'Diragukan' : m > 3 ? 'Kurang Lancar' : 'Dalam Perhatian Khusus',
        })),
      },
      {
        commonData: {
          providerCode: 'BANK006',
          providerName: 'PT Mega Finance',
          contractCode: 'KTA',
          contractName: 'Kredit Tanpa Agunan',
          currency: 'IDR',
          startDate: '2022-08-15',
          endDate: '2025-08-15',
        },
        grantedCredit: { creditLimit: 150_000_000, currentBalance: 142_220_000, monthlyInstallment: 5_100_000, overdue: 18_400_000 },
        creditProfile: Array.from({ length: 12 }, (_, m) => ({
          period: `2025-${String(m + 1).padStart(2, '0')}`,
          collectibility: 4,
          status: 'Diragukan',
        })),
      },
    ],
  }
  const list = profiles[archetype] || []
  return {
    aggregatedData: {
      numbersSummary: {
        numberOfFacility: list.length,
        numberOfActiveFacility: list.length,
        numberOfDelinquentFacility: archetype === 'high_risk' ? list.length : archetype === 'mid_risk' ? 1 : 0,
        numberOfClosedFacility: 0,
      },
      currentBalance: list.reduce((s, c) => s + c.grantedCredit.currentBalance, 0),
      creditLimit: list.reduce((s, c) => s + c.grantedCredit.creditLimit, 0),
    },
    credit: {
      numbersSummary: { numberOfFacility: list.length, numberOfActiveFacility: list.length },
      grantedCredit: list,
      notGrantedCredit: [],
    },
  }
}

const buildScore = (archetype) => {
  switch (archetype) {
    case 'clean':
      return { rawScore: 798, scoreRange: 'A', riskLevel: 'Low', label: 'Excellent', exclusionRule: null }
    case 'mid_risk':
      return { rawScore: 602, scoreRange: 'B', riskLevel: 'Medium', label: 'Fair', exclusionRule: null }
    case 'high_risk':
      return { rawScore: 412, scoreRange: 'D', riskLevel: 'High', label: 'Poor', exclusionRule: null }
    case 'no_match':
    default:
      return { rawScore: null, scoreRange: null, riskLevel: 'Unknown', label: 'No Record', exclusionRule: 'E09' }
  }
}

const buildNegativeEvents = (archetype) => {
  if (archetype !== 'high_risk') return []
  return [
    {
      type: 'court_decision',
      court: 'Pengadilan Negeri Jakarta Selatan',
      caseNumber: '482/Pdt.G/2024/PN.JKT.SEL',
      decisionDate: '2024-08-12',
      summary: 'Civil dispute, defendant ruled liable for unpaid debt obligations.',
    },
    {
      type: 'default',
      reportedBy: 'PT Mega Finance',
      reportedAt: '2025-04-30',
      summary: 'Loan in default status for 90+ days.',
    },
  ]
}

const buildFootPrints = (archetype) => {
  const baseDates = ['2025-08-12', '2026-01-04', '2026-04-22']
  return baseDates.map((d, i) => ({
    enquiryDate: d,
    providerName: ['PT Bank Mandiri', 'PT Adira Finance', 'PT Mega Finance'][i],
    purposeCode: '21',
    purposeDescription: 'Onboarding / Background Check',
  }))
}

export const buildClikResult = (workforce) => {
  const archetype = workforce.credit_archetype
  return {
    cgResponseInfo: {
      messageId: `2026050${(workforce.full_name.length % 9) + 1}_CIF${(workforce.id || '').slice(-7)}`,
      requestedAt: '2026-04-22T03:14:00Z',
      respondedAt: '2026-04-22T03:14:11Z',
      status: 'success',
      serviceName: 'CLIK_INDIVIDUAL_REPORT',
    },
    responseData: {
      messageId: { cbsmessageId: `2026050${(workforce.full_name.length % 9) + 1}_CIF${(workforce.id || '').slice(-7)}` },
      enquiredData: {
        subject: { fullName: workforce.full_name, identification: workforce.nik },
        applicationCode: 'EVR-DEMO',
        purposeCode: '21',
      },
      applicationCodes: { contractCode: 'EVR', appNo: workforce.code },
      creditReport: {
        matchedSubject: [baseSubject(workforce)],
        contractsHistory: buildContractsHistory(archetype),
        footPrints: buildFootPrints(archetype),
        negativeEvents: buildNegativeEvents(archetype),
      },
      cbscore: buildScore(archetype),
      finTechScore: null,
      scores: null,
      pdfdetails: null,
      error: [],
    },
  }
}
