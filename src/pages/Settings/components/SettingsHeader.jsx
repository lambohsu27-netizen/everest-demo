import React from 'react'
import { NavLink } from 'react-router-dom'

export default function SettingsHeader() {
  const tabs = [
    { name: 'General', path: '/settings/general' },
    { name: 'User & role access', path: '/settings/user-role-access' },
    { name: 'Employment level', path: '/settings/employment-level' },
    { name: 'Consent editor', path: '/settings/consent-editor' },
  ]

  return (
    <div className="flex flex-col mt-4">
      <div className="flex flex-col gap-1 pb-5">
        <h1 className="text-3xl font-semibold text-gray-900 tracking-tight">Settings</h1>
        <p className="text-[16px] text-gray-500">Lorem ipsum</p>
      </div>

      <div className="flex items-center gap-2">
        {tabs.map((tab) => (
          <NavLink
            key={tab.name}
            to={tab.path}
            className={({ isActive }) =>
              `flex h-9 items-center justify-center rounded-md px-3 py-2 text-sm font-semibold transition-colors ${
                isActive
                  ? 'bg-[#F9F5FF] text-[#6941C6]'
                  : 'text-[#475467] hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            {tab.name}
          </NavLink>
        ))}
      </div>
    </div>
  )
}
