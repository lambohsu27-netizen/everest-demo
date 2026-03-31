import { MyAvatar, MyButton, MyChip, MyDetailView, MyTextField } from '@interstellar-component'
import SimpleBar from 'simplebar-react'
import moment from 'moment'
import { useRef, useState } from 'react'
import { pick } from 'lodash'
import { Save01 } from '@untitled-ui/icons-react'

const Result = ({ data }) => {
  return (
    <>
      <SimpleBar forceVisible="y" style={{ height: '100%' }}>
        <div className="flex flex-1 flex-col gap-8 pb-8 pt-4">
          <div className="flex flex-1 flex-col gap-y-6 px-4">
            <div className="rounded-xl bg-gray-50 shadow-sm outline outline-1 outline-gray-200">
              <label className="text-sm-semibold block px-5 pb-2 pt-3 text-gray-900">
                General Information
              </label>
              <div className="flex flex-col gap-y-4 rounded-xl bg-white px-5 py-5 outline outline-1 outline-gray-200">
                <div className="flex flex-col gap-2">
                  <label className="text-sm-medium text-gray/700 after:ml-0.5 after:text-brand/600 ">
                    API credential
                  </label>
                  <MyTextField
                    name="code"
                    placeholder="e.g. 3h3nnrf8inni871bb31884h12"
                    // cypress="customer-code-form"
                    // control={control}
                    // disabled={isArchived}
                    // errors={errors?.code?.message || err?.includes('code')}
                    // error={err?.includes('code') ? err : null}
                    // onChangeForm={() => {
                    //   if (err?.includes('code')) {
                    //     setErr(null)
                    //   }
                    // }}
                  />
                  <p className="mt-0.5 mb-2 text-sm-regular text-gray-600">
                    Used to authenticate and authorize API requests from system.
                  </p>
                  <hr />
                  <div className="mt-3 flex items-center justify-between">
                    <p className="text-sm-semibold">Resend email</p>
                    <div className="flex items-center gap-3">
                      <MyButton color="secondary" variant="outlined" size="sm">
                        <p className="text-sm-semibold">Reset</p>
                      </MyButton>

                      <MyButton color="primary" variant="outlined" size="sm">
                        <Save01 className="size-5" stroke="currentColor" />
                        <p className="text-sm-semibold">Validate</p>
                      </MyButton>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-0.5 rounded-xl bg-gray/25 shadow-sm outline outline-1 outline-gray-200">
              <label className="text-sm-semibold block px-4 pb-2 pt-3 text-gray-900">
                Activity
              </label>
              <div className="flex flex-col gap-4 rounded-xl bg-white px-4 py-5 outline outline-1 outline-gray-200">
                <div className="flex flex-col mb-5 relative">
                  <div className="flex items-center gap-4 relative">
                    {/* Vertical Line - Only Show if NOT Last Item */}
                    <div className="absolute left-[23px] top-10 bottom-0 w-[2px] bg-gray-300 h-full"></div>
                    {/* User Info and Message */}
                    <div className="flex flex-col gap-2">
                      <div className="flex flex-col">
                        <div className="flex flex-row gap-2">
                          {/* Avatar */}
                          <div className="relative rounded-full bg-white p-1 flex items-center justify-center">
                            <MyAvatar photo={null} size={50} />
                          </div>
                          <div className="flex flex-col">
                            <div className="flex flex-row gap-2">
                              <p className="text-sm-medium text-gray/700">Phoenix Baker</p>
                              <p className="text-sm-regular text-gray/600">3:10pm 20 Jan 2025</p>
                            </div>
                            <p className="text-sm-regular text-gray/600">
                              Membership application is rejected Click here to re submit
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Message */}
                      <div className="flex flex-col gap-3 ml-14">
                        <div className="mt-1 p-2 border rounded-tr-xl rounded-b-xl shadow-sm border-gray/200 text-sm-regular text-gray/700">
                          Nama yang menandatangani surat kuasa tidak sesuai dengan akta perubahan
                          anggaran dasar
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SimpleBar>
    </>
  )
}

export default Result
