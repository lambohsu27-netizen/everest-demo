import { useEffect, useState } from 'react'
import { Edit01, Trash01, XClose } from '@untitled-ui/icons-react'
import { MyButton, MyConfirmModal } from '@interstellar-component'
import { useApp } from '@src/AppContext'
import { Access } from '@src/services/Helper'
import { useSettings } from '../../../Context'

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
        className={`fixed inset-0 z-40 bg-gray-950/70 backdrop-blur-md transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
        onClick={animateClose}
      />

      {/* Drawer */}
      <div className={`fixed right-0 top-0 z-50 flex h-full items-stretch pl-10 transition-transform duration-300 ease-in-out ${isVisible ? 'translate-x-0' : 'translate-x-full'}`}>
        {/* Close button */}
        <button
          onClick={animateClose}
          className="absolute left-[344px] top-3 z-10 rounded-lg p-2 text-gray-400 transition-colors hover:text-gray-600"
        >
          <XClose size={20} />
        </button>

        <div className="flex w-[375px] flex-col border-l border-gray-200 bg-white shadow-xl">
          <div className="flex flex-1 flex-col overflow-y-auto">
            {isLoadingRoleDetail ? (
              <div className="flex flex-1 items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-300 border-t-brand-600" />
              </div>
            ) : !roleDetail ? (
              <div className="flex flex-1 items-center justify-center text-sm-regular text-gray-500">Role not found.</div>
            ) : (
              <>
                {/* Header */}
                <div className="px-4 pb-0 pt-8">
                  <div className="flex flex-col gap-0.5">
                    <h2 className="text-xl-semibold text-gray-900">{roleDetail.name}</h2>
                    <p className="text-md-regular text-gray-600">Role</p>
                  </div>
                </div>

                {/* Information Section */}
                <div className="mt-8 px-4">
                  <div className="rounded-xl border border-gray-200 bg-gray-25 shadow-xs">
                    <div className="px-5 pb-2 pt-3">
                      <h3 className="text-sm-semibold text-gray-900">Information</h3>
                    </div>
                    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xs">
                      {/* Role name row */}
                      <div className="flex items-center border-b border-gray-200">
                        <div className="w-[120px] shrink-0 px-6 py-4">
                          <span className="text-sm-regular text-gray-600">Role name</span>
                        </div>
                        <div className="flex-1 px-6 py-4 text-right">
                          <span className="text-sm-medium text-gray-900">{roleDetail.name}</span>
                        </div>
                      </div>
                      {/* Access row */}
                      <div className="flex">
                        <div className="w-[120px] shrink-0 px-6 py-4">
                          <span className="text-sm-regular text-gray-600">Access</span>
                        </div>
                        <div className="flex-1 px-6 py-4">
                          <div className="flex flex-wrap gap-3">
                            {accessLabels.map((label) => (
                              <span
                                key={label}
                                className="inline-flex items-center rounded-full border border-gray-200 bg-gray-50 px-2 py-0.5 text-xs-medium text-gray-700"
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

                {/* Changes Section */}
                <div className="mt-8 px-4">
                  <div className="rounded-xl border border-gray-200 bg-gray-25 shadow-xs">
                    <div className="px-5 pb-2 pt-3">
                      <h3 className="text-sm-semibold text-gray-900">Changes</h3>
                    </div>
                    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xs">
                      {changes?.last_modified?.timestamp && (
                        <div className={`flex items-center ${changes?.created?.timestamp ? 'border-b border-gray-200' : ''}`}>
                          <div className="w-[120px] shrink-0 self-start px-6 py-4">
                            <span className="text-sm-regular text-gray-600">Last modified</span>
                          </div>
                          <div className="flex flex-1 items-center justify-end gap-3 px-6 py-4">
                            <div className="flex flex-col items-end">
                              <span className="text-sm-medium text-gray-900">{changes.last_modified.actor_name ?? '-'}</span>
                              <span className="text-sm-regular text-gray-600">{changes.last_modified.actor_role ?? ''}</span>
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
                        <div className="flex items-center">
                          <div className="w-[120px] shrink-0 self-start px-6 py-4">
                            <span className="text-sm-regular text-gray-600">Created</span>
                          </div>
                          <div className="flex flex-1 items-center justify-end gap-3 px-6 py-4">
                            <div className="flex flex-col items-end">
                              <span className="text-sm-medium text-gray-900">{changes.created.actor_name ?? '-'}</span>
                              <span className="text-sm-regular text-gray-600">{changes.created.actor_role ?? ''}</span>
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
      </div>
    </>
  )
}
