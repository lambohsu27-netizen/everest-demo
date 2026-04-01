import { useLocation, useNavigate, Outlet } from 'react-router-dom'
import { MyHorizontalTabV2 } from '@interstellar-component'

const tabs = [
  { label: 'User', to: '/settings/user-role-access/user' },
  { label: 'Role access', to: '/settings/user-role-access/role' },
]

export default function UserRoleAccess() {
  const location = useLocation()
  const navigate = useNavigate()

  // Determine active tab based on current path
  const activeTab = tabs.find((tab) => location.pathname.includes(tab.to))?.to || tabs[0].to

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
      <div className="mb-6">
        <MyHorizontalTabV2
          value={activeTab}
          onChange={(val) => navigate(val)}
          tabs={tabs.map((tab) => ({ ...tab, value: tab.to }))}
          fitContent
        />
      </div>

      <Outlet />
    </div>
  )
}
