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
  MyHorizontalTabV2,
  MyModalSlider,
  MyTextField,
} from '@interstellar-component'
import { useApp } from '@src/AppContext'
import { Access } from '@src/services/Helper'
import { useSettings } from '../../Context'
import UserDetail from './UserDetail'
import UserForm from './UserForm'
import ImportUserSlider from './ImportUserSlider'
import MyUserStatusChip from './MyUserStatusChip'

export default function UserTab() {
  const { hasPermission } = useApp()
  const {
    users,
    userPagination,
    userPage,
    setUserPage,
    isLoadingUsers,
    selectedUserIds,
    userSortField,
    userSortOrder,
    userStatusFilter,
    setUserStatusFilter,
    userFilters,
    handleUserFilterChange,
    handleUserSort,
    handleUserSelectionChange,
    userPanel,
    closeUserPanel,
    fetchUsers,
    openUserDetail,
    openCreateUser,
    openImportUser,
    exportUsers,
    deleteUsers,
  } = useSettings()

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)

  // Initial fetch + refetch on status/filter/sort change
  useEffect(() => {
    fetchUsers(1, '')
  }, [fetchUsers])

  const canAddUser = hasPermission(Access.USER_MANAGEMENT, 'add_new')
  const canDeleteUser = hasPermission(Access.USER_MANAGEMENT, 'delete')

  const userTableValues = {
    data: users,
    meta: {
      current_page: userPagination.page,
      per_page: userPagination.limit,
      total: userPagination.total,
    },
    checkedAll:
      users.length > 0 && users.every((u) => u.checked),
  }

  const handleUserPageChange = (page) => {
    setUserPage(page)
    fetchUsers(page)
  }

  const handleConfirmDelete = async () => {
    setDeleteConfirmOpen(false)
    await deleteUsers(selectedUserIds)
  }

  return (
    <>
      {/* ── Sliders ──────────────────────────────────────────── */}
      <MyModalSlider
        scrim
        open={userPanel === 'detail'}
        element={<UserDetail />}
        onClose={closeUserPanel}
      />
      <MyModalSlider
        scrim
        open={userPanel === 'create' || userPanel === 'edit'}
        element={
          userPanel === 'create' || userPanel === 'edit' ? (
            <UserForm mode={userPanel} />
          ) : null
        }
        onClose={closeUserPanel}
      />
      <MyModalSlider
        scrim
        open={userPanel === 'import'}
        element={<ImportUserSlider />}
        onClose={closeUserPanel}
      />

      {/* ── Modals ───────────────────────────────────────────── */}
      <MyConfirmModal
        open={deleteConfirmOpen}
        title="Delete users"
        message={`Are you sure you want to delete ${selectedUserIds.length} user(s)? This action cannot be undone.`}
        icon={<Trash01 className="text-error/600" />}
        bgColor="bg-error-100"
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
      />

      {/* ── Table Card ───────────────────────────────────────── */}
      <div className="flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        {/* Header row */}
        <div className="flex flex-col justify-between gap-4 border-b border-gray-200 p-5 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <h3 className="text-[18px] font-semibold text-gray-900">
              User
            </h3>
            <span className="rounded-full border border-brand/200 bg-brand/50 px-2.5 py-0.5 text-xs font-medium text-brand/700">
              {userPagination.total} item
            </span>
          </div>
          <div className="flex flex-wrap gap-3">
            {canDeleteUser && (
              <MyButton
                color="error"
                size="md"
                variant="outlined"
                disabled={selectedUserIds.length === 0}
                onClick={() => setDeleteConfirmOpen(true)}
              >
                <Trash01
                  className="h-5 w-5 text-error/700"
                  stroke="currentColor"
                />
                <p className="text-sm-semibold">Delete</p>
              </MyButton>
            )}
            <MyButton
              color="primary"
              size="md"
              variant="outlined"
              onClick={exportUsers}
            >
              <DownloadCloud01 className="h-5 w-5" />
              <p className="text-sm-semibold">Download</p>
            </MyButton>
            <MyButton
              color="secondary"
              size="md"
              variant="outlined"
              onClick={openImportUser}
            >
              <UploadCloud01 className="h-5 w-5" />
              <p className="text-sm-semibold">Import</p>
            </MyButton>
            {canAddUser && (
              <MyButton
                color="primary"
                size="md"
                variant="filled"
                onClick={openCreateUser}
              >
                <Plus
                  className="h-5 w-5 text-white"
                  stroke="currentColor"
                />
                <p className="text-sm-semibold">New user</p>
              </MyButton>
            )}
          </div>
        </div>

        {/* Filter row */}
        <div className="flex flex-col gap-4 border-b border-gray-200 p-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="w-full max-w-sm">
            <MyTextField
              placeholder="Search for users"
              startAdornment={
                <SearchLg
                  className="size-5 text-gray-light/600"
                  stroke="currentColor"
                />
              }
              focusShadow="#365CC3"
              onChangeForm={debounce((e) => {
                setUserPage(1)
                fetchUsers(1, e.target.value)
              }, 500)}
            />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <MyFilterModal
              id="filter-user"
              currentFilters={userFilters}
              onChange={(filter) => {
                handleUserFilterChange(filter)
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
            {/* <MyButton
              color="gray"
              size="sm"
              variant="tertiary"
              customClassname="text-gray-700"
            >
              <EyeOff
                className="h-4 w-4 text-gray-500"
                stroke="currentColor"
              />
              Hide fields
            </MyButton> */}
            <MyHorizontalTabV2
              value={userStatusFilter}
              onChange={setUserStatusFilter}
              fitContent
              tabs={[
                { value: 'all', label: 'All' },
                { value: 'active', label: 'Active' },
                { value: 'inactive', label: 'Inactive' },
              ]}
            />
          </div>
        </div>

        {/* Data table */}
        <MyDataTable
          values={userTableValues}
          selectionMode="multiple"
          onSelectionChange={handleUserSelectionChange}
          loading={isLoadingUsers}
          onPageChange={handleUserPageChange}
          currentSortFieldFromParams={userSortField}
          currentSortOrderFromParams={userSortOrder}
          onClick={(row) => openUserDetail(row.id)}
        >
          <MyColumn
            header="Name"
            field="name"
            onSort={handleUserSort}
            body={(row) => (
              <div className="flex items-center gap-3 whitespace-nowrap py-1">
                {row.avatar_url ? (
                  <img
                    src={row.avatar_full_url}
                    alt={row.name}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-sm font-medium text-gray-600">
                    {row.name?.charAt(0)?.toUpperCase()}
                  </div>
                )}
                <div className="flex flex-col gap-0.5">
                  <span
                    className={`text-sm font-medium ${row.checked ? 'text-[#6941C6]' : 'text-gray-900'}`}
                  >
                    {row.name}
                  </span>
                  <span className="text-sm text-gray-500">
                    {row.role?.name}
                  </span>
                </div>
              </div>
            )}
          />
          <MyColumn
            header="Status"
            field="is_active"
            onSort={handleUserSort}
            body={(row) => (
              <MyUserStatusChip status={row.is_active} />
            )}
          />
          <MyColumn
            header="Email"
            field="email"
            onSort={handleUserSort}
            body={(row) => (
              <span className="text-sm text-gray-600">
                {row.email}
              </span>
            )}
          />
          <MyColumn
            header="Phone"
            field="phone"
            onSort={handleUserSort}
            body={(row) => (
              <span className="text-sm text-gray-600">
                {row.phone ?? '-'}
              </span>
            )}
          />
          <MyColumn
            header="Company"
            field="company"
            body={(row) => (
              <span className="text-sm text-gray-600">
                {row.user_companies
                  ?.map((c) => c.name ?? c.company?.name)
                  .filter(Boolean)
                  .join(', ') || '-'}
              </span>
            )}
          />
        </MyDataTable>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-gray-200 bg-white px-6 py-4">
          <span className="text-sm font-medium text-gray-600">
            Page {userPagination.page} of{' '}
            {userPagination.total_pages}
          </span>
          <div className="flex gap-3">
            <MyButton
              color="secondary"
              variant="outlined"
              size="sm"
              disabled={userPagination.page <= 1}
              onClick={() =>
                handleUserPageChange(userPagination.page - 1)
              }
            >
              Previous
            </MyButton>
            <MyButton
              color="secondary"
              variant="outlined"
              size="sm"
              disabled={
                userPagination.page >= userPagination.total_pages
              }
              onClick={() =>
                handleUserPageChange(userPagination.page + 1)
              }
            >
              Next
            </MyButton>
          </div>
        </div>
      </div>
    </>
  )
}
