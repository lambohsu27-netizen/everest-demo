/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useEffect } from 'react'
import { FilterLines, Trash01, Plus, SearchLg, Edit01 } from '@untitled-ui/icons-react'
import { debounce } from 'lodash'
import {
  MyDataTable,
  MyColumn,
  MyButton,
  MyTextField,
  MyFilterModal,
  MyChip,
  MyModalSlider,
} from '@interstellar-component'
import { useEmploymentSettings } from './Context'
import NewLevelSlider from './NewLevelSlider'
import LevelDetailsSlider from './LevelDetailsSlider'

/** Rupiah seperti contoh UI: `Rp5,000,000` (tanpa spasi setelah Rp, koma pemisah ribuan). */
function formatRupiah(value) {
  if (value === null || value === undefined || value === '') return ''
  const n = Number(String(value).replace(/\D/g, ''))
  if (Number.isNaN(n)) return ''
  return `Rp${n.toLocaleString('en-US', { maximumFractionDigits: 0 })}`
}

function formatSalaryRange(from, to) {
  const low = formatRupiah(from)
  const high = formatRupiah(to)
  if (!low && !high) return '—'
  if (!low) return high
  if (!high) return low
  return `${low} - ${high}`
}

export default function LevelTab() {
  const {
    getEmploymentLevel,
    params,
    setParams,
    employmentLevel,
    handleEmpSort,
    handleEmpFilterChange,
    handleEmpSelectionChange,
    employmentLevelDetail,
    isLoadingEmploymentLevelDetail,
    handleCurrentSlider,
    currentSlider,
    deleteEmploymentLevels,
  } = useEmploymentSettings()

  const levelRows = Array.isArray(employmentLevel?.data) ? employmentLevel.data : []
  const levelMeta =
    employmentLevel?.meta &&
    typeof employmentLevel.meta === 'object' &&
    !Array.isArray(employmentLevel.meta)
      ? employmentLevel.meta
      : {
          current_page: 1,
          per_page: 10,
          total: levelRows.length,
        }

  const levelTableValues = {
    data: levelRows,
    meta: levelMeta,
    loading: employmentLevel.loading,
    checkedAll: levelRows.length > 0 && levelRows.every((l) => l.checked),
  }

  const handleLevelPageChange = (page) => {
    setParams((p) => ({ ...p, page }))
  }

  const formSliderOpen = currentSlider.status && currentSlider.current === 'form-slider'
  const detailsSliderOpen = currentSlider.status && currentSlider.current === 'details-slider'

  const selectedCount = levelRows.filter((l) => l.checked).length
  const selectedIds = levelRows.filter((l) => l.checked).map((l) => l.id)

  useEffect(() => {
    getEmploymentLevel()
  }, [getEmploymentLevel])

  const handleDeleteSelected = () => {
    if (selectedIds.length === 0) return
    deleteEmploymentLevels(selectedIds)
  }

  return (
    <>
    <MyModalSlider
        open={formSliderOpen}
        onClose={() => handleCurrentSlider(null)}
        element={
          <NewLevelSlider
            key={
              currentSlider.id
                ? `edit-${employmentLevelDetail?.id ?? currentSlider.id ?? 'row'}`
                : 'create'
            }
            inModalSlider
            open={formSliderOpen}
            mode={currentSlider.id ? 'edit' : 'create'}
            initialData={currentSlider.id ? employmentLevelDetail : null}
            onClose={() => handleCurrentSlider(null)}
          />
        }
      />
      <MyModalSlider
        open={detailsSliderOpen}
        onClose={() => handleCurrentSlider(null)}
        element={
          <LevelDetailsSlider
            inModalSlider
            open={detailsSliderOpen}
            data={employmentLevelDetail}
            loading={isLoadingEmploymentLevelDetail}
            onClose={() => handleCurrentSlider(null)}
            onEdit={() => handleCurrentSlider({ current: 'form-slider' }, currentSlider.id)}
          />
        }
      />
      <section className="w-full rounded-xl border border-gray-light/200 shadow-shadows/shadow-xs">
        <div className="flex flex-col">
          <div className="flex flex-col justify-between gap-4 rounded-t-xl bg-gray-light/50 py-4 pl-6 sm:flex-row sm:items-center">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-x-2">
                <p className="text-sm-semibold text-gray-light/900">Level</p>
                <MyChip
                  label={`${levelMeta.total ?? levelRows.length} item`}
                  rounded="full"
                  color="modern"
                  variant="outlined"
                  size="sm"
                />
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3 pr-4">
              {selectedCount > 0 && (
                <>
                  <p className="text-sm-semibold text-gray-light/600">
                    {selectedCount} selected
                  </p>
                  <MyButton
                    color="error"
                    size="sm"
                    variant="outlined"
                    type="button"
                    onClick={handleDeleteSelected}
                  >
                    <Trash01 className="size-5 text-error/700" stroke="currentColor" />
                    <span className="text-sm-semibold">Delete</span>
                  </MyButton>
                </>
              )}
              {/* <MyButton color="secondary" size="sm" variant="outlined" type="button">
                <DownloadCloud01 className="size-5" stroke="currentColor" />
                <span className="text-sm-semibold">Download</span>
              </MyButton> */}
              {/* <MyButton color="secondary" size="sm" variant="outlined" type="button">
                <UploadCloud01 className="size-5" stroke="currentColor" />
                <span className="text-sm-semibold">Import</span>
              </MyButton> */}
              <MyButton
                color="primary"
                size="sm"
                variant="filled"
                onClick={() => handleCurrentSlider({ current: 'form-slider' })}
              >
                <Plus className="size-5 text-white" stroke="currentColor" />
                <span className="text-sm-semibold">New Employment Level</span>
              </MyButton>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 border-t border-gray-light/200 px-4 py-3">
            <div className="flex w-full flex-1 flex-wrap justify-between gap-3">
              <div className="w-full max-w-[375px]">
                <MyTextField
                  placeholder="Search levels"
                  id="input-search-level"
                  focusColor="#42307D"
                  focusShadow="#42307D3D"
                  startAdornment={
                    <SearchLg className="size-5 text-gray-light/600" stroke="currentColor" />
                  }
                  onChangeForm={debounce((e) => {
                    setParams((p) => ({ ...p, page: 1, search: e.target.value }))
                  }, 800)}
                />
              </div>
              <div className="flex items-center gap-5">
                <MyFilterModal
                  id="filter-employment-level"
                  currentFilters={employmentLevel.filter}
                  onChange={handleEmpFilterChange}
                  target={(open, handleClick) => (
                    <MyButton
                      removeWhite
                      onClick={handleClick}
                      color="secondary"
                      variant="text"
                      size="md"
                    >
                      <FilterLines className="size-5" stroke="currentColor" />
                      <span className="text-sm-semibold">Filter</span>
                    </MyButton>
                  )}
                />
              </div>
            </div>
          </div>

          <div>
            <MyDataTable
              values={levelTableValues}
              selectionMode="multiple"
              onSelectionChange={handleEmpSelectionChange}
              paginator
              onChangePagination={handleLevelPageChange}
              currentSortFieldFromParams={params.sort}
              currentSortOrderFromParams={params.order}
              onClick={(row) => handleCurrentSlider({ current: 'details-slider' }, row.id)}
            >
              <MyColumn
                header="Level"
                field="name"
                onSort={handleEmpSort}
                body={(row) => (
                  <div className="flex flex-col">
                    <p
                      className={`text-sm-medium ${
                        row.checked ? 'text-[#6941C6]' : 'text-gray-light/900'
                      }`}
                    >
                      {row.name ?? '—'}
                    </p>
                    {row.code != null && row.code !== '' && (
                      <p className="text-sm-regular text-gray-light/600">{row.code}</p>
                    )}
                  </div>
                )}
              />
              <MyColumn
                header="Salary range"
                field="salary_from"
                onSort={handleEmpSort}
                body={(row) => (
                  <span className="text-sm-regular text-gray-light/600">
                    {formatSalaryRange(row.salary_from, row.salary_to)}
                  </span>
                )}
              />
              <MyColumn
                header="Consent Expiry"
                field="consent_expiry"
                onSort={handleEmpSort}
                body={(row) => (
                  <span className="text-sm-regular text-gray-light/600">
                    {row.consent_expiry ?? '—'}
                  </span>
                )}
              />
              <MyColumn
                header="Repeat Every"
                field="repeat_every"
                onSort={handleEmpSort}
                body={(row) => (
                  <span className="text-sm-regular text-gray-light/600">
                    {row.repeat_every ?? '—'}
                  </span>
                )}
              />
              <MyColumn
                alignment="right"
                body={(value) => {
                  const id = value?.id
                  if (!id) return null
                  return (
                    <div
                      className="z-10 flex items-center justify-end gap-1"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MyButton
                        onClick={() => handleCurrentSlider({ current: 'form-slider' }, id)}
                        size="md"
                        variant="text"
                        type="button"
                      >
                        <Edit01 className="size-5 text-gray-light/600" stroke="currentColor" />
                      </MyButton>
                    </div>
                  )
                }}
              />
            </MyDataTable>
          </div>
        </div>
      </section>      
    </>
  )
}
