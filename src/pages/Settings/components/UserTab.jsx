import {
  SearchMd,
  FilterLines,
  Trash01,
  Download01,
  Upload01,
  Plus,
  EyeOff,
} from '@untitled-ui/icons-react'
import { MyDataTable, MyColumn, MyButton } from '@interstellar-component'
import { useSettings } from '../Context'

export default function UserTab() {
  const {
    users,
    searchTerm, setSearchTerm,
    sortField, sortOrder, handleSort,
    handleSelectionChange,
    selectedStatus, setSelectedStatus,
  } = useSettings()

  const userTableValues = {
    data: users,
    meta: { current_page: 1, next_page: 2, per_page: 10, total: users.length },
    checkedAll: users.length > 0 && users.every((u) => u.checked),
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden flex flex-col">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center justify-between p-5 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <h3 className="text-[18px] font-semibold text-gray-900">User</h3>
          <span className="rounded-full bg-brand/50 border border-brand/200 px-2.5 py-0.5 text-xs font-medium text-brand/700">
            1,480 item
          </span>
        </div>
        <div className="flex flex-wrap gap-3">
          <MyButton color="error" size="md" variant="outlined">
            <Trash01 className="w-5 h-5 text-error/700" stroke="currentColor" />
            Delete
          </MyButton>
          <MyButton color="secondary" size="md" variant="outlined" customClassname="text-[#344054]">
            <Download01 className="w-5 h-5 text-[#344054]" stroke="currentColor" />
            Download
          </MyButton>
          <MyButton color="secondary" size="md" variant="outlined" customClassname="text-[#344054]">
            <Upload01 className="w-5 h-5 text-[#344054]" stroke="currentColor" />
            Import
          </MyButton>
          <MyButton color="primary" size="md" variant="filled">
            <Plus className="w-5 h-5 text-white" stroke="currentColor" />
            New user
          </MyButton>
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
          <MyButton color="secondary" size="md" variant="outlined" customClassname="text-gray-700">
            <FilterLines className="h-4 w-4 text-gray-500" stroke="currentColor" />
            Filters
          </MyButton>
          <MyButton color="secondary" size="md" variant="outlined" customClassname="text-gray-700">
            <EyeOff className="h-4 w-4 text-gray-500" stroke="currentColor" />
            Hide fields
          </MyButton>
          <div className="inline-flex rounded-lg border border-gray-200 bg-white p-0.5">
            {['Active', 'Inactive'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedStatus(cat)}
                className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                  selectedStatus === cat ? 'bg-gray-50 text-gray-900' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
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
        <MyColumn header="Company" field="name" onSort={handleSort}
          body={(row) => (
            <div className="flex items-center gap-3 py-1 whitespace-nowrap">
              <img src={row.avatar} alt={row.name} className="w-10 h-10 rounded-full object-cover" />
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-medium text-[#6941C6]">{row.name}</span>
                <span className="text-sm text-gray-500">{row.role}</span>
              </div>
            </div>
          )}
        />
        <MyColumn header="Status" field="status" onSort={handleSort}
          body={(row) => (
            <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium ${row.status === 'Active' ? 'bg-success/50 text-success/700 border border-success/200' : 'bg-gray-100 text-gray-700 border border-gray-200'}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${row.status === 'Active' ? 'bg-success/500' : 'bg-gray-500'}`} />
              {row.status}
            </span>
          )}
        />
        <MyColumn header="Email" field="email" onSort={handleSort}
          body={(row) => <span className="text-sm text-gray-600">{row.email}</span>}
        />
        <MyColumn header="Phone" field="phone" onSort={handleSort}
          body={(row) => <span className="text-sm text-gray-600">{row.phone}</span>}
        />
        <MyColumn header="Company" field="company" onSort={handleSort}
          body={(row) => <span className="text-sm text-gray-600">{row.company}</span>}
        />
      </MyDataTable>
    </div>
  )
}
