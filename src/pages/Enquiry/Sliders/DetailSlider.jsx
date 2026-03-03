import { Edit01, XClose, RefreshCcw01, Placeholder } from '@untitled-ui/icons-react'
import {
  MyAvatar,
  MyButton,
  MyHorizontalTabV2,
  MyTabButton,
  MyTabView,
  MyTabPanel,
  MyChip,
} from '@interstellar-component'
import { useEffect, useState } from 'react'
import { useApp } from '../../../AppContext'
import { Access } from '../../../services/Helper'
import { useEnquiry } from '../Context'
import Attachment from './components/Attachment'
import GeneralInformation from './components/GeneralInformation'

function DetailsSlider() {
  // const { getAccess } = useApp()
  // const access = getAccess(Access?.Enquiry)

  const {
    handleCurrentSlider,
    currentSlider,
    setCurrentModal,
    restoreSimCard,
    getEnquiryDetail,
    currentTabs,
    handleChangeTabs,
  } = useEnquiry()
  const [enquiryDetails, setEnquiryDetails] = useState()
  console.log('enquiryDetails', enquiryDetails)

  const isArchived = enquiryDetails?.data?.raw?.deleted_at

  useEffect(() => {
    if (currentSlider.id) {
      getEnquiryDetail(currentSlider.id).then((enquiryDetail) => {
        setEnquiryDetails(enquiryDetail)
      })
    }
  }, [currentSlider.id, getEnquiryDetail])

  return (
    <div className="flex h-screen w-[410px] flex-col">
      <header className="relative flex flex-col pt-8">
        <button
          type="button"
          aria-label="Close"
          onClick={() => handleCurrentSlider(null)}
          className="absolute right-[12px] top-[12px] z-10 flex h-11 w-11 items-center justify-center rounded-lg p-2 text-gray-light-400"
        >
          <XClose className="size-6" stroke="currentColor" />
        </button>

        <div className="flex w-full flex-col gap-6 px-4">
          <div className="flex flex-col gap-4">
            <div className="flex flex-row gap-4">
              <div className="w-10 h-10 rounded-lg border border-gray-300 justify-center items-center flex">
                <Placeholder className="size-5 text-gray-700" />
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-lg-semibold text-gray-900">
                  {enquiryDetails?.data?.raw?.name ?? '-'}
                </p>
                <p className="text-sm-regular text-gray-600">
                  {enquiryDetails?.data?.raw?.request_number ?? '-'}
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-5">
            <div className="min-w-[100px]">
              {(() => {
                const status = enquiryDetails?.data?.raw?.status
                switch (status) {
                  case 'draft':
                    return <MyChip label="Draft" size="sm" color="modern" variant="outlined" />
                  case 'in_progress':
                    return <MyChip label="In progress" size="sm" color="purple" variant="filled" />
                  case 'completed':
                    return <MyChip label="Completed" size="sm" color="success" variant="filled" />
                  case 'error':
                    return (
                      <MyChip label="Data not found" size="sm" color="error" variant="filled" />
                    )
                  default:
                    return null
                }
              })()}
            </div>
            <p className="text-sm-regular text-gray-600 italic">
              {{
                draft: 'Enquiry masih dalam status draft. Submit untuk memproses permintaan.',
                in_progress: 'Credit Report sedang diproses.',
                completed:
                  'Credit Report telah berhasil diterbitkan dan dikirim ke email yang terdaftar.',
                error: 'Data tidak ditemukan.',
              }[enquiryDetails?.data?.raw?.status] ??
                '—'}
            </p>
          </div>

          <MyHorizontalTabV2
            // value={currentTabs.type}
            // type="underline"
            // onChange={(value) => handleChangeTabs({ ...currentTabs, type: value })}
            value={currentTabs.type}
            onChange={(newStatus) => {
              handleChangeTabs({ type: newStatus, search: '' })
              // handleChildCurrentSlider({
              //   currentChild: null,
              // })
            }}
            tabs={[
              { value: 'general', label: 'General Information' },
              { value: 'attachment', label: 'Attachment' },
            ]}
          />
        </div>
      </header>

      <hr className="border-gray-light-200 mt-4" />

      <div className="flex flex-1 flex-col overflow-hidden">
        <MyTabView value={currentTabs.type}>
          <MyTabPanel value="general">
            <GeneralInformation enquiryDetails={enquiryDetails} setCurrentModal={setCurrentModal} />
          </MyTabPanel>
          <MyTabPanel value="attachment">
            <Attachment enquiryDetails={enquiryDetails} />
          </MyTabPanel>
        </MyTabView>
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
                {/* {access?.edit_delete && !isArchived && ( */}
                <MyButton
                  // disabled={!access?.edit_delete}
                  color="secondary"
                  variant="outlined"
                  size="sm"
                  onClick={() => handleCurrentSlider({ current: 'form-slider' }, currentSlider.id)}
                >
                  <Edit01 className="size-5 text-gray-light-600" stroke="currentColor" />
                  <span className="text-sm-semibold">Edit</span>
                </MyButton>
                {/* )} */}
              </>
            )}
          </>
        )}
      </footer>
    </div>
  )
}

export default DetailsSlider
