import { useEffect, useState } from 'react'
import { Edit01, Trash01 } from '@untitled-ui/icons-react'
import { MyButton, MyConfirmModal } from '@interstellar-component'
import { useApp } from '@src/AppContext'
import { Access } from '@src/services/Helper'
import { useSettings } from '../Context'

function formatDate(dateString) {
  if (!dateString) return ''
  const d = new Date(dateString)
  const day = String(d.getDate()).padStart(2, '0')
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const month = months[d.getMonth()]
  const year = d.getFullYear()
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')
  return `${day} ${month} ${year} • ${hours}:${minutes}`
}

export default function RoleDetail() {
  const { hasPermission } = useApp()
  const {
    roleDetail,
    isLoadingRoleDetail,
    activePanelRoleId,
    closeRolePanel,
    openEditRole,
    deleteRoles,
  } = useSettings()

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const frame = requestAnimationFrame(() => setIsVisible(true))
    return () => cancelAnimationFrame(frame)
  }, [])

  const animateClose = () => {
    setIsVisible(false)
    setTimeout(closeRolePanel, 300)
  }

  const canEdit = hasPermission(Access.ROLE_ACCESS, 'edit')
  const canDelete = hasPermission(Access.ROLE_ACCESS, 'delete')

  const handleConfirmDelete = async () => {
    setDeleteConfirmOpen(false)
    await deleteRoles([activePanelRoleId])
    closeRolePanel()
  }

  const accessLabels = roleDetail?.permissions
    ?.map((p) => p.label ?? p.module_key.replace(/_/g, ' '))
    ?? []

  const changes = roleDetail?.changes

  return (
    <>
      <MyConfirmModal
        open={deleteConfirmOpen}
        title="Delete role"
        message={`Are you sure you want to delete the role "${roleDetail?.name}"? This action cannot be undone.`}
        icon={<Trash01 className="text-error-600" />}
        bgColor="bg-error-100"
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
      />

      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={animateClose}
      />

      {/* Drawer */}
      <div
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-white shadow-xl transition-transform duration-300 ease-in-out ${
          isVisible ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-1 flex-col overflow-y-auto px-6 py-8">
          {isLoadingRoleDetail ? (
            <div className="flex flex-1 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-300 border-t-brand-600" />
            </div>
          ) : !roleDetail ? (
            <div className="flex flex-1 items-center justify-center text-sm text-gray-500">Role not found.</div>
          ) : (
            <>
              {/* Title */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900">{roleDetail.name}</h2>
                <p className="mt-0.5 text-sm text-gray-500">Role</p>
              </div>

              {/* Information Section */}
              <div className="mb-8">
                <h3 className="text-sm font-semibold text-gray-900 border-b border-gray-200 pb-3 mb-4">Information</h3>

                <div className="flex items-center justify-between py-3">
                  <span className="text-sm text-gray-500">Role name</span>
                  <span className="text-sm font-medium text-gray-900">{roleDetail.name}</span>
                </div>

                <div className="flex items-start justify-between py-3">
                  <span className="text-sm text-gray-500">Access</span>
                  <div className="flex flex-wrap justify-end gap-1.5 max-w-[240px]">
                    {accessLabels.map((label) => (
                      <span
                        key={label}
                        className="inline-flex items-center rounded-md border border-gray-200 bg-gray-50 px-2 py-0.5 text-xs font-medium text-gray-700"
                      >
                        {label}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Changes Section */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 border-b border-gray-200 pb-3 mb-4">Changes</h3>

                {changes?.last_modified?.timestamp && (
                  <div className="flex items-center justify-between py-3">
                    <span className="text-sm text-gray-500">Last modified</span>
                    <div className="flex items-center gap-2.5">
                      <div className="flex flex-col items-end">
                        <span className="text-sm font-medium text-gray-900">{changes.last_modified.actor_name ?? '-'}</span>
                        <span className="text-xs text-gray-500">{changes.last_modified.actor_role ?? ''}</span>
                        <span className="text-xs text-gray-400">{formatDate(changes.last_modified.timestamp)}</span>
                      </div>
                      {changes.last_modified.actor_avatar_url ? (
                        <img src={changes.last_modified.actor_avatar_url} alt="" className="w-8 h-8 rounded-full object-cover" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-gray-200" />
                      )}
                    </div>
                  </div>
                )}

                {changes?.created?.timestamp && (
                  <div className="flex items-center justify-between py-3">
                    <span className="text-sm text-gray-500">Created</span>
                    <div className="flex items-center gap-2.5">
                      <div className="flex flex-col items-end">
                        <span className="text-sm font-medium text-gray-900">{changes.created.actor_name ?? '-'}</span>
                        <span className="text-xs text-gray-500">{changes.created.actor_role ?? ''}</span>
                        <span className="text-xs text-gray-400">{formatDate(changes.created.timestamp)}</span>
                      </div>
                      {changes.created.actor_avatar_url ? (
                        <img src={changes.created.actor_avatar_url} alt="" className="w-8 h-8 rounded-full object-cover" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-gray-200" />
                      )}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        {roleDetail && !isLoadingRoleDetail && (
          <div className="flex items-center justify-between border-t border-gray-200 px-6 py-4">
            {canDelete ? (
              <MyButton
                color="error"
                size="md"
                variant="text"
                onClick={() => setDeleteConfirmOpen(true)}
              >
                <Trash01 className="w-4 h-4" stroke="currentColor" />
                Delete
              </MyButton>
            ) : <div />}
            {canEdit ? (
              <MyButton color="secondary" size="md" variant="outlined" onClick={openEditRole}>
                <Edit01 className="w-4 h-4" stroke="currentColor" />
                Edit
              </MyButton>
            ) : <div />}
          </div>
        )}
      </div>
    </>
  )
}
