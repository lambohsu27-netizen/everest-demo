import { WORKFORCE } from './workforce'
import { COMPANIES } from './companies'

const STATUS_PLAN = [
  { status: 'awaiting_form', count: 6 },
  { status: 'verification', count: 4 },
  { status: 'form_revision', count: 2 },
  { status: 'sent_to_clik', count: 3 },
  { status: 'completed', count: 10 },
  { status: 'failed', count: 1 },
  { status: 'canceled', count: 2 },
  { status: 'awaiting_admin', count: 1 },
  { status: 'awaiting_consent', count: 1 },
]

const REQUESTERS = [
  { id: 'u0000001-0000-0000-0000-000000000001', name: 'Super Admin' },
  { id: 'u0000002-0000-0000-0000-000000000002', name: 'Citra Wulandari' },
  { id: 'u0000003-0000-0000-0000-000000000003', name: 'Bagus Hartanto' },
  { id: 'u0000004-0000-0000-0000-000000000004', name: 'Ratna Pradipta' },
]

const padNum = (n, width) => String(n).padStart(width, '0')

const buildReference = (i) => `EVR-2026-${padNum(1000 + i, 5)}`

const buildEnquiries = () => {
  const enquiries = []
  let counter = 0
  let workforceIdx = 0
  STATUS_PLAN.forEach(({ status, count }) => {
    for (let i = 0; i < count; i += 1) {
      counter += 1
      const wf = WORKFORCE[workforceIdx % WORKFORCE.length]
      workforceIdx += 1
      const reference = buildReference(counter)
      const company = COMPANIES.find((c) => c.id === wf.company.id) || COMPANIES[0]
      const requester = REQUESTERS[counter % REQUESTERS.length]
      const baseDate = new Date('2026-04-30T00:00:00Z')
      const requestedAt = new Date(baseDate.getTime() - counter * 86_400_000 * 1.3)
      const completedAt = status === 'completed' ? new Date(requestedAt.getTime() + 86_400_000) : null

      enquiries.push({
        id: `e000${padNum(counter, 4)}-0000-0000-0000-${padNum(counter, 12)}`,
        reference_number: reference,
        category: wf.category,
        status,
        company: { id: company.id, name: company.name },
        workforce: {
          id: wf.id,
          full_name: wf.full_name,
          workforce_code: wf.code,
          nik: wf.nik,
          npwp: wf.npwp,
          mobile_phone: wf.mobile_phone,
          email: wf.email,
          gender: wf.gender,
          place_of_birth: wf.place_of_birth,
          date_of_birth: wf.date_of_birth,
          address: wf.address,
          employment_level: wf.employment_level,
          employment_position: wf.employment_position,
        },
        requester: { id: requester.id, name: requester.name },
        purpose_code: '21',
        purpose_description: 'Onboarding / Background Check',
        rejection_reason: status === 'form_revision' ? 'KTP image not clear' : null,
        rejection_note:
          status === 'form_revision' ? 'Please reupload KTP — top edge cropped, NIK partially obscured.' : null,
        notes: status === 'canceled' ? 'Cancelled by HR — candidate withdrew application.' : null,
        result_archetype: status === 'completed' ? wf.credit_archetype : null,
        score_summary: status === 'completed' ? wf.credit_summary : null,
        created_at: requestedAt.toISOString(),
        submitted_at: ['sent_to_clik', 'completed', 'failed'].includes(status)
          ? new Date(requestedAt.getTime() + 4 * 60 * 60 * 1000).toISOString()
          : null,
        completed_at: completedAt ? completedAt.toISOString() : null,
        updated_at: (completedAt || requestedAt).toISOString(),
      })
    }
  })
  return enquiries
}

export const ENQUIRIES = buildEnquiries()

export const findEnquiry = (id) => ENQUIRIES.find((e) => e.id === id) ?? null

export const enquiriesForWorkforce = (workforceId) =>
  ENQUIRIES.filter((e) => e.workforce.id === workforceId).sort((a, b) =>
    a.created_at < b.created_at ? 1 : -1
  )
