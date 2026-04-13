import React, { useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { debounce } from 'lodash'
import {
  SearchMd,
  FilterLines,
  Trash01,
  Plus,
} from '@untitled-ui/icons-react'
import {
  MyColumn,
  MyDataTable,
  MyModalSlider,
  MyButton,
  MyHorizontalTabV2,
} from '@interstellar-component'
import { useCompany } from '../Context'
import MyDetailSlider from './MyDetailSlider/DetailSlider'
import MyMemberStatusChip from './MyMemberStatusChip'

const STATUS_TABS = [
  { label: 'All status', value: 'All status' },
  { label: 'Active', value: 'active' },
  { label: 'Expired', value: 'expired' },
]

function CompanyTable() {
  const navigate = useNavigate()
  const {
    handleCurrentSlider,
    currentSlider,
    setSearchTerm,
    companyRows,
    companyMeta,
    company,
    handleCompanySort,
    handleCompanySelectionChange,
    selectedStatus,
    setSelectedStatus,
    setPage,
    sortField,
    sortOrder,
  } = useCompany()

  const rows = companyRows || []
  const selectedCount = rows.filter((d) => d.checked).length

  const total = Number(companyMeta?.total ?? rows.length) || 0
  const currentPage = Number(companyMeta?.current_page ?? 1) || 1
  const perPage = Number(companyMeta?.per_page ?? companyMeta?.limit ?? 10) || 10
  const totalPages = Math.max(1, Number(companyMeta?.total_page ?? 1) || 1)

  const itemCountLabel = new Intl.NumberFormat(undefined, {
    maximumFractionDigits: 0,
  }).format(total)

  const debouncedSearch = useMemo(
    () => debounce((value) => setSearchTerm(value), 800),
    [setSearchTerm]
  )

  useEffect(
    () => () => {
      debouncedSearch.cancel()
    },
    [debouncedSearch]
  )

  const values = {
    data: rows,
    meta: {
      current_page: currentPage,
      per_page: perPage,
      total,
    },
    loading: company.loading,
    checkedAll: rows.length > 0 && rows.every((d) => d.checked),
  }

  return (
    <>
      <MyModalSlider
        open={currentSlider?.current === 'details-slider'}
        element={<MyDetailSlider />}
        onClose={() => handleCurrentSlider(null)}
      />

      <div className="px-8 pb-8 pt-2">
        <div className="w-full rounded-xl border border-gray-light/200 shadow-shadows/shadow-xs">
          <div className="flex flex-col">
            <div className="flex justify-between items-center rounded-t-xl bg-gray-light/50 py-4 pl-6">
              <div className="flex flex-col gap-13">
                <div className="flex gap-x-2">
                  <h3 className="text-[18px] font-semibold text-gray-900">Company List</h3>
                  <span className="rounded-full bg-brand/50 border border-brand/200 px-2.5 py-0.5 text-xs font-medium text-brand/700">
                    {itemCountLabel} item
                  </span>
                </div>
              </div>
              <div className="flex flex-wrap gap-3 px-3.5 py-2">
                {selectedCount > 0 ? (
                  <MyButton color="error" variant="outlined" size="md" type="button">
                    <Trash01 className="h-5 w-5" />
                    <p className="text-sm-semibold">Delete</p>
                  </MyButton>
                ) : null}
                <MyButton
                  color="primary"
                  variant="filled"
                  size="md"
                  type="button"
                  onClick={() => navigate('/register-company-info')}
                >
                  <Plus className="h-5 w-5" />
                  <p className="text-sm-semibold">New company</p>
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
                id="input-search-company"
                type="text"
                className="block w-full rounded-lg border border-gray-300 bg-white p-2 pl-9 pr-3 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:border-brand/500 focus:outline-none focus:ring-1 focus:ring-brand/500"
                placeholder="Search for company"
                onChange={(e) => debouncedSearch(e.target.value)}
              />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <MyButton color="gray" size="sm" variant="tertiary" customClassname="text-gray-700">
                <FilterLines className="h-4 w-4 text-gray-500" stroke="currentColor" />
                Filters
              </MyButton>
              <MyHorizontalTabV2
                value={selectedStatus}
                onChange={setSelectedStatus}
                fitContent
                tabs={STATUS_TABS}
              />
            </div>
          </div>

          <MyDataTable
            values={values}
            selectionMode="multiple"
            onSelectionChange={handleCompanySelectionChange}
            currentSortFieldFromParams={sortField}
            currentSortOrderFromParams={sortOrder}
            onClick={(row) => handleCurrentSlider({ current: 'details-slider' }, row.id, row)}
          >
            <MyColumn
              header="Company name & ID"
              field="name"
              onSort={handleCompanySort}
              body={(row) => (
                <div className="flex items-center gap-3 py-1 whitespace-nowrap">
                  {row.logo_url ? (
                    <img
                      src={row.logo_url}
                      alt=""
                      className="h-10 w-10 shrink-0 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-500">
                      <span className="text-sm font-medium">{row.name?.charAt(0) ?? '?'}</span>
                    </div>
                  )}
                  <div className="flex min-w-0 flex-col gap-0.5">
                    <span className="text-sm font-medium text-brand/700">{row.name}</span>
                    <span className="truncate text-sm text-gray-500" title={row.company_id}>
                      {row.company_id}
                    </span>
                  </div>
                </div>
              )}
            />
            <MyColumn
              header="Member status"
              field="member_status"
              onSort={handleCompanySort}
              body={(row) => <MyMemberStatusChip status={row.enrollment_status} />}
            />
            <MyColumn
              header="Quota left"
              field="quota_left"
              onSort={handleCompanySort}
              body={(row) => (
                <span className="text-sm text-gray-600 tabular-nums">
                  {row.enrollment_step != null ? String(row.enrollment_step) : '—'}
                </span>
              )}
            />
          </MyDataTable>

          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-white">
            <span className="text-sm text-gray-600 font-medium">
              Page {currentPage} of {totalPages}
            </span>
            <div className="flex gap-3">
              <MyButton
                color="secondary"
                variant="outlined"
                size="sm"
                disabled={currentPage <= 1}
                onClick={() => setPage(currentPage - 1)}
              >
                Previous
              </MyButton>
              <MyButton
                color="secondary"
                variant="outlined"
                size="sm"
                disabled={currentPage >= totalPages}
                onClick={() => setPage(currentPage + 1)}
              >
                Next
              </MyButton>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default CompanyTable
