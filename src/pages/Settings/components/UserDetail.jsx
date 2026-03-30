import { useEffect, useState } from 'react'
import { Edit01, Trash01, XClose } from '@untitled-ui/icons-react'
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

export default function UserDetail() {
  const { hasPermission } = useApp()
  const {
    userDetail,
    isLoadingUserDetail,
    activePanelUserId,
    closeUserPanel,
    openEditUser,
    deleteUsers,
  } = useSettings()

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const frame = requestAnimationFrame(() => setIsVisible(true))
    return () => cancelAnimationFrame(frame)
  }, [])

  const animateClose = () => {
    setIsVisible(false)
    setTimeout(closeUserPanel, 300)
  }

  const canEdit = hasPermission(Access.USER_MANAGEMENT, 'edit')
  const canDelete = hasPermission(Access.USER_MANAGEMENT, 'delete')

  const handleConfirmDelete = async () => {
    setDeleteConfirmOpen(false)
    await deleteUsers([activePanelUserId])
    closeUserPanel()
  }

  const companies = userDetail?.user_companies?.map((c) => c.name ?? c.company?.name).filter(Boolean) ?? []

  return (
    <>
      <MyConfirmModal
        open={deleteConfirmOpen}
        title="Delete user"
        message={`Are you sure you want to delete "${userDetail?.name}"? This action cannot be undone.`}
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
            {isLoadingUserDetail ? (
              <div className="flex flex-1 items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-300 border-t-brand-600" />
              </div>
            ) : !userDetail ? (
              <div className="flex flex-1 items-center justify-center text-sm-regular text-gray-500">User not found.</div>
            ) : (
              <>
                {/* Header with avatar */}
                <div className="px-4 pb-0 pt-8">
                  <div className="flex items-center gap-3">
                    {userDetail.avatar_url ? (
                      <img src={userDetail.avatar_url} alt={userDetail.name} className="h-14 w-14 rounded-full object-cover" />
                    ) : (
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-200 text-lg font-semibold text-gray-600">
                        {userDetail.name?.charAt(0)?.toUpperCase()}
                      </div>
                    )}
                    <div className="flex flex-col gap-0.5">
                      <h2 className="text-xl-semibold text-gray-900">{userDetail.name}</h2>
                      <p className="text-md-regular text-gray-600">{userDetail.role?.name}</p>
                    </div>
                  </div>
                </div>

                {/* Personal Info Section */}
                <div className="mt-8 px-4">
                  <div className="rounded-xl border border-gray-200 bg-gray-25 shadow-xs">
                    <div className="px-5 pb-2 pt-3">
                      <h3 className="text-sm-semibold text-gray-900">Personal info</h3>
                    </div>
                    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xs">
                      <div className="flex items-center border-b border-gray-200">
                        <div className="w-[120px] shrink-0 px-6 py-4">
                          <span className="text-sm-regular text-gray-600">Full name</span>
                        </div>
                        <div className="flex-1 px-6 py-4 text-right">
                          <span className="text-sm-medium text-gray-900">{userDetail.name}</span>
                        </div>
                      </div>
                      <div className="flex items-center border-b border-gray-200">
                        <div className="w-[120px] shrink-0 px-6 py-4">
                          <span className="text-sm-regular text-gray-600">Email</span>
                        </div>
                        <div className="flex-1 px-6 py-4 text-right">
                          <span className="text-sm-medium text-gray-900">{userDetail.email}</span>
                        </div>
                      </div>
                      <div className="flex items-center border-b border-gray-200">
                        <div className="w-[120px] shrink-0 px-6 py-4">
                          <span className="text-sm-regular text-gray-600">Phone</span>
                        </div>
                        <div className="flex-1 px-6 py-4 text-right">
                          <span className="text-sm-medium text-gray-900">{userDetail.phone ?? '-'}</span>
                        </div>
                      </div>
                      <div className="flex items-center border-b border-gray-200">
                        <div className="w-[120px] shrink-0 px-6 py-4">
                          <span className="text-sm-regular text-gray-600">Role</span>
                        </div>
                        <div className="flex-1 px-6 py-4 text-right">
                          <span className="text-sm-medium text-gray-900">{userDetail.role?.name ?? '-'}</span>
                        </div>
                      </div>
                      <div className="flex items-center border-b border-gray-200">
                        <div className="w-[120px] shrink-0 px-6 py-4">
                          <span className="text-sm-regular text-gray-600">Status</span>
                        </div>
                        <div className="flex-1 px-6 py-4 text-right">
                          <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium ${userDetail.is_active ? 'bg-success/50 text-success/700 border border-success/200' : 'bg-gray-100 text-gray-700 border border-gray-200'}`}>
                            <span className={`h-1.5 w-1.5 rounded-full ${userDetail.is_active ? 'bg-success/500' : 'bg-gray-500'}`} />
                            {userDetail.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </div>
                      {companies.length > 0 && (
                        <div className="flex">
                          <div className="w-[120px] shrink-0 px-6 py-4">
                            <span className="text-sm-regular text-gray-600">Company</span>
                          </div>
                          <div className="flex-1 px-6 py-4">
                            <div className="flex flex-wrap justify-end gap-2">
                              {companies.map((name) => (
                                <span
                                  key={name}
                                  className="inline-flex items-center rounded-full border border-gray-200 bg-gray-50 px-2 py-0.5 text-xs-medium text-gray-700"
                                >
                                  {name}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Changes Section */}
                <div className="mt-8 px-4 pb-4">
                  <div className="rounded-xl border border-gray-200 bg-gray-25 shadow-xs">
                    <div className="px-5 pb-2 pt-3">
                      <h3 className="text-sm-semibold text-gray-900">Changes</h3>
                    </div>
                    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xs">
                      {userDetail.updater && (
                        <div className={`flex items-center ${userDetail.creator ? 'border-b border-gray-200' : ''}`}>
                          <div className="w-[120px] shrink-0 self-start px-6 py-4">
                            <span className="text-sm-regular text-gray-600">Last modified</span>
                          </div>
                          <div className="flex flex-1 items-center justify-end gap-3 px-6 py-4">
                            <div className="flex flex-col items-end">
                              <span className="text-sm-medium text-gray-900">{userDetail.updater?.name ?? '-'}</span>
                              <span className="text-sm-regular text-gray-600">{userDetail.updater?.role?.name ?? ''}</span>
                              <span className="text-xs-regular text-gray-600">{formatDate(userDetail.updated_at)}</span>
                            </div>
                            {userDetail.updater?.avatar_url ? (
                              <img src={userDetail.updater.avatar_url} alt="" className="h-6 w-6 rounded-full object-cover" />
                            ) : (
                              <div className="h-6 w-6 rounded-full bg-gray-200" />
                            )}
                          </div>
                        </div>
                      )}
                      {userDetail.creator && (
                        <div className="flex items-center">
                          <div className="w-[120px] shrink-0 self-start px-6 py-4">
                            <span className="text-sm-regular text-gray-600">Created</span>
                          </div>
                          <div className="flex flex-1 items-center justify-end gap-3 px-6 py-4">
                            <div className="flex flex-col items-end">
                              <span className="text-sm-medium text-gray-900">{userDetail.creator?.name ?? '-'}</span>
                              <span className="text-sm-regular text-gray-600">{userDetail.creator?.role?.name ?? ''}</span>
                              <span className="text-xs-regular text-gray-600">{formatDate(userDetail.created_at)}</span>
                            </div>
                            {userDetail.creator?.avatar_url ? (
                              <img src={userDetail.creator.avatar_url} alt="" className="h-6 w-6 rounded-full object-cover" />
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
          {userDetail && !isLoadingUserDetail && (
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
                  <MyButton color="secondary" size="md" variant="outlined" onClick={openEditUser}>
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
