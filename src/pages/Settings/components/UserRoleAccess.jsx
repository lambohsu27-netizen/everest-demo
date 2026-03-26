import React from 'react'
import {
  SearchMd,
  FilterLines,
  Trash01,
  Download01,
  Upload01,
  Plus,
  EyeOff,
} from '@untitled-ui/icons-react'
import { MyDataTable, MyColumn, MyHorizontalTabV2 } from '@interstellar-component'
import { useSettings } from '../Context'

export default function UserRoleAccess() {
  const {
    users,
    roles,
    searchTerm,
    setSearchTerm,
    roleSearchTerm,
    setRoleSearchTerm,
    sortField,
    sortOrder,
    handleSort,
    roleSortField,
    roleSortOrder,
    handleRoleSort,
    handleSelectionChange,
    handleRoleSelectionChange,
    selectedStatus,
    setSelectedStatus,
    activeSubTab,
    setActiveSubTab,
  } = useSettings()

  const userTableValues = {
    data: users,
    meta: {
      current_page: 1,
      next_page: 2,
      per_page: 10,
      total: users.length,
    },
    checkedAll: users.length > 0 && users.every((u) => u.checked),
  }

  const roleTableValues = {
    data: roles,
    meta: {
      current_page: 1,
      next_page: 2,
      per_page: 10,
      total: roles.length,
    },
    checkedAll: roles.length > 0 && roles.every((r) => r.checked),
  }

  return (
    <div className="flex flex-col pt-8">
      {/* Header section */}
      <div className="flex flex-col gap-1 w-full pb-6">
        <h2 className="text-lg font-semibold text-[#181d27]">User and role access</h2>
        <p className="text-sm text-[#535862]">
          Define employee levels and their associated consent and screening rules.
        </p>
      </div>

      {/* Primary Sub-tabs */}
      <div className="mb-6">
        <MyHorizontalTabV2
          value={activeSubTab}
          onChange={(val) => setActiveSubTab(val)}
          fitContent
          tabs={[
            { value: 'user', label: 'User' },
            { value: 'role', label: 'Role access' },
          ]}
        />
      </div>

      {activeSubTab === 'user' && (
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden flex flex-col">
          {/* Card Header */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center justify-between p-5 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <h3 className="text-[18px] font-semibold text-gray-900">User</h3>
              <span className="rounded-full bg-brand/50 border border-brand/200 px-2.5 py-0.5 text-xs font-medium text-brand/700">
                1,480 item
              </span>
            </div>
            <div className="flex flex-wrap gap-3">
              <button className="flex items-center gap-2 rounded-lg border border-error/300 bg-white px-4 py-2 text-sm font-semibold text-error/700 shadow-sm hover:bg-error/50 transition-colors">
                <Trash01 className="w-5 h-5 text-error/700" />
                Delete
              </button>
              <button className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-[#344054] shadow-sm hover:bg-gray-50 transition-colors">
                <Download01 className="w-5 h-5 text-[#344054]" />
                Download
              </button>
              <button className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-[#344054] shadow-sm hover:bg-gray-50 transition-colors">
                <Upload01 className="w-5 h-5 text-[#344054]" />
                Import
              </button>
              <button className="flex items-center gap-2 rounded-lg bg-[#6941C6] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#53389E] transition-colors">
                <Plus className="w-5 h-5 text-white" />
                New user
              </button>
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
                placeholder="Search for users"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 transition-colors">
                <FilterLines className="h-4 w-4 text-gray-500" />
                Filters
              </button>
              <button className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 transition-colors">
                <EyeOff className="h-4 w-4 text-gray-500" />
                Hide fields
              </button>
              <div className="inline-flex rounded-lg border border-gray-200 bg-white p-0.5">
                {['Active', 'Inactive'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedStatus(cat)}
                    className={`rounded-md px-3 py-1.5 text-sm font-medium shadow-none transition-colors ${
                      selectedStatus === cat
                        ? 'bg-gray-50 text-gray-900'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <MyDataTable
            values={userTableValues}
            selectionMode="multiple"
            onSelectionChange={handleSelectionChange}
            paginator
            currentSortFieldFromParams={sortField}
            currentSortOrderFromParams={sortOrder}
          >
            <MyColumn
              header="Company"
              field="name"
              onSort={handleSort}
              body={(row) => (
                <div className="flex items-center gap-3 py-1 whitespace-nowrap">
                  <img
                    src={row.avatar}
                    alt={row.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-medium text-[#6941C6]">{row.name}</span>
                    <span className="text-sm text-gray-500">{row.role}</span>
                  </div>
                </div>
              )}
            />
            <MyColumn
              header="Status"
              field="status"
              onSort={handleSort}
              body={(row) => (
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium ${
                    row.status === 'Active'
                      ? 'bg-success/50 text-success/700 border border-success/200'
                      : 'bg-gray-100 text-gray-700 border border-gray-200'
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      row.status === 'Active' ? 'bg-success/500' : 'bg-gray-500'
                    }`}
                  />
                  {row.status}
                </span>
              )}
            />
            <MyColumn
              header="Email"
              field="email"
              onSort={handleSort}
              body={(row) => <span className="text-sm text-gray-600">{row.email}</span>}
            />
            <MyColumn
              header="Phone"
              field="phone"
              onSort={handleSort}
              body={(row) => <span className="text-sm text-gray-600">{row.phone}</span>}
            />
            <MyColumn
              header="Company"
              field="company"
              onSort={handleSort}
              body={(row) => <span className="text-sm text-gray-600">{row.company}</span>}
            />
          </MyDataTable>
        </div>
      )}

      {activeSubTab === 'role' && (
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden flex flex-col">
          {/* Role Access Header */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center justify-between p-5 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <h3 className="text-[18px] font-semibold text-gray-900">Role</h3>
              <span className="rounded-full bg-brand/50 border border-brand/200 px-2.5 py-0.5 text-xs font-medium text-brand/700">
                12 item
              </span>
            </div>
            <div className="flex flex-wrap gap-3">
              <button className="flex items-center gap-2 rounded-lg border border-error/300 bg-white px-4 py-2 text-sm font-semibold text-error/700 shadow-sm hover:bg-error/50 transition-colors">
                <Trash01 className="w-5 h-5 text-error/700" />
                Delete
              </button>
              <button className="flex items-center gap-2 rounded-lg bg-[#6941C6] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#53389E] transition-colors">
                <Plus className="w-5 h-5 text-white" />
                New area
              </button>
            </div>
          </div>

          {/* Role Access Controls */}
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between p-5 border-b border-gray-200">
            <div className="relative w-full max-w-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <SearchMd className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full rounded-lg border border-gray-300 bg-white p-2 pl-9 pr-3 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:border-brand/500 focus:outline-none focus:ring-1 focus:ring-brand/500"
                placeholder="Search"
                value={roleSearchTerm}
                onChange={(e) => setRoleSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 transition-colors">
                <FilterLines className="h-4 w-4 text-gray-500" />
                Filters
              </button>
              <button className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 transition-colors">
                <EyeOff className="h-4 w-4 text-gray-500" />
                Hide fields
              </button>
            </div>
          </div>

          <MyDataTable
            values={roleTableValues}
            selectionMode="multiple"
            onSelectionChange={handleRoleSelectionChange}
            paginator
            currentSortFieldFromParams={roleSortField}
            currentSortOrderFromParams={roleSortOrder}
          >
            <MyColumn
              header="Role name"
              field="name"
              onSort={handleRoleSort}
              body={(row) => (
                <span
                  className={`text-sm font-medium py-1 whitespace-nowrap ${
                    row.checked ? 'text-[#6941C6]' : 'text-gray-900'
                  }`}
                >
                  {row.name}
                </span>
              )}
            />
          </MyDataTable>
        </div>
      )}
    </div>
  )
}
