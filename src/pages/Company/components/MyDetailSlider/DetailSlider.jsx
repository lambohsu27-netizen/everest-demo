import React, { useState, useEffect } from 'react'
import {
  MyAvatar,
  MyButton,
  MyButtonGroupV2,
  MyChip,
  MyTabPanel,
  MyTabView,
} from '@interstellar-component'
import { Edit01, LogOut01, RefreshCcw01, Trash01, User01, XClose } from '@untitled-ui/icons-react'
import Result from './Result'
import { useCompany } from '../../Context'
import Information from './Information'

const MyDetailSlider = () => {
  const {
    currentSlider,
    handleCurrentSlider,
    getCustomerDetail,
    deleteCustomer,
    restorePartNumber,
    customerDetail,
    restoreUser,
    jobOrderDetail,
  } = useCompany()

  //   useEffect(() => {
  //     if (currentSlider.id) getCustomerDetail(currentSlider.id)
  //   }, [currentSlider.id])

  const [tab, setTab] = useState('result')
  return (
    <div className="flex h-screen w-[375px] flex-col">
      <header className="relative flex flex-col px-4">
        <div className="relative flex items-start gap-x-4 pb-4 pt-8">
          <button
            type="button"
            aria-label="Close"
            className="absolute right-[12px] top-[12px] flex h-11 w-11 items-center justify-center rounded-lg p-2 text-gray-light/400"
          >
            <XClose
              onClick={() => handleCurrentSlider(null)}
              className="size-6"
              stroke="currentColor"
            />
          </button>
          <div className="flex gap-4 flex-col">
            <div className="flex gap-3 flex-col">
              <div className="flex flex-col gap-1">
                <p className="text-xl-semibold text-gray-light/900">PT Everest Maju sejahtera</p>
                <p className="text-md-regular text-gray-light/600">ID-00192</p>
              </div>
              <MyChip
                label="Rejected"
                rounded={'lg'}
                startAdornment={
                  <div
                    className={`w-1.5 h-1.5 min-h-[6px] min-w-[6px] rounded-full ${
                      jobOrderDetail?.data?.status === 'Active'
                        ? 'bg-success/500'
                        : jobOrderDetail?.data?.status === 'Waiting CLIK approval'
                          ? 'bg-warning/500'
                          : jobOrderDetail?.data?.status === 'Rejected'
                            ? 'bg-error/500'
                            : jobOrderDetail?.data?.status === 'Document submission'
                              ? 'bg-brand/500'
                              : 'bg-error/500'
                    }`}
                  ></div>
                }
                color={'modern'}
                variant={'outlined'}
                size={'sm'}
              />
            </div>
            <MyButtonGroupV2
              buttons={[
                { label: 'Result', value: 'result' },
                { label: 'Billing', value: 'billing' },
                { label: 'Information', value: 'information' },
              ]}
              value={tab}
              onChange={(value) => setTab(value)}
            />
          </div>
        </div>
        {/* <hr className="border-gray-light/200" /> */}
      </header>

      <div className="flex-1 overflow-hidden">
        <MyTabView value={tab}>
          <MyTabPanel value={'result'}>
            <Result data={jobOrderDetail} />
          </MyTabPanel>
          {/* <MyTabPanel value={'activity'}>
            <Activity data={jobOrderDetail?.data?.action_histories} />
          </MyTabPanel> */}
          <MyTabPanel value={'information'}>
            <Information data={jobOrderDetail} />
          </MyTabPanel>
        </MyTabView>
      </div>
    </div>
  )
}

export default MyDetailSlider
