import { Edit01, XClose, RefreshCcw01, LockUnlocked01 } from '@untitled-ui/icons-react'
import SimpleBar from 'simplebar-react'
import moment from 'moment'
import { MyAvatar, MyButton, MyDetailView } from '@interstellar-component'
import { useEffect, useState } from 'react'
import { useApp } from '../../../AppContext'
import { Access } from '../../../services/Helper'
import { useEnquiry } from '../Context'
// import MyDetailViewLocal from '../../../localComponents/MyDetailViewLocal'
// import ModalEnableEnquiry from './components/ModalEnableEnquiry'

function DetailsSlider() {
  const { getAccess } = useApp()
  const access = getAccess(Access?.Enquiry)

  const {
    handleCurrentSlider,
    currentSlider,
    handleCurrentModal,
    currentModal,
    setCurrentModal,
    deleteSimCard,
    restoreSimCard,
    getEnquiryDetail,
    enableEnquiry,
  } = useEnquiry()
  const [enquiryDetails, setEnquiryDetails] = useState()
  console.log('enquiryDetails', enquiryDetails?.data?.raw)

  const isArchived = enquiryDetails?.data?.raw?.deleted_at

  useEffect(() => {
    if (currentSlider.id) {
      getEnquiryDetail(currentSlider.id).then((enquiryDetail) => {
        setEnquiryDetails(enquiryDetail)
      })
    }
  }, [currentSlider.id, getEnquiryDetail])

  return (
    <>
      {/* <ModalEnableEnquiry
        open={currentModal?.current === 'modal-enable-enquiry'}
        handleCurrentModal={handleCurrentModal}
        currentModal={currentModal}
        onConfirm={() => enableEnquiry(currentSlider.id)}
      /> */}
      <div className="flex h-screen w-[375px] flex-col">
        <header className="relative flex flex-col px-4">
          <div className="relative flex items-start gap-x-4 pb-4 pt-8">
            <button
              type="button"
              aria-label="Close"
              className="absolute right-[12px] top-[12px] flex h-11 w-11 items-center justify-center rounded-lg p-2 text-gray-light-400"
            >
              <XClose
                onClick={() => handleCurrentSlider(null)}
                className="size-6"
                stroke="currentColor"
              />
            </button>
            <MyAvatar photo={enquiryDetails?.data?.raw?.photo_url} size={50} />
            <div className="flex flex-col gap-1">
              <p className="text-xl-semibold text-gray-light-900">
                {enquiryDetails?.data?.raw?.name ?? '-'}
              </p>
              <p className="text-md-regular text-gray-light-600">
                {enquiryDetails?.data?.raw?.role ?? '-'}
              </p>
            </div>
          </div>
        </header>
        <hr className="border-gray-light-200" />

        <div className="flex-1 overflow-hidden">
          <SimpleBar forceVisible="y" style={{ height: '100%' }}>
            <div className="flex flex-1 flex-col gap-8 pb-8 pt-4">
              <div className="flex flex-col gap-6">
                {enquiryDetails?.data?.raw?.active == false && (
                  <div className="mx-4 flex flex-col gap-2 rounded-lg border border-warning-200 bg-warning-25 p-2">
                    <div className="flex gap-1">
                      <LockUnlocked01 className="size-5 text-warning-600" />
                      <p className="text-sm-medium text-black">Akun terkunci</p>
                    </div>
                    <div className="flex gap-2">
                      <div className="custom-bg-inactive-enquiry w-full rounded-lg border border-warning-100 px-4 py-3">
                        <p className="text-xs-medium text-black">
                          Alasan:{' '}
                          {enquiryDetails?.data?.raw?.inactive_reason_code === 'INACTIVE_SESSION'
                            ? 'Enquiry tidak aktif'
                            : enquiryDetails?.data?.raw?.inactive_reason_code ===
                                'MAX_LOGIN_ATTEMPTS'
                              ? 'Salah password'
                              : 'Akun tidak aktif'}
                        </p>
                      </div>
                      <MyButton
                        disabled={enquiryDetails?.data?.raw?.active}
                        type="submit"
                        color="primary"
                        variant="filled"
                        size="md"
                        onClick={() =>
                          setCurrentModal({ status: true, current: 'enable-enquiry-modal' })
                        }
                      >
                        <p className="text-sm-semibold text-nowrap">Buka akun</p>
                        <LockUnlocked01 className="size-5 text-brand-300" />
                      </MyButton>
                    </div>
                  </div>
                )}
                <div className="flex-col px-4">
                  <p className="text-sm-semibold text-gray-light-700">Informasi pribadi</p>
                  <p className="text-sm-regular text-gray-light-600">
                    Detail informasi pribadi enquiry.
                  </p>
                </div>
                <div className="flex flex-1 flex-col">
                  {/* <MyDetailViewLocal
                    datas={enquiryDetails?.data?.private_information ?? {}}
                  /> */}
                </div>

                <div className="flex-col px-4">
                  <p className="text-sm-semibold text-gray-light-700">Informasi umum</p>
                  <p className="text-sm-regular text-gray-light-600">
                    Detail informasi pada data sistem.
                  </p>
                </div>
                <div className="flex flex-1 flex-col">
                  <div className="flex items-center justify-between border-t p-4">
                    <p className="text-sm-medium text-gray-900">Created</p>
                    <div className="flex gap-2">
                      <div className="items-end column">
                        <p className="text-sm-medium text-gray-900">
                          {enquiryDetails?.data?.general_information?.created_by}
                        </p>
                        <p className="text-sm-regular text-gray-600">
                          {moment(enquiryDetails?.data?.general_information?.created_at).format(
                            'DD MMM YYYY • HH:mm'
                          )}
                        </p>
                      </div>
                      <MyAvatar
                        photo={enquiryDetails?.data?.general_information?.created_by_photo}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-b border-t p-4">
                    <p className="text-sm-medium text-gray-900">Last modified</p>
                    <div className="flex gap-2">
                      <div className="items-end column">
                        <p className="text-sm-medium text-gray-900">
                          {enquiryDetails?.data?.general_information?.updated_by}
                        </p>
                        <p className="text-sm-regular text-gray-600">
                          {moment(enquiryDetails?.data?.general_information?.updated_at).format(
                            'DD MMM YYYY • HH:mm'
                          )}
                        </p>
                      </div>
                      <MyAvatar
                        photo={enquiryDetails?.data?.general_information?.updated_by_photo}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SimpleBar>
        </div>

        <footer className="flex items-center justify-end gap-4 border-t border-gray-light-200 px-4 py-4">
          {enquiryDetails?.raw?.deleted_at ? (
            <MyButton
              onClick={() => restoreSimCard(currentSlider.id)}
              color="primary"
              variant="outlined"
              size="md"
            >
              <RefreshCcw01 className="size-5" stroke="currentColor" />
              <span className="text-sm-semibold">Restore</span>
            </MyButton>
          ) : (
            <>
              {currentSlider?.origin !== 'approval' && (
                <>
                  {access?.edit_delete && !isArchived && (
                    <MyButton
                      disabled={!access?.edit_delete}
                      color="secondary"
                      variant="outlined"
                      size="sm"
                      onClick={() =>
                        handleCurrentSlider({ current: 'form-slider' }, currentSlider.id)
                      }
                    >
                      <Edit01 className="size-5 text-gray-light-600" stroke="currentColor" />
                      <span className="text-sm-semibold">Edit</span>
                    </MyButton>
                  )}
                </>
              )}
            </>
          )}
        </footer>
      </div>
    </>
  )
}

export default DetailsSlider
