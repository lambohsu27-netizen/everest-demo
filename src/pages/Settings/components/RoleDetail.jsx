import { useState } from 'react'
import { Edit01, Trash01 } from '@untitled-ui/icons-react'
import { MyButton, MyConfirmModal } from '@interstellar-component'
import { useApp } from '@src/AppContext'
import { Access } from '@src/services/Helper'
import { useSettings } from '../Context'
import SettingsPanel from './SettingsPanel'

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
          <div className="flex flex-col gap-8">
            {/* Title row */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">{roleDetail.name}</h2>
                {roleDetail.description && (
                  <p className="mt-1 text-sm text-gray-500">{roleDetail.description}</p>
                )}
              </div>
              <div className="flex shrink-0 gap-2">
                {canDelete && (
                  <MyButton
                    color="error"
                    size="md"
                    variant="outlined"
                    onClick={() => setDeleteConfirmOpen(true)}
                  >
                    <Trash01 className="w-4 h-4" stroke="currentColor" />
                    Delete
                  </MyButton>
                )}
                {canEdit && (
                  <MyButton color="primary" size="md" variant="filled" onClick={openEditRole}>
                    <Edit01 className="w-4 h-4" stroke="currentColor" />
                    Edit
                  </MyButton>
                )}
              </div>
            </div>

            {/* Permissions */}
            <div className="flex flex-col gap-6">
              <h3 className="text-base font-semibold text-gray-900">Permissions</h3>
              {roleDetail.permissions?.length === 0 ? (
                <p className="text-sm text-gray-500">No permissions assigned.</p>
              ) : (
                <div className="flex flex-col divide-y divide-gray-100 rounded-xl border border-gray-200">
                  {roleDetail.permissions?.map((perm) => (
                    <div key={perm.module_key} className="flex flex-col gap-3 px-5 py-4">
                      <span className="text-sm font-semibold text-gray-700 capitalize">
                        {perm.module_name ?? perm.module_key.replace(/_/g, ' ')}
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {perm.sub_permissions?.map((sub) => (
                          <span
                            key={sub.key ?? sub}
                            className="inline-flex items-center rounded-full border border-brand-200 bg-brand-50 px-2.5 py-0.5 text-xs font-medium text-brand-700 capitalize"
                          >
                            {(sub.label ?? sub.key ?? sub).replace(/_/g, ' ')}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </SettingsPanel>
    </>
  )
}
