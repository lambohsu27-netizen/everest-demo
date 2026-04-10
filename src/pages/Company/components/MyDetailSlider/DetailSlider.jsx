import React, { useState } from 'react'
import {
  MyButtonGroupV2,
  MyTabPanel,
  MyTabView,
} from '@interstellar-component'
import { XClose } from '@untitled-ui/icons-react'
import Result from './Result'
import { useCompany } from '../../Context'
import Information from './Information'
import MyMemberStatusChip from '../MyMemberStatusChip'

function MyDetailSlider() {
  const { handleCurrentSlider, companyDetail, isLoadingCompanyDetail } = useCompany()

  const [tab, setTab] = useState('result')

  const title =
    companyDetail?.name ?? companyDetail?.legal_name ?? '—'
  const subtitle = companyDetail?.nib ?? companyDetail?.id ?? ''
  const enrollmentStatus = companyDetail?.enrollment_status ?? ''

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
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <p className="text-xl-semibold text-gray-light/900">
                  {isLoadingCompanyDetail ? '…' : title}
                </p>
                {subtitle ? (
                  <p className="text-md-regular text-gray-light/600">{subtitle}</p>
                ) : null}
              </div>
              {!isLoadingCompanyDetail && enrollmentStatus ? (
                <MyMemberStatusChip status={String(enrollmentStatus)} />
              ) : null}
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
      </header>

      <div className="flex-1 overflow-hidden">
        <MyTabView value={tab}>
          <MyTabPanel value="result">
            <Result loading={isLoadingCompanyDetail} />
          </MyTabPanel>
          <MyTabPanel value="billing">
            <div className="px-4 py-6 text-sm text-gray-light/600">Billing coming soon.</div>
          </MyTabPanel>
          <MyTabPanel value="information">
            <Information data={companyDetail} loading={isLoadingCompanyDetail} />
          </MyTabPanel>
        </MyTabView>
      </div>
    </div>
  )
}

export default MyDetailSlider
