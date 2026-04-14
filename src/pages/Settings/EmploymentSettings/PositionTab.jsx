/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useEffect, useState } from 'react'
import {
  FilterLines,
  Trash01,
  Plus,
  DownloadCloud01,
  UploadCloud01,
  SearchLg,
  Edit01,
} from '@untitled-ui/icons-react'
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
import NewPositionSlider from './NewPositionSlider'
import PositionDetailsSlider from './PositionDetailsSlider'

export default function PositionTab() {
  const {
    getEmploymentPosition,
    positionParams,
    setPositionParams,
    employmentPosition,
    handlePositionSort,
    handlePositionFilterChange,
    handlePositionSelectionChange,
    employmentPositionDetail,
    isLoadingEmploymentPositionDetail,
    handlePositionSlider,
    positionSlider,
    deleteEmploymentPositions,
  } = useEmploymentSettings()

  const positionRows = Array.isArray(employmentPosition?.data) ? employmentPosition.data : []
  const positionMeta =
    employmentPosition?.meta &&
    typeof employmentPosition.meta === 'object' &&
    !Array.isArray(employmentPosition.meta)
      ? employmentPosition.meta
      : {
          current_page: 1,
          per_page: 10,
          total: positionRows.length,
        }

  const positionTableValues = {
    data: positionRows,
    meta: positionMeta,
    loading: employmentPosition.loading,
    checkedAll: positionRows.length > 0 && positionRows.every((p) => p.checked),
  }

  const handlePositionPageChange = (page) => {
    setPositionParams((p) => ({ ...p, page }))
  }

  const formSliderOpen = positionSlider.status && positionSlider.current === 'form-slider'
  const detailsSliderOpen = positionSlider.status && positionSlider.current === 'details-slider'

  const selectedCount = positionRows.filter((p) => p.checked).length
  const selectedIds = positionRows.filter((p) => p.checked).map((p) => p.id)

  useEffect(() => {
    getEmploymentPosition()
  }, [getEmploymentPosition])

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)

  const openDeleteConfirm = () => {
    if (selectedIds.length === 0) return
    setDeleteConfirmOpen(true)
  }

  const handleConfirmDelete = async () => {
    setDeleteConfirmOpen(false)
    await deleteEmploymentPositions(selectedIds)
  }

  return (
    <>
      <MyConfirmModal
        open={deleteConfirmOpen}
        title="Delete employment positions"
        message={`Are you sure you want to delete ${selectedIds.length} position(s)? This action cannot be undone.`}
        icon={<Trash01 className="text-error/600" />}
        positiveButtonColor="error"
        positiveActionWord="Delete"
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
      />
      <MyModalSlider
        scrim
        open={formSliderOpen}
        onClose={() => handlePositionSlider(null)}
        element={
          <NewPositionSlider
            key={
              positionSlider.id
                ? `edit-${employmentPositionDetail?.id ?? positionSlider.id ?? 'row'}`
                : 'create'
            }
            inModalSlider
            open={formSliderOpen}
            mode={positionSlider.id ? 'edit' : 'create'}
            initialData={positionSlider.id ? employmentPositionDetail : null}
            onClose={() => handlePositionSlider(null)}
          />
        }
      />
      <MyModalSlider
        scrim
        open={detailsSliderOpen}
        onClose={() => handlePositionSlider(null)}
        element={
          <PositionDetailsSlider
            inModalSlider
            open={detailsSliderOpen}
            data={employmentPositionDetail}
            loading={isLoadingEmploymentPositionDetail}
            onClose={() => handlePositionSlider(null)}
            onEdit={() => handlePositionSlider({ current: 'form-slider' }, positionSlider.id)}
          />
        }
      />
      <section className="flex flex-1 min-h-0 flex-col overflow-hidden border border-gray/200 bg-white shadow-sm rounded-xl">
        <div className="flex flex-1 min-h-0 flex-col">
          <div className="flex flex-col justify-between gap-4 border-b border-gray/200 px-6 py-3 sm:flex-row sm:items-center bg-gray/25">
            <div className="flex items-center gap-3">
              <h3 className="text-[14px] font-semibold text-gray-900">Position</h3>
              <span className="rounded-full border border-gray-blue/200 bg-gray-blue/50 px-2 py-0.5 text-xs font-medium text-gray-blue/700">
                {positionMeta.total ?? positionRows.length} item
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
              </MyButton>
              <MyButton color="secondary" size="sm" variant="outlined" type="button">
                <UploadCloud01 className="size-5" stroke="currentColor" />
                <span className="text-sm-semibold">Import</span>
              </MyButton> */}
              <MyButton
                color="primary"
                size="md"
                variant="filled"
                type="button"
                onClick={() => handlePositionSlider({ current: 'form-slider' })}
              >
                <Plus className="size-5 text-white" stroke="currentColor" />
                <span className="text-sm-semibold">New position</span>
              </MyButton>
            </div>
          </div>

          <div className="flex flex-col gap-4 border-b border-gray-200 p-5 xl:flex-row xl:items-center xl:justify-between">
            <div className="w-full max-w-sm">
              <MyTextField
                placeholder="Search positions"
                id="input-search-position"
                focusColor="#42307D"
                startAdornment={
                  <SearchLg className="size-5 text-gray-light/600" stroke="currentColor" />
                }
                onChangeForm={debounce((e) => {
                  setPositionParams((p) => ({ ...p, page: 1, search: e.target.value }))
                }, 500)}
              />
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <MyFilterModal
                id="filter-employment-position"
                currentFilters={employmentPosition.filter}
                onChange={handlePositionFilterChange}
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
              values={positionTableValues}
              selectionMode="multiple"
              onSelectionChange={handlePositionSelectionChange}
              paginator
              onChangePagination={handlePositionPageChange}
              currentSortFieldFromParams={positionParams.sort}
              currentSortOrderFromParams={positionParams.order}
              onClick={(row) => handlePositionSlider({ current: 'details-slider' }, row.id)}
            >
              <MyColumn
                header="Position"
                field="name"
                onSort={handlePositionSort}
                body={(row) => (
                  <div className="flex flex-col">
                    <p
                      className={`text-sm-medium ${
                        row.checked ? 'text-[#6941C6]' : 'text-gray-light/900'
                      }`}
                    >
                      {row.name ?? '—'}
                    </p>
                  </div>
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
                        onClick={() => handlePositionSlider({ current: 'form-slider' }, id)}
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
