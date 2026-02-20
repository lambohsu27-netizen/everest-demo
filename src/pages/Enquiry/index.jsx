import {
  MyArchiveButton,
  MyButton,
  MyChildModalSlider,
  MyChip,
  MyColumn,
  MyConfirmModal,
  MyConfirmUnsavedModal,
  MyDataTable,
  MyFilterModal,
  MyModalSlider,
  MyTextField,
  MyTooltip,
  MyButtonGroupV2,
} from '@interstellar-component'
import {
  AlertCircle,
  Download04,
  FilterLines,
  Lock01,
  Plus,
  RefreshCcw01,
  SearchLg,
  Send01,
  Share03,
  Trash01,
} from '@untitled-ui/icons-react'
import React, { useEffect, useState } from 'react'
import SimpleBar from 'simplebar-react'
import { debounce } from 'lodash'
import { useEnquiry } from './Context'
import Formslider from './Sliders/FormSlider'
import DetailSlider from './Sliders/DetailSlider'
import DetailSliderEnroll from './Sliders/DetailSliderEnroll'
import { useApp } from '../../AppContext'
import { Access } from '../../services/Helper'

function Enquiry() {
  // const { getAccess } = useApp()
  // const access = getAccess(Access?.Enquiry)
  const [isConfirmModalOpen, setConfirmModalOpen] = useState(false)

  const {
    currentSlider,
    handleCurrentSlider,
    setParams,
    enquiry,
    setEnquiry,
    currentTabs,
    setCheck,
    deleteEnquiry,
    check,
    restoreEnquiry,
    params,
    downloadExport,
    currentModal,
    handleCurrentModal,
    isChanged,
  } = useEnquiry()
  // console.log('params', params)

  useEffect(() => {
    setParams((value) => ({
      ...value,
      sort: null,
      order: null,
    }))
  }, [params.archive])

  return (
    <>
      {/* <MyModalSlider
        open={currentSlider?.current === 'form-slider'}
        element={<Formslider />}
        onClose={() => {
          if (isChanged) {
            handleCurrentModal({ status: true, current: 'unsaved-modal' })
          } else {
            handleCurrentSlider(null)
          }
        }}
      />
      <MyModalSlider
        open={currentSlider?.current === 'details-slider'}
        element={<DetailSlider />}
        onClose={() => handleCurrentSlider(null)}
      >
        <MyChildModalSlider
          open={currentTabs?.type === 'enroll'}
          width={375}
          element={<DetailSliderEnroll />}
        />
      </MyModalSlider> */}
      <MyConfirmModal
        open={isConfirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        onConfirm={() => deleteEnquiry(check)}
        title={`Anda yakin menghapus ${check?.length} data?`}
        message="Data yang dihapus akan masuk ke approval untuk ditinjau terlebih dahulu."
        icon={<AlertCircle className="text-warning-600" />}
        bgColor="bg-warning-100"
      />
      <MyConfirmUnsavedModal
        open={currentModal?.current === 'unsaved-modal'}
        handleCurrentModal={handleCurrentModal}
        handleCurrentSlider={handleCurrentSlider}
        currentModal={currentModal}
      />

      <SimpleBar forceVisible="y" className="flex-1" style={{ height: '100vh' }}>
        <main className="flex flex-col gap-8 pb-12 pt-8">
          <div className="flex flex-col gap-6 px-8">
            <div className="flex items-center justify-between gap-1">
              <div>
                <p className="display-xs-semibold text-gray-light-900">Application Enquiry</p>
                <p className="text-md-regular text-gray-light-600">
                  Manage and view all application enquiries.
                </p>
              </div>

              <MyButton
                onClick={downloadExport}
                color="primary"
                variant="filled"
                size="md"
                // disabled={!access?.add}
              >
                <Share03 className="size-5 text-gray-400" />
                <p className="text-sm-semibold">Export</p>
              </MyButton>
            </div>
            <div className="w-full">
              <div className="w-full rounded-xl border border-gray-light-200 shadow-shadows/shadow-xs">
                <div className="flex flex-col gap-5">
                  <div className="flex items-center gap-4 px-4 pt-5">
                    <div className="flex-1 flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <p className="text-lg-semibold text-gray-light-900">List of Enquiry</p>
                        <MyChip
                          label={`${Enquiry?.meta?.total || '0'} item`}
                          // color="primary"
                          variant="outlined"
                          size="sm"
                          rounded="xl"
                          customStyle=" bg-brand-200/30 border border-brand-200"
                        />
                      </div>
                    </div>
                    <div className="flex items-start justify-start gap-3">
                      {/* {access?.edit_delete && ( */}
                      {check?.length > 0 ? (
                        params.archive === 1 ? (
                          <MyButton
                            color="secondary"
                            variant="outlined"
                            size="sm"
                            onClick={() => restoreEnquiry(check)}
                            // disabled={!access?.edit_delete}
                          >
                            <RefreshCcw01 className="size-5" stroke="currentColor" />
                            <p className="text-sm-semibold">Restore</p>
                          </MyButton>
                        ) : (
                          <MyButton
                            color="error"
                            variant="outlined"
                            size="sm"
                            onClick={() => setConfirmModalOpen(true)}
                            // disabled={!access?.edit_delete}
                          >
                            <Trash01 className="size-5" stroke="currentColor" />
                            <p className="text-sm-semibold">Hapus</p>
                          </MyButton>
                        )
                      ) : null}
                      {/* )} */}
                      <MyButton
                        // onClick={downloadExport}
                        color="error"
                        variant="text"
                        size="md"
                        // disabled={!access?.add}
                      >
                        {/* <Trash01 className="size-5 text-gray-400" /> */}
                        <p className="text-sm-semibold">Delete All</p>
                      </MyButton>
                      {/* {access?.edit_delete && ( */}
                      <MyButton
                        onClick={() =>
                          handleCurrentSlider({
                            status: true,
                            current: 'form-slider',
                          })
                        }
                        color="primary"
                        variant="outlined"
                        size="md"
                        // disabled={!access?.edit_delete}
                      >
                        <Send01 className="size-5" stroke="currentColor" />
                        <p className="text-sm-semibold">Submit All</p>
                      </MyButton>

                      <MyButton
                        onClick={() =>
                          handleCurrentSlider({
                            status: true,
                            current: 'form-slider',
                          })
                        }
                        color="primary"
                        variant="filled"
                        size="md"
                        // disabled={!access?.edit_delete}
                      >
                        <Plus className="size-5" stroke="currentColor" />
                        <p className="text-sm-semibold">New Request</p>
                      </MyButton>
                      {/* )} */}
                    </div>
                  </div>
                  <hr className="border-gray-light-200" />
                </div>

                <div className="flex items-center justify-between gap-3 border-b border-gray-light/200 px-4 py-3">
                  <MyButtonGroupV2
                    buttons={[
                      { label: 'View all', value: 'view all' },
                      { label: 'Open', value: 'open' },
                      { label: 'Closed', value: 'closed' },
                    ]}
                    value={params.status}
                    onChange={(e) => {
                      setParams((value) => ({ ...value, status: e, page: 1 }))
                    }}
                  />
                  <div className="flex flex-1 items-center justify-end gap-3">
                    <div className="w-full max-w-[375px]">
                      <MyTextField
                        placeholder="Search"
                        id="input-search"
                        startAdornment={
                          <SearchLg
                            className="size-5"
                            className="size-5 text-gray-light/600"
                            stroke="currentColor"
                          />
                        }
                        onChangeForm={debounce(
                          (e) =>
                            setParams((value) => ({
                              ...value,
                              search: e.target.value,
                              page: 1,
                            })),
                          1000
                        )}
                      />
                    </div>
                    <MyFilterModal
                      id="filter-ticketing"
                      // currentFilters={ticketList?.filter}
                      onChange={(filter) => {
                        setParams((prev) => ({
                          ...prev,
                          filter,
                          page: 1,
                          search: '',
                        }))
                      }}
                      target={(open, handleClick) => (
                        <MyButton
                          removeWhite
                          onClick={handleClick}
                          color="secondary"
                          variant="outlined"
                          size="md"
                        >
                          <FilterLines className="size-5" stroke="currentColor" />
                          <p className="text-sm-semibold">Filters</p>
                        </MyButton>
                      )}
                    />
                  </div>
                </div>
                <div>
                  <MyDataTable
                    values={Enquiry}
                    paginator
                    cursorPointer
                    // onDeleteAll={bulkDeleteTerminal}
                    selectionMode="multiple"
                    onSelectionChange={(value) => {
                      setEnquiry(value)
                      setCheck(value.data?.filter((e) => e.checked === true).map((e) => e.id))
                    }}
                    onChangePagination={(page) => {
                      setParams((value) => ({ ...value, page }))
                    }}
                    onClick={(value) => {
                      // if (!params.archive) {
                      handleCurrentSlider({ status: true, current: 'details-slider' }, value.id)
                      // }
                    }}
                    currentSortFieldFromParams={params.sort}
                    currentSortOrderFromParams={params.order}
                  >
                    <MyColumn
                      field="name,nip"
                      onSort={(sort) => {
                        setParams((prev) => ({ ...prev, ...sort }))
                      }}
                      header="Request Number & Date"
                      body={(value) => (
                        <div className="column">
                          <p
                            className="text-sm-medium text-brand-600 hover:cursor-pointer"
                            // onClick={() =>
                            //   handleCurrentSlider(
                            //     { status: true, current: 'details-slider' },
                            //     value.id
                            //   )
                            // }
                          >
                            {value?.name}
                          </p>
                          <p className="text-sm-regular text-gray-600">{value?.nip}</p>
                        </div>
                      )}
                    />

                    <MyColumn
                      field="role.name"
                      onSort={(sort) => {
                        setParams((prev) => ({ ...prev, ...sort }))
                      }}
                      header="Name & NIK"
                      body={(value) => (
                        <p className="text-sm-regular text-gray-light-600">
                          {value?.role?.name || '-'}
                        </p>
                      )}
                    />

                    <MyColumn
                      field="info"
                      onSort={(sort) => {
                        setParams((prev) => ({ ...prev, ...sort }))
                      }}
                      header="General Info"
                      body={(value) => (
                        <p className="text-sm-regular text-gray-light-600">{value?.info}</p>
                      )}
                    />

                    <MyColumn
                      field="branch.name"
                      onSort={(sort) => {
                        setParams((prev) => ({ ...prev, ...sort }))
                      }}
                      header="Selfie With KTP"
                      body={(value) => (
                        <p className="text-sm-regular text-gray-light-600">{value?.idSelfie}</p>
                      )}
                    />

                    <MyColumn
                      field="consent"
                      onSort={(sort) => {
                        setParams((prev) => ({ ...prev, ...sort }))
                      }}
                      header="Consent"
                      body={(value) => (
                        <p className="text-sm-regular text-gray-light-600">{value?.consent}</p>
                      )}
                    />

                    <MyColumn
                      field="status"
                      onSort={(sort) => {
                        setParams((prev) => ({ ...prev, ...sort }))
                      }}
                      header="Status"
                      body={(value) => (
                        <p className="text-sm-regular text-gray-light-600">{value?.status}</p>
                      )}
                    />

                    <MyColumn
                      field="status"
                      onSort={(sort) => {
                        setParams((prev) => ({ ...prev, ...sort }))
                      }}
                      header="Created By & Last Update"
                      body={(value) => (
                        <p className="text-sm-regular text-gray-light-600">{value?.status}</p>
                      )}
                    />

                    <MyColumn
                      alignment="right"
                      body={
                        (value) =>
                          params.archive === 1 && (
                            // access?.edit_delete && (
                            <MyTooltip
                              placement="top"
                              target={
                                <div className="ml-auto flex w-max items-end justify-end gap-1">
                                  <MyButton
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      restoreEnquiry([value.id])
                                    }}
                                    size="md"
                                    variant="text"
                                  >
                                    <RefreshCcw01
                                      className="size-5 text-gray-light-600"
                                      stroke="currentColor"
                                    />
                                  </MyButton>
                                </div>
                              }
                            >
                              <p className="text-xs-medium text-white">Restore</p>
                            </MyTooltip>
                          )
                        // )
                      }
                    />
                  </MyDataTable>
                </div>
              </div>
            </div>
          </div>
        </main>
      </SimpleBar>
    </>
  )
}

export default Enquiry
