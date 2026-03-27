import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  SearchMd,
  FilterLines,
  Trash01,
  Plus,
  DownloadCloud01,
  UploadCloud01,
} from '@untitled-ui/icons-react'
import { MyColumn, MyDataTable, MyConsentStatusChip } from '@interstellar-component'
import { useWorkforce } from '../Context'

function WorkforceTable() {
  const navigate = useNavigate()
  const {
    searchTerm,
    setSearchTerm,
    workforce,
    sortField,
    sortOrder,
    handleSort,
    handleSelectionChange,
    selectedCategory,
    setSelectedCategory,
    handleCurrentSlider,
  } = useWorkforce()

  const values = {
    data: workforce || [],
    meta: {
      current_page: 1,
      next_page: 2,
      per_page: 10,
      total: workforce?.length || 0,
    },
    checkedAll: workforce?.every((d) => d.checked),
  }

  return (
    <div className="px-8 pb-8">
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        {/* Table Control Header */}
        <div className="flex flex-col gap-5 p-5 border-b border-gray-200">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center justify-between">
            <div className="flex items-center gap-3">
              <h3 className="text-[18px] font-semibold text-gray-900">Employee List</h3>
              <span className="rounded-full bg-brand/50 border border-brand/200 px-2.5 py-0.5 text-xs font-medium text-brand/700">
                1,480 item
              </span>
            </div>
            <div className="flex flex-wrap gap-3">
              <button className="flex items-center gap-2 rounded-lg border border-error/300 bg-white px-4 py-2 text-sm font-semibold text-error/700 shadow-sm hover:bg-error/50 focus:outline-none focus:ring-2 focus:ring-error/500 focus:ring-offset-2">
                <Trash01 className="h-5 w-5" />
                Delete
              </button>
              <button className="flex items-center gap-2 rounded-lg border border-brand/300 bg-white px-4 py-2 text-sm font-semibold text-brand/700 shadow-sm hover:bg-brand/50 focus:outline-none focus:ring-2 focus:ring-brand/500 focus:ring-offset-2">
                <DownloadCloud01 className="h-5 w-5" />
                Download PDF
              </button>
              <button className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-brand/500 focus:ring-offset-2">
                <UploadCloud01 className="h-5 w-5" />
                Import
              </button>
              <button
                onClick={() => handleCurrentSlider({ status: true, current: 'new-employee' })}
                className="flex items-center gap-2 rounded-lg border border-transparent bg-brand/600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand/700 focus:outline-none focus:ring-2 focus:ring-brand/500 focus:ring-offset-2">
                <Plus className="h-5 w-5" />
                New employee
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
                placeholder="Search for tickets"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-brand/500 focus:ring-offset-2">
                <FilterLines className="h-4 w-4 text-gray-500" />
                Filters
              </button>
              <div className="inline-flex rounded-lg border border-gray-200 bg-white p-0.5">
                {['All category', 'Employee', 'Candidate'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`rounded-md px-3 py-1.5 text-sm font-medium shadow-none transition-colors ${
                      selectedCategory === cat
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
          onClick={(row) => navigate(`/workforce/employee/${row.id}`)}
        >
          <MyColumn
            header="Name & Employee ID"
            field="name"
            onSort={handleSort}
            body={(row) => (
              <div className="flex items-center gap-3 py-1 whitespace-nowrap">
                {row.avatar ? (
                  <img
                    src={row.avatar}
                    alt=""
                    className="h-10 w-10 shrink-0 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-500">
                    <span className="text-sm font-medium">{row.name.charAt(0)}</span>
                  </div>
                )}
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-medium text-brand/700">{row.name}</span>
                  <span className="text-sm text-gray-500">{row.employeeId}</span>
                </div>
              </div>
            )}
          />
          <MyColumn
            header="Level"
            field="level"
            onSort={handleSort}
            body={(row) => <span className="text-sm text-gray-600">{row.level}</span>}
          />
          <MyColumn
            header="Category"
            field="category"
            onSort={handleSort}
            body={(row) => <span className="text-sm text-gray-600">{row.category}</span>}
          />
          <MyColumn
            header="Company"
            field="company"
            onSort={handleSort}
            body={(row) => (
              <span className="text-sm text-gray-600 whitespace-nowrap">{row.company}</span>
            )}
          />
          <MyColumn
            header="Consent Status"
            field="consentStatus"
            onSort={handleSort}
            body={(row) => <MyConsentStatusChip status={row.consentStatus} />}
          />
          <MyColumn
            header="Consent expiry"
            field="consentExpiry"
            onSort={handleSort}
            body={(row) => <span className="text-sm text-gray-600">{row.consentExpiry}</span>}
          />
        </MyDataTable>
      </div>
    </div>
  )
}

export default WorkforceTable
