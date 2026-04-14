import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { debounce } from 'lodash'
import {
  SearchLg,
  FilterLines,
  Trash01,
  Plus,
  DownloadCloud01,
  UploadCloud01,
} from '@untitled-ui/icons-react'
import {
  MyButton,
  MyColumn,
  MyDataTable,
  MyConsentStatusChip,
  MyHorizontalTabV2,
  MyConfirmModal,
  MyFilterModal,
  MyTextField,
  myToaster,
} from '@interstellar-component'
import { useWorkforce } from '../Context'
import { WorkforceService } from '../service'

const CATEGORY_TABS = [
  { label: 'All category', value: 'All category' },
  { label: 'Employee', value: 'Employee' },
  { label: 'Candidate', value: 'Candidate' },
]

function formatDate(value) {
  if (!value) return '—'
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return '—'
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

function WorkforceTable() {
  const navigate = useNavigate()
  const {
    workforce,
    workforceRows,
    workforceMeta,
    sortField,
    sortOrder,
    handleWorkforceSort,
    handleWorkforceSelectionChange,
    selectedCategory,
    setSelectedCategory,
    handleCurrentSlider,
    setPage,
    setSearchTerm,
    setParams,
    getWorkforce,
  } = useWorkforce()

  const rows = workforceRows || []
  const selectedRows = rows.filter((d) => d.checked)
  const selectedCount = selectedRows.length

  const total = Number(workforceMeta?.total ?? rows.length) || 0
  const currentPage = Number(workforceMeta?.current_page ?? 1) || 1
  const perPage = Number(workforceMeta?.per_page ?? workforceMeta?.limit ?? 10) || 10
  const totalPages = Math.max(1, Number(workforceMeta?.total_page ?? 1) || 1)

  const itemCountLabel = new Intl.NumberFormat(undefined, {
    maximumFractionDigits: 0,
  }).format(total)

  const debouncedSearch = useMemo(
    () => debounce((value) => setSearchTerm(value), 500),
    [setSearchTerm]
  )

  useEffect(
    () => () => {
      debouncedSearch.cancel()
    },
    [debouncedSearch]
  )

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleConfirmDelete = async () => {
    const ids = selectedRows.map((r) => r.id).filter(Boolean)
    if (ids.length === 0) return
    setIsDeleting(true)
    try {
      await WorkforceService.deleteWorkforce(ids)
      myToaster({ status: 'success', message: `${ids.length} employee(s) deleted.` })
      setDeleteConfirmOpen(false)
      await getWorkforce()
    } catch (e) {
      myToaster(e)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleExport = () => {
    const url = WorkforceService.exportWorkforce({
      ...(selectedCategory && selectedCategory !== 'All category'
        ? { category: selectedCategory.toLowerCase() }
        : {}),
    })
    if (url) window.open(url, '_blank')?.focus()
  }

  const values = {
    data: rows,
    meta: {
      current_page: currentPage,
      per_page: perPage,
      total,
    },
    loading: workforce.loading,
    checkedAll: rows.length > 0 && rows.every((d) => d.checked),
  }

  return (
    <>
      <MyConfirmModal
        open={deleteConfirmOpen}
        title="Delete employees"
        message={`Are you sure you want to delete ${selectedCount} employee(s)? This action cannot be undone.`}
        icon={<Trash01 className="text-error/600" />}
        positiveButtonColor="error"
        positiveActionWord={isDeleting ? 'Deleting...' : 'Delete'}
        onClose={() => !isDeleting && setDeleteConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
      />

      <div className="px-8 pb-8 pt-2">
        <div className="w-full rounded-xl border border-gray-light/200 shadow-shadows/shadow-xs">
          <div className="flex flex-col">
            <div className="flex justify-between items-center rounded-t-xl bg-gray-light/50 py-4 pl-6">
              <div className="flex flex-col gap-13">
                <div className="flex gap-x-2">
                  <h3 className="text-[18px] font-semibold text-gray-900">Employee List</h3>
                  <span className="rounded-full bg-brand/50 border border-brand/200 px-2.5 py-0.5 text-xs font-medium text-brand/700">
                    {itemCountLabel} item
                  </span>
                </div>
              </div>
              <div className="flex flex-wrap gap-3 px-3.5 py-2">
                {selectedCount > 0 ? (
                  <MyButton
                    color="error"
                    variant="outlined"
                    size="md"
                    onClick={() => setDeleteConfirmOpen(true)}
                  >
                    <Trash01 className="h-5 w-5" />
                    <p className="text-sm-semibold">Delete</p>
                  </MyButton>
                ) : null}
                <MyButton color="primary" variant="outlined" size="md" onClick={handleExport}>
                  <DownloadCloud01 className="h-5 w-5" />
                  <p className="text-sm-semibold">Export</p>
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
            <div className="w-full max-w-sm">
              <MyTextField
                placeholder="Search for employee"
                startAdornment={
                  <SearchLg className="size-5 text-gray-light/600" stroke="currentColor" />
                }
                focusColor="#42307D"
                 
                onChangeForm={(e) => debouncedSearch(e.target.value)}
              />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <MyFilterModal
                id="filter-workforce"
                currentFilters={workforce?.filter}
                onChange={(filter) => {
                  setParams((prev) => ({ ...prev, filter, page: 1 }))
                }}
                target={(open, handleClick) => (
                  <MyButton
                    color="gray"
                    size="sm"
                    variant="tertiary"
                    customClassname="text-gray-700"
                    onClick={handleClick}
                  >
                    <FilterLines className="h-4 w-4 text-gray-500" stroke="currentColor" />
                    Filters
                  </MyButton>
                )}
              />
              <MyHorizontalTabV2
                value={selectedCategory}
                onChange={setSelectedCategory}
                fitContent
                tabs={CATEGORY_TABS}
              />
            </div>
          </div>

          <MyDataTable
            values={values}
            selectionMode="multiple"
            onSelectionChange={handleWorkforceSelectionChange}
            currentSortFieldFromParams={sortField}
            currentSortOrderFromParams={sortOrder}
            onClick={(row) => navigate(`/workforce/employee/${row.id}`)}
          >
            <MyColumn
              header="Name & Employee ID"
              field="full_name"
              onSort={handleWorkforceSort}
              body={(row) => (
                <div className="flex items-center gap-3 py-1 whitespace-nowrap">
                  {row.avatar_url ? (
                    <img
                      src={row.avatar_url}
                      alt=""
                      className="h-10 w-10 shrink-0 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-500">
                      <span className="text-sm font-medium">{row.full_name?.charAt(0) ?? '?'}</span>
                    </div>
                  )}
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-medium text-brand/700">{row.full_name}</span>
                    <span className="text-sm text-gray-500">{row.code}</span>
                  </div>
                </div>
              )}
            />
            <MyColumn
              header="Level"
              field="employment_level"
              body={(row) => (
                <span className="text-sm text-gray-600">
                  {row.employment_level?.name ?? '—'}
                </span>
              )}
            />
            <MyColumn
              header="Category"
              field="category"
              onSort={handleWorkforceSort}
              body={(row) => (
                <span className="text-sm text-gray-600 capitalize">{row.category ?? '—'}</span>
              )}
            />
            <MyColumn
              header="Company"
              field="company"
              body={(row) => (
                <span className="text-sm text-gray-600 whitespace-nowrap">
                  {row.company?.name ?? '—'}
                </span>
              )}
            />
            <MyColumn
              header="Consent Status"
              field="consent_status"
              onSort={handleWorkforceSort}
              body={(row) => <MyConsentStatusChip status={row.consent_status} />}
            />
            <MyColumn
              header="Consent expiry"
              field="consent_expiry"
              onSort={handleWorkforceSort}
              body={(row) => (
                <span className="text-sm text-gray-600">{formatDate(row.consent_expiry)}</span>
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

export default WorkforceTable
