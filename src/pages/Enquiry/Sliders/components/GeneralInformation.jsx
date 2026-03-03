import SimpleBar from 'simplebar-react'
import moment from 'moment'
import { MyAvatar, MyDetailView } from '@interstellar-component'
import { CheckCircle, XCircle } from '@untitled-ui/icons-react'

function GeneralInformation({ enquiryDetails }) {
  return (
    <SimpleBar forceVisible="y" style={{ height: '100%' }}>
      <div className="flex flex-1 flex-col gap-8 pb-8 pt-4">
        <div className="flex flex-col gap-6">
          <div className="flex-col px-4">
            <p className="text-sm-semibold text-gray-light-700">General Information</p>
          </div>
          <div className="flex flex-1 flex-col">
            {/* <div className="flex items-center justify-between border-t p-4">
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
                <MyAvatar photo={enquiryDetails?.data?.general_information?.created_by_photo} />
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
                <MyAvatar photo={enquiryDetails?.data?.general_information?.updated_by_photo} />
              </div>
            </div> */}
            <MyDetailView
              datas={(() => {
                const raw = enquiryDetails?.data?.general_information
                if (!raw) return {}
                return Object.fromEntries(
                  Object.entries(raw).map(([k, v]) => [
                    k,
                    v &&
                    typeof v === 'object' &&
                    v !== null &&
                    !Array.isArray(v) &&
                    'name' in v
                      ? v.name
                      : v,
                  ])
                )
              })()}
              func={{
                'Approval of Request': (value) =>
                  value ? (
                    <CheckCircle className="text-success/600 size-5" />
                  ) : (
                    <XCircle className="text-error/600 size-5" />
                  ),
                //   'Last modified date': (value) => moment(value).format('DD MMM YYYY • HH:mm'),
                //   'Created date': (value) => moment(value).format('DD MMM YYYY • HH:mm'),
              }}
            />
          </div>
        </div>
      </div>
    </SimpleBar>
  )
}

export default GeneralInformation
