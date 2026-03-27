import { NavLink, Outlet } from 'react-router-dom'

const tabs = [
  { label: 'User', to: '/settings/user-role-access/user' },
  { label: 'Role access', to: '/settings/user-role-access/role' },
]

export default function UserRoleAccess() {
  return (
    <div className="flex flex-col pt-8">
      {/* Header */}
      <div className="flex flex-col gap-1 w-full pb-6">
        <h2 className="text-lg font-semibold text-[#181d27]">User and role access</h2>
        <p className="text-sm text-[#535862]">
          Define employee levels and their associated consent and screening rules.
        </p>
      </div>

      {/* Sub-tabs */}
      <div className="mb-6 flex items-center gap-1 border-b border-gray-200">
        {tabs.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            className={({ isActive }) =>
              `px-3 pb-3 text-sm font-semibold transition-colors ${
                isActive
                  ? 'border-b-2 border-[#6941C6] text-[#6941C6]'
                  : 'text-[#475467] hover:text-gray-900'
              }`
            }
          >
            {tab.label}
          </NavLink>
        ))}
      </div>

      <Outlet />
    </div>
  )
}
