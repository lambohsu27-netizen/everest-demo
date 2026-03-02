import {
  MyButton,
  MyChip,
  MyColumn,
  MyConfirmModal,
  MyConfirmUnsavedModal,
  MyDataTable,
  MyFilterModal,
  MyTextField,
  MyTooltip,
  MyButtonGroupV2,
  MyAvatar,
  MyModalSlider,
} from '@interstellar-component'
import {
  AlertCircle,
  CheckCircle,
  FilterLines,
  Minus,
  Plus,
  RefreshCcw01,
  SearchLg,
  Send01,
  Share03,
  Trash01,
} from '@untitled-ui/icons-react'
import React, { useEffect, useMemo, useState } from 'react'
import SimpleBar from 'simplebar-react'
import { debounce } from 'lodash'
import moment from 'moment'
import { useEnquiry } from './Context'
import Formslider from './Sliders/FormSlider'
import DetailsSlider from './Sliders/DetailSlider'
import SignatureModal from './Sliders/components/SignatureModal'

function Enquiry() {
  // const { getAccess } = useApp()
  // const access = getAccess(Access?.Enquiry)
  const [isConfirmModalOpen, setConfirmModalOpen] = useState(false)
  const [isSubmitModalOpen, setSubmitModalOpen] = useState(false)

  const {
    handleCurrentSlider,
    setParams,
    setEnquiry,
    setCheck,
    deleteEnquiry,
    bulkSubmitEnquiry,
    check,
    restoreEnquiry,
    params,
    downloadExport,
    currentModal,
    handleCurrentModal,
    enquiry,
    currentSlider,
    isChanged,
    isSignatureModalOpen,
    setIsSignatureModalOpen,
    signatureModalHandlerRef,
  } = useEnquiry()
  // console.log('enquiry', enquiry)

  useEffect(() => {
    setParams((value) => ({
      ...value,
      sort: null,
      order: null,
    }))
  }, [params.archive])

  // Required for submit (must match BE): name, NIK, birth date, Foto KTP, Selfie with KTP, TNC, Signature
  const isDraftSubmittable = (r) => {
    const name = (r?.name ?? '').trim()
    const nik = (r?.nik ?? '').trim().replace(/\s/g, '')
    const dob = r?.dob
    const dobStr =
      dob instanceof Date ? dob.toISOString().slice(0, 10) : (dob && String(dob).trim())
    const hasPhotoKtp = !!(
      (r?.photo_ktp && String(r.photo_ktp).trim()) ||
      r?.photo_ktp_url
    )
    const hasSelfie = !!(
      (r?.selfie_with_ktp && String(r.selfie_with_ktp).trim()) ||
      r?.selfie_with_ktp_url
    )
    const hasTnc = r?.agreement_tnc === true
    const hasSignature = !!(r?.signature && String(r.signature).trim()) || !!r?.signature_url
    return (
      name.length > 0 &&
      nik.length === 16 &&
      /^\d+$/.test(nik) &&
      dobStr &&
      /^\d{4}-\d{2}-\d{2}$/.test(dobStr) &&
      hasPhotoKtp &&
      hasSelfie &&
      hasTnc &&
      hasSignature
    )
  }

  // Only checked drafts that have required fields (name, NIK, birth date); others ignored
  const submittableDraftIds = useMemo(
    () =>
      enquiry?.data?.filter(
        (r) =>
          check?.includes(r.id) &&
          r.status === 'draft' &&
          isDraftSubmittable(r)
      ).map((r) => r.id) ?? [],
    [enquiry?.data, check]
  )

  // All checked drafts (for modal message when some are not submittable)
  const draftOnlyIds = useMemo(
    () =>
      enquiry?.data?.filter(
        (r) => check?.includes(r.id) && r.status === 'draft'
      ).map((r) => r.id) ?? [],
    [enquiry?.data, check]
  )

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
        element={<DetailsSlider />}
        onClose={() => {
          handleCurrentSlider(null)
        }}
      />
      <MyConfirmModal
        open={isConfirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        onConfirm={() => deleteEnquiry(check)}
        title={`Anda yakin menghapus ${check?.length} data?`}
        message="Data yang dihapus akan masuk ke sistem untuk ditinjau terlebih dahulu."
        icon={<AlertCircle className="text-warning-600" />}
        bgColor="bg-warning-100"
      />
      <MyConfirmModal
        open={isSubmitModalOpen}
        onClose={() => setSubmitModalOpen(false)}
        onConfirm={() => {
          if (submittableDraftIds.length > 0) {
            bulkSubmitEnquiry(submittableDraftIds)
            setSubmitModalOpen(false)
          }
        }}
        title={
          draftOnlyIds.length === 0
            ? 'Tidak ada draft yang dipilih'
            : submittableDraftIds.length === 0
              ? 'Draft tidak memenuhi syarat'
              : `Anda yakin submit ${submittableDraftIds.length} draft?`
        }
        message={
          draftOnlyIds.length === 0
            ? 'Pilih minimal satu draft untuk submit.'
            : submittableDraftIds.length === 0
              ? 'Draft harus lengkap: Name, NIK (16 digit), Tanggal Lahir, Foto KTP, Selfie with KTP, TNC dicentang, dan Signature. Lengkapi data lalu coba lagi.'
              : draftOnlyIds.length > submittableDraftIds.length
                ? `${submittableDraftIds.length} draft memenuhi syarat. ${draftOnlyIds.length - submittableDraftIds.length} draft diabaikan karena data belum lengkap (Name, NIK, Tanggal Lahir, Foto KTP, Selfie, TNC, Signature).`
                : 'Draft yang dipilih akan dikirim ke CLIK.'
        }
        icon={<CheckCircle className="text-success-600" />}
        bgColor="bg-success-100"
      />
      <MyConfirmUnsavedModal
        open={currentModal?.current === 'unsaved-modal'}
        handleCurrentModal={handleCurrentModal}
        handleCurrentSlider={handleCurrentSlider}
        currentModal={currentModal}
      />
      <SignatureModal
        isOpen={isSignatureModalOpen}
        onClose={() => setIsSignatureModalOpen(false)}
        onSign={(dataUrl) => signatureModalHandlerRef.current?.(dataUrl)}
      />

      <SimpleBar forceVisible="y" className="flex-1" style={{ height: '100vh' }}>
        <main className="flex flex-col gap-4 md:gap-8 pb-12 pt-4 md:pt-8 w-full">
          <div className="flex flex-col gap-4 md:gap-6 px-4 md:px-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-1">
              <div>
                <p className="display-xs-semibold text-gray-900">Application Enquiry</p>
                <p className="text-md-regular text-gray-600">
                  Manage and monitor customer credit enquiry requests.{' '}
                </p>
              </div>

              <div className="flex w-fit md:w-auto">
                <MyButton
                  onClick={downloadExport}
                  color="primary"
                  variant="filled"
                  size="md"
                  // disabled={!access?.add}
                >
                  <Share03 className="size-5 text-brand/300 pr-1" />
                  <p className="text-sm-semibold">Export</p>
                </MyButton>
              </div>
            </div>
            <div className="w-full">
              <div className="w-full md:rounded-xl md:border border-gray-light-200 md:shadow-shadows/shadow-xs flex flex-col">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-5 px-0 md:px-4 pt-4 md:pt-5 order-1">
                  <div className="flex flex-1 flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <p className="text-lg-semibold text-gray-900">List of Enquiry</p>
                      <div className="hidden md:block">
                        <MyChip
                          label={`${enquiry?.meta?.total || '0'} item`}
                          // color="primary"
                          variant="outlined"
                          size="sm"
                          rounded="xl"
                          customStyle=" bg-brand-200/30 border border-brand-200"
                        />
                      </div>
                    </div>
                    <p className="text-sm-regular text-gray-600">
                      View and manage all customer credit enquiry requests.
                    </p>
                  </div>
                  <div className="flex items-center justify-start md:justify-end gap-3 w-full md:w-auto overflow-x-auto pb-4 md:pb-0 order-3 md:order-2">
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
                          variant="text"
                          size="sm"
                          onClick={() => setConfirmModalOpen(true)}
                          // disabled={!access?.edit_delete}
                        >
                          {/* <Trash01 className="size-5" stroke="currentColor" /> */}
                          <p className="text-sm-semibold">
                            {check?.length === 1 ? 'Delete' : 'Delete All'}
                          </p>
                        </MyButton>
                      )
                    ) : null}
                    {/* )} */}
                    {/* Desktop Text Button */}
                    {/* <div className="hidden md:block">
                      <MyButton
                        // onClick={downloadExport}
                        color="error"
                        variant="text"
                        size="md"
                        // disabled={!access?.add}
                      >
                        <p className="text-sm-semibold whitespace-nowrap">Delete All</p>
                      </MyButton>
                    </div> */}

                    {check?.length > 0 && (
                      <MyButton
                        onClick={() => setSubmitModalOpen(true)}
                        color="secondary"
                        variant="outlined"
                        size="md"
                        disabled={draftOnlyIds.length === 0}
                        // disabled={!access?.edit_delete}
                      >
                        <Send01 className="size-5" stroke="currentColor" />
                        <p className="text-sm-semibold text-brand-700 md:text-black whitespace-nowrap">
                          {check?.length === 1 ? 'Submit' : 'Submit All'}
                        </p>
                      </MyButton>
                    )}

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
                      <p className="text-sm-semibold whitespace-nowrap">New Request</p>
                    </MyButton>
                    {/* )} */}
                  </div>
                </div>

                <div className="flex flex-col md:hidden order-2 px-0 py-4 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <MyTextField
                        placeholder="Search"
                        id="input-search-mobile"
                        startAdornment={
                          <SearchLg className="size-5 text-gray-light/600" stroke="currentColor" />
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
                      id="filter-ticketing-mobile"
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
                          customStyle="px-2"
                        >
                          <FilterLines className="size-5" stroke="currentColor" />
                        </MyButton>
                      )}
                    />
                  </div>
                </div>

                <hr className="border-gray-light-200 hidden md:block w-full order-3 md:mt-5" />

                <div className="hidden md:flex items-center justify-between gap-3 border-b border-gray-light/200 px-4 py-3 order-4">
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
                  <div className="flex items-center justify-start md:justify-end gap-3 px-0 md:px-0 pt-0 md:pt-0 order-3 md:order-2 w-full md:w-auto overflow-x-auto pb-4 md:pb-0">
                    <div className="w-full max-w-[375px]">
                      <MyTextField
                        placeholder="Search"
                        id="input-search"
                        startAdornment={
                          <SearchLg className="size-5 text-gray-light/600" stroke="currentColor" />
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
                      currentFilters={enquiry?.filter}
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

                <div className="order-5">
                  <MyDataTable
                    values={enquiry}
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
                      if (value.status === 'draft') {
                        handleCurrentSlider({ status: true, current: 'form-slider' }, value.id)
                      } else {
                        handleCurrentSlider({ status: true, current: 'details-slider' }, value.id)
                      }
                    }}
                    currentSortFieldFromParams={params.sort}
                    currentSortOrderFromParams={params.order}
                  >
                    <MyColumn
                      field="request_number,created_at"
                      onSort={(sort) => {
                        const parts = sort.split(',')
                        const direction = parts[parts.length - 1]
                        const fields = ['request_number', 'created_at']

                        if (direction === 'null') {
                          // MyColumn reset → advance to next field or reset
                          const idx = fields.indexOf(params.sort)
                          if (idx !== -1 && idx < fields.length - 1) {
                            setParams((prev) => ({
                              ...prev,
                              sort: fields[idx + 1],
                              order: 'asc',
                              page: 1,
                            }))
                          } else {
                            setParams((prev) => ({ ...prev, sort: null, order: null, page: 1 }))
                          }
                        } else {
                          // asc or desc — use params.sort if already in this column group, else start from fields[0]
                          const sortField = fields.includes(params.sort) ? params.sort : fields[0]
                          setParams((prev) => ({
                            ...prev,
                            sort: sortField,
                            order: direction,
                            page: 1,
                          }))
                        }
                      }}
                      header="Request Number & Date"
                      body={(value) => (
                        <div className="column">
                          <p className="text-sm-medium text-gray-900 hover:cursor-pointer">
                            {value?.request_number}
                          </p>
                          <p className="text-sm-regular text-gray-600">
                            {moment(value?.created_at).format('DD/MM/YYYY HH:mm')}
                          </p>
                        </div>
                      )}
                    />

                    <MyColumn
                      field="name,nik"
                      onSort={(sort) => {
                        const parts = sort.split(',')
                        const direction = parts[parts.length - 1]
                        const fields = ['name', 'nik']

                        if (direction === 'null') {
                          const idx = fields.indexOf(params.sort)
                          if (idx !== -1 && idx < fields.length - 1) {
                            setParams((prev) => ({
                              ...prev,
                              sort: fields[idx + 1],
                              order: 'asc',
                              page: 1,
                            }))
                          } else {
                            setParams((prev) => ({ ...prev, sort: null, order: null, page: 1 }))
                          }
                        } else {
                          const sortField = fields.includes(params.sort) ? params.sort : fields[0]
                          setParams((prev) => ({
                            ...prev,
                            sort: sortField,
                            order: direction,
                            page: 1,
                          }))
                        }
                      }}
                      header="Name & NIK"
                      body={(value) => (
                        <div className="column">
                          <p className="text-sm-medium text-gray-900">{value?.name || '-'}</p>
                          <p className="text-sm-regular text-gray-600">{value?.nik}</p>
                        </div>
                      )}
                    />

                    <MyColumn
                      field="info"
                      alignment="center"
                      onSort={(sort) => {
                        setParams((prev) => ({ ...prev, ...sort }))
                      }}
                      header="General Info"
                      body={(value) => (
                        <div className="flex items-center justify-center">
                          <CheckCircle className="text-success/600" />
                        </div>
                      )}
                    />

                    <MyColumn
                      field="branch.name"
                      alignment="center"
                      onSort={(sort) => {
                        setParams((prev) => ({ ...prev, ...sort }))
                      }}
                      header="Selfie With KTP"
                      body={(value) => (
                        <div className="flex items-center justify-center">
                          <CheckCircle className="text-success/600" />
                        </div>
                      )}
                    />

                    <MyColumn
                      field="consent"
                      onSort={(sort) => {
                        setParams((prev) => ({ ...prev, ...sort }))
                      }}
                      header="Consent"
                      alignment="center"
                      body={(value) => <Minus className="text-gray/600" />}
                    />

                    <MyColumn
                      field="status"
                      onSort={(sort) => {
                        const [field, order] = sort.split(',')
                        setParams((prev) => ({
                          ...prev,
                          sort: field === 'null' ? null : field,
                          order: order === 'null' ? null : order,
                          page: 1,
                        }))
                      }}
                      header="Status"
                      body={(value) => {
                        const status = value?.status
                        switch (status) {
                          case 'draft':
                            return (
                              <MyChip label="Draft" size="sm" color="modern" variant="outlined" />
                            )
                          case 'in_progress':
                            return (
                              <MyChip
                                label="In progress"
                                size="sm"
                                color="purple"
                                variant="filled"
                              />
                            )
                          case 'completed':
                            return (
                              <MyChip
                                label="Completed"
                                size="sm"
                                color="success"
                                variant="filled"
                              />
                            )
                          case 'error':
                            return (
                              <MyChip
                                label="Data not found"
                                size="sm"
                                color="error"
                                variant="filled"
                              />
                            )
                          default:
                            break
                        }
                      }}
                    />

                    <MyColumn
                      field="created_at"
                      onSort={(sort) => {
                        const [field, order] = sort.split(',')
                        setParams((prev) => ({
                          ...prev,
                          sort: field === 'null' ? null : field,
                          order: order === 'null' ? null : order,
                          page: 1,
                        }))
                      }}
                      header="Created By & Last Update"
                      body={(value) => (
                        <div className="flex items-center gap-2">
                          <MyAvatar
                            size={32}
                            photo={value?.createdBy?.photo_url}
                            name={value?.createdBy?.name}
                          />
                          <div className="column">
                            <p className="text-sm-medium text-gray-900">
                              {value?.createdBy?.name || '-'}
                            </p>
                            <p className="text-sm-regular text-gray-600">
                              {moment(value?.updated_at).format('DD/MM/YYYY HH:mm')}
                            </p>
                          </div>
                        </div>
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
