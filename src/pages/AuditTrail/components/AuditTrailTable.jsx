import { useMemo } from 'react'
import { debounce } from 'lodash'
import {
  SearchLg,
  FilterLines,
  DownloadCloud01,
  SwitchVertical01
} from '@untitled-ui/icons-react'
import { MyColumn, MyDataTable, MyTextField } from '@interstellar-component'
import { useAuditTrail } from '../Context'

function AuditTrailTable() {
  const {
    setSearchTerm,
    auditTrails,
    sortField,
    sortOrder,
    handleSort,
  } = useAuditTrail()

  const debouncedSearch = useMemo(
    () => debounce((e) => setSearchTerm(e.target.value), 500),
    [setSearchTerm]
  )

  const values = {
    data: auditTrails || [],
    meta: {
      current_page: 1,
      next_page: 2,
      per_page: 10,
      total: 1480, // from design
    },
  }

  return (
    <div className="px-8 pb-8">
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        {/* Table Control Header */}
        <div className="flex flex-col gap-5 p-5 border-b border-gray-200">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center justify-between">
            <div className="flex items-center gap-3">
              <h3 className="text-[18px] font-semibold text-gray-900">System events logs</h3>
              <span className="rounded-full bg-brand/50 border border-brand/200 px-2.5 py-0.5 text-xs font-medium text-brand/700">
                1,480 item
              </span>
            </div>
            <div className="flex flex-wrap gap-3">
              <button className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-brand/500 focus:ring-offset-2">
                <DownloadCloud01 className="h-5 w-5 text-gray-700" />
                Download CSV
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="w-full sm:max-w-xs">
              <MyTextField
                placeholder="Search"
                startAdornment={
                  <SearchLg className="size-5 text-gray-light/600" stroke="currentColor" />
                }
                focusColor="#42307D"
                 
                onChangeForm={debouncedSearch}
              />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-brand/500 focus:ring-offset-2">
                <FilterLines className="h-5 w-5 text-gray-700" />
                Filter
              </button>
              <button className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-brand/500 focus:ring-offset-2">
                <SwitchVertical01 className="h-5 w-5 text-gray-700" />
                Sort
              </button>
            </div>
          </div>
        </div>

        <MyDataTable
          values={values}
          paginator
          currentSortFieldFromParams={sortField}
          currentSortOrderFromParams={sortOrder}
        >
          <MyColumn
            header="Timestamp"
            field="timestamp"
            onSort={handleSort}
            body={(row) => <span className="text-sm text-gray-500">{row.timestamp}</span>}
          />
          <MyColumn
            header="Event"
            field="event"
            onSort={handleSort}
            body={(row) => <span className="text-sm text-gray-500">{row.event}</span>}
          />
          <MyColumn
            header="Module"
            field="module"
            onSort={handleSort}
            body={(row) => <span className="text-sm text-gray-500">{row.module}</span>}
          />
          <MyColumn
            header="User"
            field="user"
            onSort={handleSort}
            body={(row) => (
              <div className="flex flex-col gap-0.5 whitespace-nowrap">
                <span className="text-sm font-medium text-gray-900">{row.user}</span>
                <span className="text-sm text-gray-500">{row.userEmail}</span>
              </div>
            )}
          />
          <MyColumn
            header="Remarks"
            field="remarks"
            onSort={handleSort}
            body={(row) => <span className="text-sm text-gray-500">{row.remarks}</span>}
          />
        </MyDataTable>
      </div>
    </div>
  )
}

export default AuditTrailTable
