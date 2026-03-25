import React from 'react'
import {
  SearchMd,
  FilterLines,
  Trash01,
  Plus,
  EyeOff,
} from '@untitled-ui/icons-react'
import { MyColumn, MyDataTable } from '@interstellar-component'
import { useCompany } from '../Context'

function getBadgeColor(status) {
  switch (status) {
    case 'Waiting CLIK approval':
      return 'bg-warning/50 text-warning/700 border border-warning/200'
    case 'Rejected':
      return 'bg-error/50 text-error/700 border border-error/200'
    case 'Active':
      return 'bg-success/50 text-success/700 border border-success/200'
    case 'Document submission':
    default:
      return 'bg-gray-100 text-gray-700 border border-gray-200'
  }
}

function getDotColor(status) {
  switch (status) {
    case 'Waiting CLIK approval':
      return 'bg-warning/500'
    case 'Rejected':
      return 'bg-error/500'
    case 'Active':
      return 'bg-success/500'
    case 'Document submission':
    default:
      return 'bg-gray-500'
  }
}

function CompanyTable() {
  const {
    searchTerm,
    setSearchTerm,
    companies,
    sortField,
    sortOrder,
    handleSort,
    handleSelectionChange,
    selectedStatus,
    setSelectedStatus,
  } = useCompany()

  const values = {
    data: companies || [],
    meta: {
      current_page: 1,
      next_page: 2,
      per_page: 10,
      total: companies?.length || 0,
    },
    checkedAll: companies?.every((d) => d.checked),
  }

  return (
    <div className="px-8 pb-8">
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        {/* Table Control Header */}
        <div className="flex flex-col gap-5 p-5 border-b border-gray-200">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center justify-between">
            <div className="flex items-center gap-3">
              <h3 className="text-[18px] font-semibold text-gray-900">Company List</h3>
              <span className="rounded-full bg-brand/50 border border-brand/200 px-2.5 py-0.5 text-xs font-medium text-brand/700">
                1,480 item
              </span>
            </div>
            <div className="flex flex-wrap gap-3">
              <button className="flex items-center gap-2 rounded-lg border border-error/300 bg-white px-4 py-2 text-sm font-semibold text-error/700 shadow-sm hover:bg-error/50 focus:outline-none focus:ring-2 focus:ring-error/500 focus:ring-offset-2">
                <Trash01 className="h-5 w-5" />
                Delete
              </button>
              <button className="flex items-center gap-2 rounded-lg border border-transparent bg-brand/600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand/700 focus:outline-none focus:ring-2 focus:ring-brand/500 focus:ring-offset-2">
                <Plus className="h-5 w-5" />
                New company
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="relative w-full max-w-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <SearchMd className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full rounded-lg border border-gray-300 bg-white p-2 pl-9 pr-3 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:border-brand/500 focus:outline-none focus:ring-1 focus:ring-brand/500"
                placeholder="Search for company"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-brand/500 focus:ring-offset-2">
                <FilterLines className="h-4 w-4 text-gray-500" />
                Filters
              </button>
              <button className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-brand/500 focus:ring-offset-2">
                <EyeOff className="h-4 w-4 text-gray-500" />
                Hide fields
              </button>
              <div className="inline-flex rounded-lg border border-gray-200 bg-white p-0.5">
                {['All status', 'Active', 'Expired'].map((cat) => (
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
        </div>

        <MyDataTable
          values={values}
          selectionMode="multiple"
          onSelectionChange={handleSelectionChange}
          paginator
          currentSortFieldFromParams={sortField}
          currentSortOrderFromParams={sortOrder}
        >
          <MyColumn
            header="Company name & ID"
            field="name"
            onSort={handleSort}
            body={(row) => (
              <div className="flex flex-col gap-0.5 py-1 whitespace-nowrap">
                <span className="text-sm font-medium text-gray-900">{row.name}</span>
                <span className="text-sm text-gray-500">{row.companyId}</span>
              </div>
            )}
          />
          <MyColumn
            header="Member status"
            field="memberStatus"
            onSort={handleSort}
            body={(row) => (
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium ${getBadgeColor(
                  row.memberStatus
                )}`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${getDotColor(row.memberStatus)}`} />
                {row.memberStatus}
              </span>
            )}
          />
          <MyColumn
            header="Quota left"
            field="quotaLeft"
            onSort={handleSort}
            body={(row) => <span className="text-sm text-gray-600">{row.quotaLeft}</span>}
          />
        </MyDataTable>
      </div>
    </div>
  )
}

export default CompanyTable
