import React from 'react'
import PropTypes from 'prop-types'
import {
  Briefcase01,
  Building01,
  Calendar,
  Mail01,
  Map01,
  Phone01,
  UserCheck01,
} from '@untitled-ui/icons-react'
import ProfileHeader from './ProfileHeader'
import { useEmployeeDetailsSheet } from './Context'

export default function RenderEmployeeData({ employee }) {
  const { currentTabs } = useEmployeeDetailsSheet()

  const sections = [
    {
      title: 'Personal Information',
      items: [
        { label: 'Full Name', value: employee.name, icon: <UserCheck01 size={20} /> },
        { label: 'Employee ID', value: employee.employeeId, icon: null },
        { label: 'Email Address', value: employee.email, icon: <Mail01 size={20} /> },
        { label: 'Phone Number', value: employee.phoneNumber, icon: <Phone01 size={20} /> },
        { label: 'Address', value: employee.address || 'Not provided', icon: <Map01 size={20} /> },
      ],
    },
    {
      title: 'Employment Details',
      items: [
        { label: 'Company', value: employee.company, icon: <Building01 size={20} /> },
        { label: 'Department', value: employee.department || 'Not assigned', icon: null },
        {
          label: 'Role / Position',
          value: employee.role || 'Not assigned',
          icon: <Briefcase01 size={20} />,
        },
        { label: 'Level', value: employee.level, icon: null },
        { label: 'Employment Type', value: employee.employmentType || 'Full-time', icon: null },
        { label: 'Joined Date', value: employee.joinedDate, icon: <Calendar size={20} /> },
      ],
    },
    {
      title: 'Consent Status',
      items: [
        { label: 'Category', value: employee.category, icon: null },
        { label: 'Current Status', value: employee.consentStatus, icon: null },
        { label: 'Expiry Date', value: employee.consentExpiry, icon: null },
      ],
    },
  ]

  return (
    <div className="flex flex-col gap-8">
      <ProfileHeader employee={employee} />

      <div className="px-8 pb-12">
        {currentTabs.type === 'personal_information' ? (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {sections.map((section, idx) => (
              <div
                key={idx}
                className={`flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm ${idx === sections.length - 1 ? 'lg:col-span-2' : ''}`}
              >
                <h3 className="text-lg font-semibold text-gray-900">{section.title}</h3>
                <div className="grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-8">
                  {section.items.map((item, i) => (
                    <div key={i} className="flex flex-col gap-1">
                      <span className="text-sm font-medium text-gray-500">{item.label}</span>
                      <div className="flex items-center gap-2 text-gray-900">
                        {item.icon && <span className="text-gray-400">{item.icon}</span>}
                        <p className="text-base font-medium">{item.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl border border-gray-200 shadow-sm min-h-[400px]">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Reports Content</h2>
            <p className="text-gray-500">This section is under development.</p>
          </div>
        )}

        {/* Actions Footer */}
        <div className="mt-8 flex items-center justify-end gap-3 border-t border-gray-100 pt-8">
          <button className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition-colors hover:bg-gray-50">
            Edit Information
          </button>
          <button className="rounded-lg bg-brand/600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand/700">
            Update Status
          </button>
        </div>
      </div>
    </div>
  )
}

RenderEmployeeData.propTypes = {
  employee: PropTypes.object.isRequired,
}
