import { useEffect } from 'react'
import { useLocation, useNavigate, Outlet } from 'react-router-dom'
import { MyHorizontalTabV2 } from '@interstellar-component'
import { useApp } from '@src/AppContext'
import { Access } from '@src/services/Helper'

const ALL_TABS = [
  { label: 'User', to: '/settings/user-role-access/user', perm: Access.USER_MANAGEMENT },
  { label: 'Role access', to: '/settings/user-role-access/role', perm: Access.ROLE_ACCESS },
]

export default function UserRoleAccess() {
  const location = useLocation()
  const navigate = useNavigate()
  const { hasPermission, permissionsLoaded } = useApp()

  const visibleTabs = ALL_TABS.filter((tab) => hasPermission(tab.perm))
  const noAccess = permissionsLoaded && visibleTabs.length === 0

  // If current path points to a sub-tab the user can't view, redirect to first allowed one.
  useEffect(() => {
    if (!permissionsLoaded) return
    if (visibleTabs.length === 0) return
    const onAllowed = visibleTabs.some((tab) => location.pathname.includes(tab.to))
    if (!onAllowed) navigate(visibleTabs[0].to, { replace: true })
  }, [permissionsLoaded, visibleTabs, location.pathname, navigate])

  const activeTab =
    visibleTabs.find((tab) => location.pathname.includes(tab.to))?.to || visibleTabs[0]?.to

  return (
    <div className="flex flex-1 min-h-0 flex-col pt-5">
      <div className="mb-6">
        {noAccess ? (
          <div className="relative flex w-fit overflow-hidden rounded-lg border border-gray-light/300 bg-gray-light/50 shadow-shadows/shadow-xs">
            {ALL_TABS.map((tab) => (
              <div
                key={tab.to}
                aria-disabled="true"
                className="relative flex items-center justify-center px-4 py-2 text-center cursor-not-allowed opacity-50"
              >
                <p className="text-sm-semibold whitespace-nowrap text-gray-500">{tab.label}</p>
              </div>
            ))}
          </div>
        ) : visibleTabs.length > 0 ? (
          <MyHorizontalTabV2
            value={activeTab}
            onChange={(val) => navigate(val)}
            tabs={visibleTabs.map((tab) => ({ ...tab, value: tab.to }))}
            fitContent
          />
        ) : null}
      </div>
      {noAccess ? (
        <div className="flex flex-1 items-center justify-center text-sm text-gray-500">
          You do not have access to user or role settings.
        </div>
      ) : (
        <Outlet />
      )}
    </div>
  )
}
