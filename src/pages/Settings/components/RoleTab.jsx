import { useEffect, useRef, useState } from 'react'
import {
  SearchMd,
  FilterLines,
  Trash01,
  Plus,
  EyeOff,
} from '@untitled-ui/icons-react'
import { MyDataTable, MyColumn, MyButton, MyConfirmModal } from '@interstellar-component'
import { useApp } from '@src/AppContext'
import { Access } from '@src/services/Helper'
import { useSettings } from '../Context'
import RoleDetail from './RoleDetail'
import RoleForm from './RoleForm'

export default function RoleTab() {
  const { hasPermission } = useApp()
  const {
    roles,
    rolePagination,
    rolePage, setRolePage,
    roleSearchTerm, setRoleSearchTerm,
    isLoadingRoles,
    selectedRoleIds,
    roleSortField, roleSortOrder,
    handleRoleSort, handleRoleSelectionChange,
    rolePanel,
    fetchRoles,
    openRoleDetail, openCreateRole, closeRolePanel,
    deleteRoles,
  } = useSettings()

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)

  // Initial fetch
  useEffect(() => {
    fetchRoles(1, '')
  }, [fetchRoles])

  // Debounced search
  const roleSearchInitialized = useRef(false)
  useEffect(() => {
    if (!roleSearchInitialized.current) {
      roleSearchInitialized.current = true
      return
    }
    const timer = setTimeout(() => {
      setRolePage(1)
      fetchRoles(1, roleSearchTerm)
    }, 400)
    return () => clearTimeout(timer)
  }, [roleSearchTerm, fetchRoles])

  const canAddRole = hasPermission(Access.ROLE_ACCESS, 'add_new')
  const canDeleteRole = hasPermission(Access.ROLE_ACCESS, 'delete')

  const roleTableValues = {
    data: roles,
    meta: {
      current_page: rolePagination.page,
      per_page: rolePagination.limit,
      total: rolePagination.total,
    },
    checkedAll: roles.length > 0 && roles.every((r) => r.checked),
  }

  const handleRolePageChange = (page) => {
    setRolePage(page)
    fetchRoles(page, roleSearchTerm)
  }

  const handleConfirmDelete = async () => {
    setDeleteConfirmOpen(false)
    await deleteRoles(selectedRoleIds)
  }

  return (
    <>
      <MyConfirmModal
        open={deleteConfirmOpen}
        title="Delete roles"
        message={`Are you sure you want to delete ${selectedRoleIds.length} role(s)? This action cannot be undone.`}
        icon={<Trash01 className="text-error-600" />}
        bgColor="bg-error-100"
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
      />

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden flex flex-col">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center justify-between p-5 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <h3 className="text-[18px] font-semibold text-gray-900">Role</h3>
            <span className="rounded-full bg-brand/50 border border-brand/200 px-2.5 py-0.5 text-xs font-medium text-brand/700">
              {rolePagination.total} item
            </span>
          </div>
          <div className="flex flex-wrap gap-3">
            {canDeleteRole && (
              <MyButton
                color="error"
                size="md"
                variant="outlined"
                disabled={selectedRoleIds.length === 0}
                onClick={() => setDeleteConfirmOpen(true)}
              >
                <Trash01 className="w-5 h-5 text-error/700" stroke="currentColor" />
                Delete
              </MyButton>
            )}
            {canAddRole && (
              <MyButton color="primary" size="md" variant="filled" onClick={openCreateRole}>
                <Plus className="w-5 h-5 text-white" stroke="currentColor" />
                New role
              </MyButton>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between p-5 border-b border-gray-200">
          <div className="relative w-full max-w-sm">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <SearchMd className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full rounded-lg border border-gray-300 bg-white p-2 pl-9 pr-3 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:border-brand/500 focus:outline-none focus:ring-1 focus:ring-brand/500"
              placeholder="Search roles"
              value={roleSearchTerm}
              onChange={(e) => setRoleSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <MyButton color="secondary" size="md" variant="outlined" customClassname="text-gray-700">
              <FilterLines className="h-4 w-4 text-gray-500" stroke="currentColor" />
              Filters
            </MyButton>
            <MyButton color="secondary" size="md" variant="outlined" customClassname="text-gray-700">
              <EyeOff className="h-4 w-4 text-gray-500" stroke="currentColor" />
              Hide fields
            </MyButton>
          </div>
        </div>

        <MyDataTable
          values={roleTableValues}
          selectionMode="multiple"
          onSelectionChange={handleRoleSelectionChange}
          paginator
          loading={isLoadingRoles}
          onPageChange={handleRolePageChange}
          currentSortFieldFromParams={roleSortField}
          currentSortOrderFromParams={roleSortOrder}
          onClick={(row) => openRoleDetail(row.id)}
        >
          <MyColumn
            header="Role name"
            field="name"
            onSort={handleRoleSort}
            body={(row) => (
              <span
                className={`text-sm-medium py-1 whitespace-nowrap ${
                  row.checked ? 'text-[#6941C6]' : 'text-gray-900'
                }`}
              >
                {row.name}
              </span>
            )}
          />
        </MyDataTable>
      </div>

      {rolePanel === 'detail' && <RoleDetail />}
      {(rolePanel === 'create' || rolePanel === 'edit') && <RoleForm mode={rolePanel} />}
    </>
  )
}
