/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useEffect, useState } from 'react'
import { FilterLines, Trash01, Plus, SearchLg, Edit01 } from '@untitled-ui/icons-react'
import { debounce } from 'lodash'
import {
  MyDataTable,
  MyColumn,
  MyButton,
  MyTextField,
  MyFilterModal,
  MyModalSlider,
  MyConfirmModal,
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

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)

  const openDeleteConfirm = () => {
    if (selectedIds.length === 0) return
    setDeleteConfirmOpen(true)
  }

  const handleConfirmDelete = async () => {
    setDeleteConfirmOpen(false)
    await deleteEmploymentLevels(selectedIds)
  }

  return (
    <>
      <MyConfirmModal
        open={deleteConfirmOpen}
        title="Delete employment levels"
        message={`Are you sure you want to delete ${selectedIds.length} level(s)? This action cannot be undone.`}
        icon={<Trash01 className="text-error/600" />}
        positiveButtonColor="error"
        positiveActionWord="Delete"
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    <MyModalSlider
        scrim
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
        scrim
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
      <section className="flex flex-1 min-h-0 flex-col overflow-hidden border border-gray/200 bg-white shadow-sm rounded-xl">
        <div className="flex flex-1 min-h-0 flex-col">
          <div className="flex flex-col justify-between gap-4 border-b border-gray/200 px-6 py-3 sm:flex-row sm:items-center bg-gray/25">
            <div className="flex items-center gap-3">
              <h3 className="text-[14px] font-semibold text-gray-900">Level</h3>
              <span className="rounded-full border border-gray-blue/200 bg-gray-blue/50 px-2 py-0.5 text-xs font-medium text-gray-blue/700">
                {levelMeta.total ?? levelRows.length} item
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              {selectedCount > 0 && (
                <MyButton
                  color="error"
                  size="md"
                  variant="outlined"
                  type="button"
                  onClick={openDeleteConfirm}
                >
                  <Trash01 className="size-5 text-error/700" stroke="currentColor" />
                  <span className="text-sm-semibold">Delete</span>
                </MyButton>
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
                size="md"
                variant="filled"
                onClick={() => handleCurrentSlider({ current: 'form-slider' })}
              >
                <Plus className="size-5 text-white" stroke="currentColor" />
                <span className="text-sm-semibold">New Employment Level</span>
              </MyButton>
            </div>
          </div>

          <div className="flex flex-col gap-4 border-b border-gray-200 p-5 xl:flex-row xl:items-center xl:justify-between">
            <div className="w-full max-w-sm">
              <MyTextField
                placeholder="Search levels"
                id="input-search-level"
                focusColor="#42307D"
                startAdornment={
                  <SearchLg className="size-5 text-gray-light/600" stroke="currentColor" />
                }
                onChangeForm={debounce((e) => {
                  setParams((p) => ({ ...p, page: 1, search: e.target.value }))
                }, 500)}
              />
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <MyFilterModal
                id="filter-employment-level"
                currentFilters={employmentLevel.filter}
                onChange={handleEmpFilterChange}
                target={(open, handleClick) => (
                  <MyButton
                    removeWhite
                    onClick={handleClick}
                    color="gray"
                    variant="tertiary"
                    size="sm"
                    customClassname="text-gray-700"
                  >
                    <FilterLines className="h-4 w-4 text-gray-500" stroke="currentColor" />
                    Filters
                  </MyButton>
                )}
              />
            </div>
          </div>

          <div className="flex flex-1 min-h-0 flex-col">
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
