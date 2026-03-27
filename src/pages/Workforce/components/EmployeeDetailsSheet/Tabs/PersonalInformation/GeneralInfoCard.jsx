import React from 'react'
import { MyChip } from '@interstellar-component'

/**
 * @param {object} props
 * @param {object} props.employee
 */
export default function GeneralInfoCard({ employee }) {
  const fields = [
    { label: 'Name & ID', value: employee.name, subtext: employee.employeeId },
    { label: 'Mobile phone', value: employee.phoneNumber },
    { label: 'Email address', value: employee.email },
    { label: 'Jenis Kelamin', value: employee.gender || 'Wanita' },
    { label: 'Tempat Lahir', value: employee.birthPlace || 'Bekasi' },
    { label: 'Tanggal Lahir', value: employee.birthDate || '10 Jan 2021' },
    { label: 'NIK', value: employee.nik || '3275 0427 0800 0007' },
    { label: 'Level', value: employee.level },
    { label: 'Category', value: employee.category },
    { label: 'Company', value: employee.company },
    { label: 'Consent Status', value: employee.consentStatus, isBadge: true },
    { label: 'Consent expiry', value: employee.consentExpiry },
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
                  <span className="text-sm font-medium text-gray-900">{field.value}</span>
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
