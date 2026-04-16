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

      <div className="flex h-screen w-[375px] flex-col">
        {/* Header */}
        <header className="relative px-6 py-6">
          <button
            type="button"
            onClick={closeUserPanel}
            className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-lg p-2 text-gray-light/400 hover:bg-gray-light/50"
          >
            <XClose size={24} stroke="currentColor" />
          </button>
        </header>

        {/* Body */}
        <div className="flex flex-1 flex-col overflow-y-auto">
          {isLoadingUserDetail ? (
            <div className="flex flex-1 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand/300 border-t-brand/900" />
            </div>
          ) : !userDetail ? (
            <div className="text-sm-regular flex flex-1 items-center justify-center text-gray-500">User not found.</div>
          ) : (
            <>
              {/* Avatar + name */}
              <div className="px-4 pb-0">
                <div className="flex items-center gap-3">
                  {userDetail.avatar_url ? (
                    <img src={userDetail.avatar_full_url} alt={userDetail.name} className="h-14 w-14 rounded-full object-cover" />
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

              {/* Personal Info */}
              <div className="mt-8 px-4">
                <div className="rounded-xl border border-gray-200 bg-gray-25 shadow-xs">
                  <div className="px-5 pb-2 pt-3">
                    <h3 className="text-sm-semibold text-gray-900">Personal info</h3>
                  </div>
                  <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xs">
                    <div className="flex items-start border-b border-gray-200">
                      <div className="w-[120px] shrink-0 px-6 py-4">
                        <span className="text-sm-regular text-gray-600">Full name</span>
                      </div>
                      <div className="min-w-0 flex-1 px-6 py-4 text-right">
                        <span className="block w-full text-right text-sm-medium text-gray-900 [overflow-wrap:anywhere]">
                          {userDetail.name}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-start border-b border-gray-200">
                      <div className="w-[120px] shrink-0 px-6 py-4">
                        <span className="text-sm-regular text-gray-600">Email</span>
                      </div>
                      <div className="min-w-0 flex-1 px-6 py-4 text-right">
                        <span className="block w-full text-right text-sm-medium text-gray-900 [overflow-wrap:anywhere]">
                          {userDetail.email}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-start border-b border-gray-200">
                      <div className="w-[120px] shrink-0 px-6 py-4">
                        <span className="text-sm-regular text-gray-600">Phone</span>
                      </div>
                      <div className="min-w-0 flex-1 px-6 py-4 text-right">
                        <span className="block w-full text-right text-sm-medium text-gray-900 [overflow-wrap:anywhere]">
                          {userDetail.phone ?? '-'}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-start border-b border-gray-200">
                      <div className="w-[120px] shrink-0 px-6 py-4">
                        <span className="text-sm-regular text-gray-600">Role</span>
                      </div>
                      <div className="min-w-0 flex-1 px-6 py-4 text-right">
                        <span className="block w-full text-right text-sm-medium text-gray-900 [overflow-wrap:anywhere]">
                          {userDetail.role?.name ?? '-'}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-start border-b border-gray-200">
                      <div className="w-[120px] shrink-0 px-6 py-4">
                        <span className="text-sm-regular text-gray-600">Status</span>
                      </div>
                      <div className="min-w-0 flex-1 px-6 py-4 text-right">
                        <span className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs font-medium ${userDetail.is_active ? 'border-success/200 bg-success/50 text-success/700' : 'border-gray-200 bg-gray-100 text-gray-700'}`}>
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
                                className="text-xs-medium inline-flex items-center rounded-full border border-gray-200 bg-gray-50 px-2 py-0.5 text-gray-700"
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

              {/* Changes */}
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
                            <img src={userDetail.updater.avatar_full_url} alt="" className="h-6 w-6 rounded-full object-cover" />
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
                            <img src={userDetail.creator.avatar_full_url} alt="" className="h-6 w-6 rounded-full object-cover" />
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
    </>
  )
}
