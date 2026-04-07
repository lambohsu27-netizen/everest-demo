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
import { MyButton, MyColumn, MyDataTable, MyConsentStatusChip, MyHorizontalTabV2 } from '@interstellar-component'
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
    pagination,
    setPage,
  } = useWorkforce()

  const values = {
    data: workforce || [],
    meta: {
      current_page: pagination.page,
      per_page: pagination.limit,
      total: pagination.total,
    },
    checkedAll: workforce?.length > 0 && workforce?.every((d) => d.checked),
  }

  return (
    <div className="px-8 pb-8">
      <div className="w-full rounded-xl border border-gray-light/200 shadow-shadows/shadow-xs">
        {/* Table Control Header */}
        <div className="flex flex-col">
          <div className="flex justify-between items-center rounded-t-xl bg-gray-light/50 py-4 pl-6">
            <div className="flex flex-col gap-13">
            <div className="flex gap-x-2">
            <h3 className="text-[18px] font-semibold text-gray-900">Employee List</h3>
              <span className="rounded-full bg-brand/50 border border-brand/200 px-2.5 py-0.5 text-xs font-medium text-brand/700">
                {pagination.total} item
              </span>
            </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <MyButton
                color="error"
                variant="outlined"
                size="md"
              >
                <Trash01 className="h-5 w-5" />
                <p className="text-sm-semibold">Delete</p>
              </MyButton>
              <MyButton
                color="primary"
                variant="outlined"
                size="md"
              >
                <DownloadCloud01 className="h-5 w-5" />
                <p className="text-sm-semibold">Download PDF</p>
              </MyButton>
              <MyButton
                color="secondary"
                variant="outlined"
                size="md"
                onClick={() => handleCurrentSlider({ status: true, current: 'import-workforce' })}
              >
                <UploadCloud01 className="h-5 w-5" />
                <p className="text-sm-semibold">Import</p>
              </MyButton>
              <MyButton
                color="primary"
                variant="filled"
                size="md"
                onClick={() => handleCurrentSlider({ status: true, current: 'new-employee' })}
              >
                <Plus className="h-5 w-5" />
                <p className="text-sm-semibold">New employee</p>
              </MyButton>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 rounded-t-lg border border-gray-light/200 px-4 py-5">
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
              <MyButton color="gray" size="sm" variant="tertiary" customClassname="text-gray-700">
                <FilterLines className="h-4 w-4 text-gray-500" stroke="currentColor" />
                Filters
              </MyButton>
              <MyHorizontalTabV2
                value={selectedCategory}
                onChange={setSelectedCategory}
                fitContent
                tabs={[
                  { label: 'All category', value: 'All category' },
                  { label: 'Employee', value: 'Employee' },
                  { label: 'Candidate', value: 'Candidate' },
                ]}
              />
            </div>
          </div>

        <MyDataTable
          values={values}
          selectionMode="multiple"
          onSelectionChange={handleSelectionChange}
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

        {/* Custom Pagination Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-white">
          <span className="text-sm text-gray-600 font-medium">
            Page {pagination.page} of {pagination.total_pages}
          </span>
          <div className="flex gap-3">
            <MyButton
              color="secondary"
              variant="outlined"
              size="sm"
              disabled={pagination.page <= 1}
              onClick={() => setPage(pagination.page - 1)}
            >
              Previous
            </MyButton>
            <MyButton
              color="secondary"
              variant="outlined"
              size="sm"
              disabled={pagination.page >= pagination.total_pages}
              onClick={() => setPage(pagination.page + 1)}
            >
              Next
            </MyButton>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WorkforceTable
