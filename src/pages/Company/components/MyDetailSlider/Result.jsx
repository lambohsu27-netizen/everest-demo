import { MyAvatar, MyButton, MyTextField } from '@interstellar-component'
import SimpleBar from 'simplebar-react'
import { Save01 } from '@untitled-ui/icons-react'

export default function Result({ loading }) {
  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center px-4 py-12 text-sm text-gray-light/600">
        Loading…
      </div>
    )
  }

  return (
    <SimpleBar forceVisible="y" style={{ height: '100%' }}>
      <div className="flex flex-1 flex-col gap-8 pb-8 pt-4">
        <div className="flex flex-1 flex-col gap-y-6 px-4">
          <div className="rounded-xl bg-gray-50 shadow-sm outline outline-1 outline-gray-200">
            <label className="text-sm-semibold block px-5 pb-2 pt-3 text-gray-900" htmlFor="company-api-credential">
              General Information
            </label>
            <div className="flex flex-col gap-y-4 rounded-xl bg-white px-5 py-5 outline outline-1 outline-gray-200">
              <div className="flex flex-col gap-2">
                <label
                  className="text-sm-medium text-gray/700 after:ml-0.5 after:text-brand/900 "
                  htmlFor="company-api-credential"
                >
                  API credential
                </label>
                <MyTextField
                  id="company-api-credential"
                  name="code"
                  placeholder="e.g. 3h3nnrf8inni871bb31884h12"
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
            <label className="text-sm-semibold block px-4 pb-2 pt-3 text-gray-900">Activity</label>
            <div className="flex flex-col gap-4 rounded-xl bg-white px-4 py-5 outline outline-1 outline-gray-200">
              <div className="relative mb-5 flex flex-col">
                <div className="relative flex items-center gap-4">
                  <div className="absolute bottom-0 left-[23px] top-10 h-full w-[2px] bg-gray-300" />
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-col">
                      <div className="flex flex-row gap-2">
                        <div className="relative flex items-center justify-center rounded-full bg-white p-1">
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

                    <div className="ml-14 flex flex-col gap-3">
                      <div className="mt-1 rounded-tr-xl rounded-b-xl border border-gray/200 p-2 text-sm-regular text-gray/700 shadow-sm">
                        Nama yang menandatangani surat kuasa tidak sesuai dengan akta perubahan anggaran
                        dasar
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
  )
}
