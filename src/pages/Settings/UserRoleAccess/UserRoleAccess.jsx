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
    <div className="flex flex-1 min-h-0 flex-col pt-5">
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
