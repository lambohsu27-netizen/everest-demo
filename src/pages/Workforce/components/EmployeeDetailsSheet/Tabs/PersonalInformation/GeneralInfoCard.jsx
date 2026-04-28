import React from 'react'
import { MyChip } from '@interstellar-component'

const DASH = '—'

function formatDate(value) {
  if (!value) return DASH
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return value
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

function getName(obj) {
  if (!obj) return null
  if (typeof obj === 'string') return obj
  return obj.name ?? null
}

// Reads from the new /v1/workforce/:id?type=personal_information shape:
//   { general_information: {name, code, mobile_phone, email, gender, place_of_birth,
//     date_of_birth, nik, level, category, company, consent_status, consent_expiry_at} }
// `employee` is the merged list-row cache; we still pull `position` from there
// because the personal_information mode doesn't include it.
export default function GeneralInfoCard({ personalDetail, employee = {} }) {
  const gi = personalDetail?.general_information ?? {}

  const consentStatus = gi.consent_status
  const consentExpiry = gi.consent_expiry_at
  const code = gi.code ?? employee.workforce_code

  const fields = [
    { label: 'Name & ID', value: gi.name ?? employee.full_name ?? employee.name, subtext: code },
    { label: 'Mobile phone', value: gi.mobile_phone ?? employee.phone },
    { label: 'Email address', value: gi.email ?? employee.email },
    { label: 'Jenis Kelamin', value: gi.gender ?? employee.gender },
    { label: 'Tempat Lahir', value: gi.place_of_birth },
    { label: 'Tanggal Lahir', value: formatDate(gi.date_of_birth ?? employee.date_of_birth) },
    { label: 'NIK', value: gi.nik ?? employee.id_number },
    { label: 'Level', value: gi.level ?? getName(employee.employment_level) },
    { label: 'Position', value: getName(employee.position) ?? employee.position_title },
    { label: 'Category', value: gi.category ?? employee.category },
    { label: 'Company', value: gi.company ?? getName(employee.company) },
    ...(consentStatus !== undefined && consentStatus !== null
      ? [{ label: 'Consent Status', value: consentStatus, isBadge: true }]
      : []),
    { label: 'Consent expiry', value: formatDate(consentExpiry) },
  ]

  return (
    <div className="flex flex-col gap-[2px] rounded-xl border border-gray-200 bg-[#fdfdfd] shadow-sm">
      {/* Heading wrapper */}
      <div className="flex items-center justify-between pl-5 pr-5 pt-3 pb-2">
        <h3 className="text-sm font-semibold text-[#181d27]">General Information</h3>
      </div>

      {/* Table Container */}
      <div className="bg-white mx-[1px] mb-[1px] rounded-[12px] border border-[#e9eaeb] overflow-hidden shadow-sm">
        {fields.map((field, index) => (
          <div
            key={index}
            className={`flex items-center justify-between px-4 py-3 ${
              index !== fields.length - 1 ? 'border-b border-gray-100' : ''
            }`}
          >
            <span className="text-sm text-gray-500 font-medium">{field.label}</span>
            <div className="flex flex-col items-end">
              {field.isBadge ? (
                <MyChip
                  label={field.value || 'Active'}
                  color="success"
                  variant="filled"
                  size="sm"
                  rounded="full"
                />
              ) : (
                <>
                  <span className="text-sm font-medium text-gray-900">{field.value ?? DASH}</span>
                  {field.subtext && (
                    <span className="text-xs text-gray-400 font-medium">{field.subtext}</span>
                  )}
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
