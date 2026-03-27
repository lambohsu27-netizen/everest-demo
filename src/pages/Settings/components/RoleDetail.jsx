import { useState } from 'react'
import { Edit01, Trash01 } from '@untitled-ui/icons-react'
import { MyButton, MyConfirmModal } from '@interstellar-component'
import { useApp } from '@src/AppContext'
import { Access } from '@src/services/Helper'
import { useSettings } from '../Context'
import SettingsPanel from './SettingsPanel'

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

      <SettingsPanel onBack={closeRolePanel} onClose={closeRolePanel} backLabel="Role access">
        {isLoadingRoleDetail ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-300 border-t-brand-600" />
          </div>
        ) : !roleDetail ? (
          <div className="py-20 text-center text-sm text-gray-500">Role not found.</div>
        ) : (
          <div className="flex flex-col h-full">
            {/* Content */}
            <div className="flex-1 flex flex-col gap-8">
              {/* Title */}
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">{roleDetail.name}</h2>
                <p className="mt-0.5 text-sm text-gray-500">Role</p>
              </div>

              {/* Information Section */}
              <div className="flex flex-col gap-5">
                <h3 className="text-base font-semibold text-gray-900 border-b border-gray-200 pb-3">Information</h3>

                {/* Role name */}
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-gray-500">Role name</span>
                  <span className="text-sm font-medium text-gray-900">{roleDetail.name}</span>
                </div>

                {/* Access */}
                <div className="flex items-start justify-between py-2">
                  <span className="text-sm text-gray-500">Access</span>
                  <div className="flex flex-wrap justify-end gap-2 max-w-[280px]">
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
              <div className="flex flex-col gap-5">
                <h3 className="text-base font-semibold text-gray-900 border-b border-gray-200 pb-3">Changes</h3>

                {/* Last modified */}
                {changes?.last_modified?.timestamp && (
                  <div className="flex items-center justify-between py-2">
                    <span className="text-sm text-gray-500">Last modified</span>
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col items-end">
                        <span className="text-sm font-medium text-gray-900">{changes.last_modified.actor_name ?? '-'}</span>
                        <span className="text-xs text-gray-500">{changes.last_modified.actor_role ?? ''}</span>
                        <span className="text-xs text-gray-400">{formatDate(changes.last_modified.timestamp)}</span>
                      </div>
                      {changes.last_modified.actor_avatar_url ? (
                        <img src={changes.last_modified.actor_avatar_url} alt="" className="w-9 h-9 rounded-full object-cover" />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-gray-200" />
                      )}
                    </div>
                  </div>
                )}

                {/* Created */}
                {changes?.created?.timestamp && (
                  <div className="flex items-center justify-between py-2">
                    <span className="text-sm text-gray-500">Created</span>
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col items-end">
                        <span className="text-sm font-medium text-gray-900">{changes.created.actor_name ?? '-'}</span>
                        <span className="text-xs text-gray-500">{changes.created.actor_role ?? ''}</span>
                        <span className="text-xs text-gray-400">{formatDate(changes.created.timestamp)}</span>
                      </div>
                      {changes.created.actor_avatar_url ? (
                        <img src={changes.created.actor_avatar_url} alt="" className="w-9 h-9 rounded-full object-cover" />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-gray-200" />
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Footer actions */}
            <div className="flex items-center justify-between border-t border-gray-200 pt-5 mt-8">
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
              {canEdit && (
                <MyButton color="secondary" size="md" variant="outlined" onClick={openEditRole}>
                  <Edit01 className="w-4 h-4" stroke="currentColor" />
                  Edit
                </MyButton>
              )}
            </div>
          </div>
        )}
      </SettingsPanel>
    </>
  )
}
