import { SearchMd, FilterLines, Trash01, Plus, EyeOff } from '@untitled-ui/icons-react'
import { MyDataTable, MyColumn, MyHorizontalTabV2, MyButton } from '@interstellar-component'
import { useSettings } from '../Context'

export default function EmploymentLevel() {
  const {
    employmentLevels,
    positions,
    empSearchTerm,
    setEmpSearchTerm,
    posSearchTerm,
    setPosSearchTerm,
    empSortField,
    empSortOrder,
    handleEmpSort,
    posSortField,
    posSortOrder,
    handlePosSort,
    handleEmpSelectionChange,
    handlePosSelectionChange,
    activeEmpSubTab,
    setActiveEmpSubTab,
  } = useSettings()

  const levelTableValues = {
    data: employmentLevels,
    meta: {
      current_page: 1,
      next_page: 2,
      per_page: 10,
      total: employmentLevels.length,
    },
    checkedAll: employmentLevels.length > 0 && employmentLevels.every((l) => l.checked),
  }

  const positionTableValues = {
    data: positions,
    meta: {
      current_page: 1,
      next_page: 2,
      per_page: 10,
      total: positions.length,
    },
    checkedAll: positions.length > 0 && positions.every((p) => p.checked),
  }

  return (
    <div className="flex flex-col pt-8">
      {/* Header section */}
      <div className="flex flex-col gap-1 w-full pb-6">
        <h2 className="text-lg font-semibold text-[#181d27]">Employment level</h2>
        <p className="text-sm text-[#535862]">
          Define employee levels and their associated consent and screening rules.
        </p>
      </div>

      {/* Primary Sub-tabs */}
      <div className="mb-6">
        <MyHorizontalTabV2
          value={activeEmpSubTab}
          onChange={(val) => setActiveEmpSubTab(val)}
          fitContent
          tabs={[
            { value: 'level', label: 'Level' },
            { value: 'position', label: 'Position' },
          ]}
        />
      </div>

      {activeEmpSubTab === 'level' && (
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden flex flex-col">
          {/* Level Header */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center justify-between p-5 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <h3 className="text-[18px] font-semibold text-gray-900">Level</h3>
              <span className="rounded-full bg-brand/50 border border-brand/200 px-2.5 py-0.5 text-xs font-medium text-brand/700">
                12 item
              </span>
            </div>
            <div className="flex flex-wrap gap-3">
              <MyButton color="error" size="md" variant="outlined">
                <Trash01 className="w-5 h-5 text-error/700" stroke="currentColor" />
                Delete
              </MyButton>
              <MyButton color="primary" size="md" variant="filled">
                <Plus className="w-5 h-5 text-white" stroke="currentColor" />
                New area
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
                placeholder="Search"
                value={empSearchTerm}
                onChange={(e) => setEmpSearchTerm(e.target.value)}
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
            </div>
          </div>

          <MyDataTable
            values={levelTableValues}
            selectionMode="multiple"
            onSelectionChange={handleEmpSelectionChange}
            paginator
            currentSortFieldFromParams={empSortField}
            currentSortOrderFromParams={empSortOrder}
          >
            <MyColumn
              header="Level"
              field="level"
              onSort={handleEmpSort}
              body={(row) => (
                <span
                  className={`text-sm font-medium py-1 ${row.checked ? 'text-[#6941C6]' : 'text-gray-900'}`}
                >
                  {row.level}
                </span>
              )}
            />
            <MyColumn
              header="Salary range"
              field="salaryRange"
              onSort={handleEmpSort}
              body={(row) => <span className="text-sm text-gray-600">{row.salaryRange}</span>}
            />
            <MyColumn
              header="Consent Expiry"
              field="consentExpiry"
              onSort={handleEmpSort}
              body={(row) => <span className="text-sm text-gray-600">{row.consentExpiry}</span>}
            />
            <MyColumn
              header="Repeat Every"
              field="repeatEvery"
              onSort={handleEmpSort}
              body={(row) => <span className="text-sm text-gray-600">{row.repeatEvery}</span>}
            />
          </MyDataTable>
        </div>
      )}

      {activeEmpSubTab === 'position' && (
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden flex flex-col">
          {/* Position Header */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center justify-between p-5 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <h3 className="text-[18px] font-semibold text-gray-900">Position</h3>
              <span className="rounded-full bg-brand/50 border border-brand/200 px-2.5 py-0.5 text-xs font-medium text-brand/700">
                12 item
              </span>
            </div>
            <div className="flex flex-wrap gap-3">
              <MyButton color="error" size="md" variant="outlined">
                <Trash01 className="w-5 h-5 text-error/700" stroke="currentColor" />
                Delete
              </MyButton>
              <MyButton color="primary" size="md" variant="filled">
                <Plus className="w-5 h-5 text-white" stroke="currentColor" />
                New position
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
                placeholder="Search"
                value={posSearchTerm}
                onChange={(e) => setPosSearchTerm(e.target.value)}
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
            </div>
          </div>

          <MyDataTable
            values={positionTableValues}
            selectionMode="multiple"
            onSelectionChange={handlePosSelectionChange}
            paginator
            currentSortFieldFromParams={posSortField}
            currentSortOrderFromParams={posSortOrder}
          >
            <MyColumn
              header="Position"
              field="name"
              onSort={handlePosSort}
              body={(row) => (
                <span
                  className={`text-sm font-medium py-1 ${row.checked ? 'text-[#6941C6]' : 'text-gray-900'}`}
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
