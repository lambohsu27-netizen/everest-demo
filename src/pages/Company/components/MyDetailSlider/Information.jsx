import { MyAvatar, MyCardFile, MyChip, MyDetailView } from '@interstellar-component'
import moment from 'moment'
import { useRef, useState } from 'react'
import { pick } from 'lodash'
import SimpleBar from 'simplebar-react'
const Information = () => {
  const data = {
    company_information: {
      'Company Legal Name': 'PT Everest Teknologi Nusantara',
      'Business / Brand Name': 'Everest',
      'Business Entity Type': 'PT',
      Industry: 'Technology',
      'Registration Number': '9120301234567',
      'Country of Incorporation': 'Indonesia',
      'Company Address': 'Jl. HR Rasuna Said No. 10, Jakarta',
      'Company Email': 'admin@everest.co.id',
    },

    authorized_representative: {
      'Full Name': 'Phoenix Baker',
      'Job Title': 'HR Manager',
      'Email Address': 'baker@everest.co.id',
      'Phone Number': '+62 882 1992 1992',
      'ID Type': 'KTP',
      'ID Number': '3175042603000008',
    },

    attachments: [
      {
        full_url:
          'https://kalachakra-dev.s3.ap-southeast-1.amazonaws.com/tron/uploads/files/po-library/attachments/dfb670bc-8ef4-43cb-b999-4df8f718f364.vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        id: 'e2f19c5a-9bf5-4b50-9a75-e80c5e9cdaad',
        filename: 'daily-ticket-report (5).xlsx',
        url: 'uploads/files/po-library/attachments/dfb670bc-8ef4-43cb-b999-4df8f718f364.vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        mime_type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        size: 12557,
        main_id: 'SMG0022557400102560',
        lat: null,
        lng: null,
        address: null,
        accuracy: null,
        meta_data: null,
        created_at: '2025-12-31T03:16:29.254Z',
        updated_at: '2025-12-31T03:16:29.255Z',
        deleted_at: null,
        created_by_id: 'dafb7cf9-7d7f-4a94-91a3-c404e66e94f4',
        updated_by_id: 'dafb7cf9-7d7f-4a94-91a3-c404e66e94f4',
      },
    ],
  }
  return (
    <>
      <SimpleBar forceVisible="y" style={{ height: '100%' }}>
        <div className="flex flex-1 flex-col gap-8 pb-8 pt-4">
          <div className="flex flex-col gap-6">
            <div className="flex flex-1 flex-col gap-y-6 px-4 text-gray-600">
              <MyDetailView
                header="Company Information"
                datas={data?.company_information}
                func={{
                  Industry: (value) => (
                    <MyChip
                      label={value}
                      rounded={'lg'}
                      color={'modern'}
                      variant={'outlined'}
                      size={'sm'}
                    />
                  ),
                }}
              />
            </div>

            <div className="flex flex-col gap-6">
              <div className="flex flex-1 flex-col gap-y-6 px-4 text-gray/600">
                <MyDetailView
                  header="Authorized Representative (PIC)"
                  datas={data?.authorized_representative}
                />
              </div>
            </div>

            <div className="mt-0.5 rounded-xl bg-gray/25 shadow-sm outline outline-1 outline-gray-200">
              <label className="text-sm-semibold block px-4 pb-2 pt-3 text-gray-900">
                Attachment
              </label>
              <div className="flex flex-col gap-4 rounded-xl bg-white px-4 py-5 outline outline-1 outline-gray-200">
                <div className="flex flex-col gap-1.5">
                  {data?.attachments?.map((value, index) => (
                    <MyCardFile
                      key={index}
                      onClickDownload={true}
                      // progressUpload={progressUpload}
                      // progress={progressList[i]}
                      // onDeleteFile={() => {
                      //   handleDeleteFile(value);
                      // }}

                      file={value}
                      // showImage={showImage}
                    ></MyCardFile>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </SimpleBar>
    </>
  )
}

export default Information
