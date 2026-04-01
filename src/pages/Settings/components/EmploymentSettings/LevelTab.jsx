import { useState } from 'react'
import {
  SearchMd,
  FilterLines,
  Trash01,
  Plus,
  EyeOff,
  DownloadCloud01,
  UploadCloud01,
} from '@untitled-ui/icons-react'
import { MyDataTable, MyColumn, MyButton } from '@interstellar-component'
import { useSettings } from '../../Context'
import NewLevelSlider from './NewLevelSlider'
import LevelDetailsSlider from './LevelDetailsSlider'

export default function LevelTab() {
  const {
    employmentLevels,
    empSearchTerm,
    setEmpSearchTerm,
    empSortField,
    empSortOrder,
    handleEmpSort,
    handleEmpSelectionChange,
  } = useSettings()

  const [isLevelSliderOpen, setIsLevelSliderOpen] = useState(false)
  const [selectedLevel, setSelectedLevel] = useState(null)

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

  return (
    <>
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden flex flex-col">
        {/* Level Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center justify-between p-5 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <h3 className="text-[18px] font-semibold text-gray-900">Level</h3>
            <span className="rounded-full bg-brand/50 border border-brand/200 px-2.5 py-0.5 text-xs font-medium text-brand/700">
              {employmentLevels.length} item
            </span>
          </div>
          <div className="flex flex-wrap gap-3">
            <MyButton color="error" size="md" variant="outlined">
              <Trash01 className="w-5 h-5 text-error/700" stroke="currentColor" />
              <p className="text-sm-semibold">Delete</p>
            </MyButton>
            <MyButton color="primary" size="md" variant="outlined">
              <DownloadCloud01 className="h-5 w-5" />
              <p className="text-sm-semibold">Download</p>
            </MyButton>
            <MyButton color="secondary" size="md" variant="outlined">
              <UploadCloud01 className="h-5 w-5" />
              <p className="text-sm-semibold">Import</p>
            </MyButton>
            <MyButton
              color="primary"
              size="md"
              variant="filled"
              onClick={() => setIsLevelSliderOpen(true)}
            >
              <Plus className="w-5 h-5 text-white" stroke="currentColor" />
              <p className="text-sm-semibold">New Employment Level</p>
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
            <MyButton color="gray" size="sm" variant="tertiary" customClassname="text-gray-700">
              <FilterLines className="h-4 w-4 text-gray-500" stroke="currentColor" />
              Filters
            </MyButton>
            <MyButton color="gray" size="sm" variant="tertiary" customClassname="text-gray-700">
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
          onClick={(row) => setSelectedLevel(row)}
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

      <NewLevelSlider open={isLevelSliderOpen} onClose={() => setIsLevelSliderOpen(false)} />
      <LevelDetailsSlider open={!!selectedLevel} data={selectedLevel} onClose={() => setSelectedLevel(null)} />
    </>
  )
}

