/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useEffect } from 'react'
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
  MyChip,
  MyModalSlider,
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

  const handleDeleteSelected = () => {
    if (selectedIds.length === 0) return
    deleteEmploymentPositions(selectedIds)
  }

  return (
    <>
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
      <section className="w-full rounded-xl border border-gray-light/200 shadow-shadows/shadow-xs">
        <div className="flex flex-col">
          <div className="flex flex-col justify-between gap-4 rounded-t-xl bg-gray-light/50 py-4 pl-6 sm:flex-row sm:items-center">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-x-2">
                <p className="text-sm-semibold text-gray-light/900">Position</p>
                <MyChip
                  label={`${positionMeta.total ?? positionRows.length} item`}
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
              </MyButton>
              <MyButton color="secondary" size="sm" variant="outlined" type="button">
                <UploadCloud01 className="size-5" stroke="currentColor" />
                <span className="text-sm-semibold">Import</span>
              </MyButton> */}
              <MyButton
                color="primary"
                size="sm"
                variant="filled"
                type="button"
                onClick={() => handlePositionSlider({ current: 'form-slider' })}
              >
                <Plus className="size-5 text-white" stroke="currentColor" />
                <span className="text-sm-semibold">New position</span>
              </MyButton>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 border-t border-gray-light/200 px-4 py-3">
            <div className="flex w-full flex-1 flex-wrap justify-between gap-3">
              <div className="w-full max-w-[375px]">
                <MyTextField
                  placeholder="Search positions"
                  id="input-search-position"
                  focusColor="#42307D"
                  focusShadow="#42307D3D"
                  startAdornment={
                    <SearchLg className="size-5 text-gray-light/600" stroke="currentColor" />
                  }
                  onChangeForm={debounce((e) => {
                    setPositionParams((p) => ({ ...p, page: 1, search: e.target.value }))
                  }, 800)}
                />
              </div>
              <div className="flex items-center gap-5">
                <MyFilterModal
                  id="filter-employment-position"
                  currentFilters={employmentPosition.filter}
                  onChange={handlePositionFilterChange}
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
