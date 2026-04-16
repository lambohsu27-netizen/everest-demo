import { useState } from 'react'
import { Edit01, Trash01, XClose } from '@untitled-ui/icons-react'
import { MyButton, MyConfirmModal } from '@interstellar-component'
import { useApp } from '@src/AppContext'
import { Access } from '@src/services/Helper'
import { useSettings } from '../../Context'

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

  const accessLabels =
    roleDetail?.permissions?.map(
      (p) => p.label ?? p.module_key.replace(/_/g, ' ')
    ) ?? []

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

      <div className="flex h-screen w-[375px] flex-col">
        {/* Header */}
        <header className="relative px-6 py-6">
          <button
            type="button"
            onClick={closeRolePanel}
            className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-lg p-2 text-gray-light/400 hover:bg-gray-light/50"
          >
            <XClose size={24} stroke="currentColor" />
          </button>
        </header>

        {/* Body */}
        <div className="flex flex-1 flex-col overflow-y-auto">
          {isLoadingRoleDetail ? (
            <div className="flex flex-1 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand/300 border-t-brand/900" />
            </div>
          ) : !roleDetail ? (
            <div className="text-sm-regular flex flex-1 items-center justify-center text-gray-500">Role not found.</div>
          ) : (
            <>
              {/* Title */}
              <div className="min-w-0 px-4 pb-0">
                <div className="flex flex-col gap-0.5">
                  <h2 className="text-xl-semibold text-gray-900 [overflow-wrap:anywhere]">
                    {roleDetail.name}
                  </h2>
                  <p className="text-md-regular text-gray-600">Role</p>
                </div>
              </div>

              {/* Information */}
              <div className="mt-8 px-4">
                <div className="rounded-xl border border-gray-200 bg-gray-25 shadow-xs">
                  <div className="px-5 pb-2 pt-3">
                    <h3 className="text-sm-semibold text-gray-900">Information</h3>
                  </div>
                  <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xs">
                    <div className="flex items-start border-b border-gray-200">
                      <div className="w-[120px] shrink-0 px-6 py-4">
                        <span className="text-sm-regular text-gray-600">Role name</span>
                      </div>
                      <div className="min-w-0 flex-1 px-6 py-4 text-right">
                        <span className="block w-full text-right text-sm-medium text-gray-900 [overflow-wrap:anywhere]">
                          {roleDetail.name}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="w-[120px] shrink-0 px-6 py-4">
                        <span className="text-sm-regular text-gray-600">Access</span>
                      </div>
                      <div className="min-w-0 flex-1 px-6 py-4">
                        <div className="flex flex-wrap gap-3">
                          {accessLabels.map((label) => (
                            <span
                              key={label}
                              className="text-xs-medium inline-flex max-w-full items-center rounded-full border border-gray-200 bg-gray-50 px-2 py-0.5 text-gray-700 [overflow-wrap:anywhere]"
                            >
                              {label}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Changes */}
              <div className="mt-8 px-4 pb-4">
                <div className="rounded-xl border border-gray-200 bg-gray-25 shadow-xs">
                  <div className="px-5 pb-2 pt-3">
                    <h3 className="text-sm-semibold text-gray-900">Changes</h3>
                  </div>
                  <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xs">
                    {changes?.last_modified?.timestamp && (
                      <div className={`flex items-start ${changes?.created?.timestamp ? 'border-b border-gray-200' : ''}`}>
                        <div className="w-[120px] shrink-0 px-6 py-4">
                          <span className="text-sm-regular text-gray-600">Last modified</span>
                        </div>
                        <div className="flex min-w-0 flex-1 items-start justify-end gap-3 px-6 py-4">
                          <div className="flex min-w-0 flex-col items-end text-right">
                            <span className="max-w-full text-sm-medium text-gray-900 [overflow-wrap:anywhere]">
                              {changes.last_modified.actor_name ?? '-'}
                            </span>
                            <span className="max-w-full text-sm-regular text-gray-600 [overflow-wrap:anywhere]">
                              {changes.last_modified.actor_role ?? ''}
                            </span>
                            <span className="text-xs-regular text-gray-600">{formatDate(changes.last_modified.timestamp)}</span>
                          </div>
                          {changes.last_modified.actor_avatar_url ? (
                            <img src={changes.last_modified.actor_avatar_url} alt="" className="h-6 w-6 rounded-full object-cover" />
                          ) : (
                            <div className="h-6 w-6 rounded-full bg-gray-200" />
                          )}
                        </div>
                      </div>
                    )}
                    {changes?.created?.timestamp && (
                      <div className="flex items-start">
                        <div className="w-[120px] shrink-0 px-6 py-4">
                          <span className="text-sm-regular text-gray-600">Created</span>
                        </div>
                        <div className="flex min-w-0 flex-1 items-start justify-end gap-3 px-6 py-4">
                          <div className="flex min-w-0 flex-col items-end text-right">
                            <span className="max-w-full text-sm-medium text-gray-900 [overflow-wrap:anywhere]">
                              {changes.created.actor_name ?? '-'}
                            </span>
                            <span className="max-w-full text-sm-regular text-gray-600 [overflow-wrap:anywhere]">
                              {changes.created.actor_role ?? ''}
                            </span>
                            <span className="text-xs-regular text-gray-600">{formatDate(changes.created.timestamp)}</span>
                          </div>
                          {changes.created.actor_avatar_url ? (
                            <img src={changes.created.actor_avatar_url} alt="" className="h-6 w-6 rounded-full object-cover" />
                          ) : (
                            <div className="h-6 w-6 rounded-full bg-gray-200" />
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        {roleDetail && !isLoadingRoleDetail && (
          <div className="border-t border-gray-200 px-4 py-3">
            <div className="flex items-center justify-between">
              {canDelete ? (
                <MyButton
                  color="error"
                  size="sm"
                  variant="text"
                  onClick={() => setDeleteConfirmOpen(true)}
                >
                  <Trash01 className="h-5 w-5" stroke="currentColor" />
                  Delete
                </MyButton>
              ) : <div />}
              {canEdit ? (
                <MyButton color="secondary" size="md" variant="outlined" onClick={openEditRole}>
                  <Edit01 className="h-5 w-5" stroke="currentColor" />
                  Edit
                </MyButton>
              ) : <div />}
            </div>
          </div>
        )}
      </div>
    </>
  )
}
