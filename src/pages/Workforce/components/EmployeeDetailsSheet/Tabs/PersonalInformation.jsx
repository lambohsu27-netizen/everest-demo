import React from 'react'
import {
  Briefcase01,
  Building01,
  Calendar,
  Mail01,
  Map01,
  Phone01,
  UserCheck01,
} from '@untitled-ui/icons-react'

export default function PersonalInformation({ employee }) {
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
  )
}
