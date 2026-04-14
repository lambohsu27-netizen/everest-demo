import React, { useMemo } from 'react'
import { debounce } from 'lodash'
import { SearchLg, FilterLines, PackagePlus } from '@untitled-ui/icons-react'
import { MyColumn, MyDataTable, MyButton, MyHorizontalTabV2, MyTextField } from '@interstellar-component'
import { useReportEnquiry } from '../Context'
import MySLAStatusChip from './MySLAStatusChip'

function ReportEnquiryTable() {
  const {
    setSearchTerm,
    enquiries,
    sortField,
    sortOrder,
    handleSort,
    handleSelectionChange,
    handleCurrentSlider,
    pagination,
    setPage,
    enquiryCategory,
    setEnquiryCategory,
  } = useReportEnquiry()

  const debouncedSearch = useMemo(
    () => debounce((e) => setSearchTerm(e.target.value), 500),
    [setSearchTerm]
  )

  const values = {
    data: enquiries || [],
    meta: {
      current_page: pagination.page,
      per_page: pagination.limit,
      total: pagination.total,
    },
    checkedAll: enquiries?.length > 0 && enquiries?.every((d) => d.checked),
  }

  return (
    <div className="px-8 pb-8">
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        {/* Table Control Header */}
        <div className="flex flex-col gap-5 p-5 border-b border-gray-200">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center justify-between">
            <div className="flex items-center gap-3">
              <h3 className="text-[18px] font-semibold text-gray-900">List of Enquiry</h3>
              <span className="rounded-full bg-brand/50 border border-brand/200 px-2.5 py-0.5 text-xs font-medium text-brand/700">
                {pagination.total} item
              </span>
            </div>
            <div className="flex gap-3">
              <MyButton
                color="secondary"
                variant="outlined"
                size="md"
                customClassname="gap-2"
                onClick={() => handleCurrentSlider({ current: 'import-enquiry' })}
              >
                <PackagePlus />
                <p className="text-sm-semibold">Bulk enquiry</p>
              </MyButton>
              <MyButton
                color="primary"
                variant="filled"
                size="md"
                customClassname="gap-2"
                onClick={() => handleCurrentSlider({ current: 'new-enquiry' })}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M10 4.16666V15.8333M4.16666 9.99999H15.8333"
                    stroke="currentColor"
                    strokeWidth="1.66667"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <p className="text-sm-semibold">New enquiry</p>
              </MyButton>
            </div>
          </div>

          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="w-full max-w-sm">
              <MyTextField
                placeholder="Search for tickets"
                startAdornment={
                  <SearchLg className="size-5 text-gray-light/600" stroke="currentColor" />
                }
                focusColor="#42307D"
                 
                onChangeForm={debouncedSearch}
              />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <MyButton color="gray" size="sm" variant="tertiary" customClassname="text-gray-700">
                <FilterLines className="h-4 w-4 text-gray-500" />
                Filters
              </MyButton>

              <MyHorizontalTabV2
                value={enquiryCategory}
                onChange={setEnquiryCategory}
                fitContent
                tabs={[
                  { label: 'All type', value: 'all' },
                  { label: 'Employee', value: 'employee' },
                  { label: 'Candidate', value: 'candidate' },
                ]}
              />
            </div>
          </div>
        </div>

        <MyDataTable
          values={values}
          selectionMode="multiple"
          onSelectionChange={handleSelectionChange}
          currentSortFieldFromParams={sortField}
          currentSortOrderFromParams={sortOrder}
          onClick={(row) => {
            if (row.slaStatus === 'Awaiting Admin Approval') {
              handleCurrentSlider({ current: 'admin-verification', props: { data: row } })
            } else if (row.slaStatus === 'Awaiting Consent') {
              handleCurrentSlider({ current: 'awaiting-consent', props: { data: row } })
            }
          }}
        >
          <MyColumn
            header="Order"
            field="order"
            onSort={handleSort}
            body={(row) => (
              <div className="flex flex-col gap-0.5 py-1">
                <span className="text-sm font-medium text-brand/700">{row.order}</span>
                <span className="text-sm text-gray-500">{row.orderDate}</span>
              </div>
            )}
          />
          <MyColumn
            header="Name & Employee ID"
            field="name"
            onSort={handleSort}
            body={(row) => (
              <div className="flex flex-col gap-0.5 py-1">
                <span className="text-sm font-medium text-gray-900">{row.name}</span>
                <span className="text-sm text-gray-500">{row.employeeId}</span>
              </div>
            )}
          />
          <MyColumn
            header="Category"
            field="category"
            onSort={handleSort}
            body={(row) => <span className="text-sm text-gray-600">{row.category}</span>}
          />
          <MyColumn
            header="Entity"
            field="entity"
            onSort={handleSort}
            body={(row) => <span className="text-sm text-gray-600">{row.entity}</span>}
          />
          <MyColumn
            header="SLA Status"
            field="slaStatus"
            onSort={handleSort}
            body={(row) => <MySLAStatusChip status={row.slaStatus} />}
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

export default ReportEnquiryTable
