import { useEffect, useState } from 'react'
import {
  SearchLg,
  FilterLines,
  Trash01,
  Plus,
  EyeOff,
  DownloadCloud01,
  UploadCloud01,
} from '@untitled-ui/icons-react'
import { debounce } from 'lodash'
import {
  MyDataTable,
  MyColumn,
  MyButton,
  MyConfirmModal,
  MyFilterModal,
  MyModalSlider,
  MyTextField,
} from '@interstellar-component'
import { useApp } from '@src/AppContext'
import { Access } from '@src/services/Helper'
import { useSettings } from '../../Context'
import RoleDetail from './RoleDetail'
import RoleForm from './RoleForm'

export default function RoleTab() {
  const { hasPermission } = useApp()
  const {
    roles,
    rolePagination,
    setRolePage,
    isLoadingRoles,
    selectedRoleIds,
    roleSortField,
    roleSortOrder,
    roleFilters,
    handleRoleFilterChange,
    handleRoleSort,
    handleRoleSelectionChange,
    rolePanel,
    closeRolePanel,
    fetchRoles,
    openRoleDetail,
    openCreateRole,
    exportRoles,
    deleteRoles,
  } = useSettings()

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)

  // Initial fetch + refetch on filter change
  useEffect(() => {
    fetchRoles(1, '')
  }, [fetchRoles])

  const canAddRole = hasPermission(Access.ROLE_ACCESS, 'add_new')
  const canDeleteRole = hasPermission(Access.ROLE_ACCESS, 'delete')

  const roleTableValues = {
    data: roles,
    meta: rolePagination,
    checkedAll: roles.length > 0 && roles.every((r) => r.checked),
  }

  const handleRolePageChange = (page) => {
    setRolePage(page)
    fetchRoles(page)
  }

  const handleConfirmDelete = async () => {
    setDeleteConfirmOpen(false)
    await deleteRoles(selectedRoleIds)
  }

  return (
    <>
      {/* Sliders */}
      <MyModalSlider
        scrim
        open={rolePanel === 'detail'}
        element={<RoleDetail />}
        onClose={closeRolePanel}
      />
      <MyModalSlider
        scrim
        open={rolePanel === 'create' || rolePanel === 'edit'}
        element={
          rolePanel === 'create' || rolePanel === 'edit' ? (
            <RoleForm mode={rolePanel} />
          ) : null
        }
        onClose={closeRolePanel}
      />

      <MyConfirmModal
        open={deleteConfirmOpen}
        title="Delete roles"
        message={`Are you sure you want to delete ${selectedRoleIds.length} role(s)? This action cannot be undone.`}
        icon={<Trash01 className="text-error-600" />}
        positiveButtonColor="error"
        positiveActionWord="Delete"
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
      />

      <div className="flex flex-1 min-h-0 flex-col overflow-hidden border border-gray/200 bg-white shadow-sm rounded-xl">
        <div className="flex flex-col justify-between gap-4 border-b border-gray/200 px-6 py-3 sm:flex-row sm:items-center bg-gray/25">
          <div className="flex items-center gap-3">
            <h3 className="text-[14px] font-semibold text-gray-900">Role</h3>
            <span className="rounded-full border border-gray-blue/200 bg-gray-blue/50 px-2 py-0.5 text-xs font-medium text-gray-blue/700">
              {rolePagination.total} item
            </span>
          </div>
          <div className="flex flex-wrap gap-3">
            {canDeleteRole && selectedRoleIds.length > 0 && (
              <MyButton
                color="error"
                size="md"
                variant="outlined"
                onClick={() => setDeleteConfirmOpen(true)}
              >
                <Trash01 className="w-5 h-5 text-error/700" stroke="currentColor" />
                <p className="text-sm-semibold">Delete</p>
              </MyButton>
            )}
            {/* <MyButton
              color="primary"
              size="md"
              variant="outlined"
              onClick={exportRoles}
            >
              <DownloadCloud01 className="h-5 w-5" />
              <p className="text-sm-semibold">Download</p>
            </MyButton> */}
            {canAddRole && (
              <MyButton color="primary" size="md" variant="filled" onClick={openCreateRole}>
                <Plus className="w-5 h-5 text-white" stroke="currentColor" />
                <p className="text-sm-semibold">New role</p>
              </MyButton>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between p-5 border-b border-gray-200">
          <div className="w-full max-w-sm">
            <MyTextField
              focusColor="#42307D"
               
              placeholder="Search roles"
              startAdornment={
                <SearchLg
                  className="size-5 text-gray-light/600"
                  stroke="currentColor"
                />
              }
              onChangeForm={debounce((e) => {
                setRolePage(1)
                fetchRoles(1, e.target.value)
              }, 500)}
            />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <MyFilterModal
              id="filter-role"
              currentFilters={roleFilters}
              onChange={(filter) => {
                handleRoleFilterChange(filter)
              }}
              target={(open, handleClick) => (
                <MyButton
                  removeWhite
                  onClick={handleClick}
                  color="gray"
                  variant="tertiary"
                  size="sm"
                  customClassname="text-gray-700"
                >
                  <FilterLines
                    className="h-4 w-4 text-gray-500"
                    stroke="currentColor"
                  />
                  Filters
                </MyButton>
              )}
            />
            {/* <MyButton color="gray" size="sm" variant="tertiary" customClassname="text-gray-700">
              <EyeOff className="h-4 w-4 text-gray-500" stroke="currentColor" />
              Hide fields
            </MyButton> */}
          </div>
        </div>

        <div className="flex flex-1 min-h-0 flex-col">
        <MyDataTable
          values={roleTableValues}
          selectionMode="multiple"
          onSelectionChange={handleRoleSelectionChange}
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
                className={`text-sm-medium py-1 whitespace-nowrap ${row.checked ? 'text-[#6941C6]' : 'text-gray-900'
                  }`}
              >
                {row.name}
              </span>
            )}
          />
        </MyDataTable>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-white">
          <span className="text-sm text-gray-600 font-medium">
            Page {rolePagination.current_page} of {rolePagination.total_page}
          </span>
          <div className="flex gap-3">
            <MyButton
              color="secondary"
              variant="outlined"
              size="sm"
              disabled={rolePagination.current_page <= 1}
              onClick={() => handleRolePageChange(rolePagination.current_page - 1)}
            >
              Previous
            </MyButton>
            <MyButton
              color="secondary"
              variant="outlined"
              size="sm"
              disabled={rolePagination.current_page >= rolePagination.total_page}
              onClick={() => handleRolePageChange(rolePagination.current_page + 1)}
            >
              Next
            </MyButton>
          </div>
        </div>
      </div>

    </>
  )
}
