import { MyAvatar, MyChip, MyDetailView } from '@interstellar-component'
import moment from 'moment'
import { useRef, useState } from 'react'
import { pick } from 'lodash'
import SimpleBar from 'simplebar-react'
const Information = () => {
  return (
    <>
      <SimpleBar forceVisible="y" style={{ height: '100%' }}>
        <div className="flex flex-1 flex-col gap-8 pb-8 pt-4">
          <div className="flex flex-1 flex-col gap-y-6 px-4">
            <MyDetailView
              header="Company Information"
              // datas={customerDetail?.data?.customer_information}
              func={{
                'Company Legal Name': (value) => (
                  <>
                    <p className="text-sm-semibold text-right text-gray/600">
                      PT Everest Teknologi Nusantara
                    </p>
                  </>
                ),
              }}
            />
            {/* <MyDetailView
                header="Perubahan"
                // datas={customerDetail?.data?.changes}
                func={{
                  'terakhir diubah': (value) => (
                    <>
                      <p className="text-sm-semibold text-right text-gray/900">
                        {value && value.name ? value.name : '-'}
                      </p>
                      <p className="text-sm-regular text-right text-gray/600">
                        {value && value.role ? value.role : '-'}
                      </p>
                      <p className="text-sm-regular text-gray/600">
                        {value && value.date
                          ? moment(value.date).format('DD MMM YYYY • HH:mm')
                          : '-'}
                      </p>
                    </>
                  ),
                  dibuat: (value) => (
                    <>
                      <p className="text-sm-semibold text-right text-gray/900">
                        {value && value.name ? value.name : '-'}
                      </p>
                      <p className="text-sm-regular text-right text-gray/600">
                        {value && value.role ? value.role : '-'}
                      </p>
                      <p className="text-sm-regular text-gray/600">
                        {value && value.date
                          ? moment(value.date).format('DD MMM YYYY • HH:mm')
                          : '-'}
                      </p>
                    </>
                  ),
                }}
              /> */}
          </div>
        </div>
      </SimpleBar>
    </>
  )
}

export default Information
