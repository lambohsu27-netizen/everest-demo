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

/**
 * @param {object} props
 * @param {object} props.employee
 */
export default function GeneralInfoCard({ employee }) {
  const consentStatus = employee.consent_status ?? employee.consentStatus
  const consentExpiry = employee.consent_expiry ?? employee.consentExpiry
  const code = employee.workforce_code ?? employee.code ?? employee.employeeId

  const fields = [
    { label: 'Name & ID', value: employee.full_name ?? employee.name, subtext: code },
    { label: 'Mobile phone', value: employee.phone ?? employee.phoneNumber },
    { label: 'Email address', value: employee.email },
    { label: 'Jenis Kelamin', value: employee.gender },
    { label: 'Tanggal Lahir', value: formatDate(employee.date_of_birth ?? employee.birthDate) },
    { label: 'NIK', value: employee.id_number ?? employee.nik },
    { label: 'Level', value: getName(employee.employment_level) ?? employee.level },
    { label: 'Position', value: getName(employee.position) ?? employee.position_title },
    { label: 'Category', value: employee.category },
    { label: 'Company', value: getName(employee.company) },
    ...(consentStatus !== undefined
      ? [{ label: 'Consent Status', value: consentStatus ?? DASH, isBadge: true }]
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
