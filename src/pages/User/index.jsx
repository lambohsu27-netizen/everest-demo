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
} from '@interstellar-component'
import {
  AlertCircle,
  Download04,
  FilterLines,
  Lock01,
  Plus,
  RefreshCcw01,
  SearchLg,
  Trash01,
} from '@untitled-ui/icons-react'
import React, { useEffect, useState } from 'react'
import SimpleBar from 'simplebar-react'
import { debounce } from 'lodash'
import { useUser } from './Context'
import Formslider from './Sliders/FormSlider'
import DetailSlider from './Sliders/DetailSlider'
import DetailSliderEnroll from './Sliders/DetailSliderEnroll'
import { useApp } from '../../AppContext'
import { Access } from '../../services/Helper'

function User() {
  // const { getAccess } = useApp()
  // const access = getAccess(Access?.USER)
  const [isConfirmModalOpen, setConfirmModalOpen] = useState(false)

  const {
    currentSlider,
    handleCurrentSlider,
    setParams,
    user,
    setUser,
    currentTabs,
    setCheck,
    deleteUser,
    check,
    restoreUser,
    params,
    downloadExport,
    currentModal,
    handleCurrentModal,
    isChanged,
  } = useUser()
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
      <MyModalSlider
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
      </MyModalSlider>
      <MyConfirmModal
        open={isConfirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        onConfirm={() => deleteUser(check)}
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
            <div className="flex flex-col gap-1">
              <p className="display-xs-semibold text-gray-light-900">Application Enquiry</p>
              <p className="text-md-regular text-gray-light-600">
                Manage and view all application enquiries.
              </p>
            </div>
            <div className="w-full">
              <div className="w-full rounded-xl border border-gray-light-200 shadow-shadows/shadow-xs">
                <div className="flex flex-col gap-5">
                  <div className="flex items-center gap-4 px-4 pt-5">
                    <div className="flex-1 flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <p className="text-lg-semibold text-gray-light-900">List of Enquiry</p>
                        <MyChip
                          label={`${user?.meta?.total || '0'} item`}
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
                            onClick={() => restoreUser(check)}
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
                        onClick={downloadExport}
                        color="secondary"
                        variant="outlined"
                        size="md"
                        // disabled={!access?.add}
                      >
                        <Download04 className="size-5 text-gray-400" />
                        <p className="text-sm-semibold">Export</p>
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
                        variant="filled"
                        size="md"
                        // disabled={!access?.edit_delete}
                      >
                        <Plus className="size-5" stroke="currentColor" />
                        <p className="text-sm-semibold">User baru</p>
                      </MyButton>
                      {/* )} */}
                    </div>
                  </div>
                  <hr className="border-gray-light-200" />
                </div>

                <div className="flex items-center justify-between gap-3 border-gray-light-200 px-4 py-3">
                  <div className="flex w-full items-start justify-start gap-3">
                    <div className="w-full max-w-[375px]">
                      <MyTextField
                        placeholder="Cari"
                        id="input-search"
                        // value={params.search}
                        startAdornment={
                          <SearchLg className="size-5 text-gray-light-600" stroke="currentColor" />
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
                        focusColor="#0A2349"
                        focusShadow="#DCE3F1"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-3">
                    <MyFilterModal
                      id="filter-ticketing"
                      currentFilters={user?.filter}
                      onChange={(filter) => {
                        setParams((value) => ({
                          ...value,
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
                          variant="text"
                          size="md"
                        >
                          <FilterLines className="size-5" stroke="currentColor" />
                          <p className="text-sm-semibold">Filters</p>
                        </MyButton>
                      )}
                    />

                    <MyArchiveButton
                      value={params}
                      onChange={(e) => {
                        setParams((value) => ({ ...value, archive: e, page: 1 }))
                      }}
                    />
                  </div>
                </div>
                <div>
                  <MyDataTable
                    values={user}
                    paginator
                    cursorPointer
                    // onDeleteAll={bulkDeleteTerminal}
                    selectionMode="multiple"
                    onSelectionChange={(value) => {
                      setUser(value)
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
                      header="Nama/NIP"
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
                      header="Role"
                      body={(value) => (
                        <p className="text-sm-regular text-gray-light-600">
                          {value?.role?.name || '-'}
                        </p>
                      )}
                    />

                    <MyColumn
                      field="whatsapp, email"
                      onSort={(sort) => {
                        setParams((prev) => ({ ...prev, ...sort }))
                      }}
                      header="No. telepon / email"
                      body={(value) => (
                        <div>
                          <p className="text-sm-medium text-gray-900">{value?.whatsapp || '-'}</p>
                          <p className="text-sm-regular text-gray-light-600">
                            {value?.email || '-'}
                          </p>
                        </div>
                      )}
                    />

                    <MyColumn
                      field="branch.name"
                      onSort={(sort) => {
                        setParams((prev) => ({ ...prev, ...sort }))
                      }}
                      header="Penempatan"
                      body={(value) => (
                        <p className="text-sm-regular text-gray-light-600">{value?.branch?.name}</p>
                      )}
                    />

                    <MyColumn
                      field="status"
                      header=""
                      body={(value) =>
                        value?.active === false && (
                          <MyChip
                            startAdornment={<Lock01 className="size-3" stroke="currentColor" />}
                            label="Akun terkunci"
                            color="warning"
                            variant="filled"
                            size="sm"
                            rounded="md"
                          />
                        )
                      }
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
                                      restoreUser([value.id])
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

export default User
