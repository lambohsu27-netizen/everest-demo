import { MyButton, MyTextField, MyDropzone } from '@interstellar-component'
import { ArrowLeft } from '@untitled-ui/icons-react'

function StepLegalBusinessInfo({
  control,
  errors,
  trigger,
  watch,
  setValue,
  isSubmitting,
  onBack,
}) {
  const { npwp, nib, date_of_establishment } = watch()

  return (
    <div className="flex flex-col w-full max-w-[1000px] mx-auto py-8 pb-12 gap-8">
      {/* Header section */}
      <div className="flex flex-col gap-6 w-full border-b border-gray-200 pb-6">
        <div className="px-8 w-full flex flex-col gap-5">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-1.5 text-brand/700 hover:text-brand/800 font-semibold text-sm w-fit transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-brand/700" /> Back to company menu
          </button>
          <div className="flex flex-col gap-1 w-full">
            <h1 className="display-xs-semibold text-gray-900">Legal & Business Information</h1>
            <p className="text-md-regular text-gray-600">
              Provide legal and registration details required to verify your company.
            </p>
          </div>
        </div>
      </div>

      {/* Section */}
      <div className="flex flex-col gap-8 w-full">
        <div className="px-8 w-full flex flex-col gap-6">
          {/* Form Area 1: Company Registration Details */}
          <div className="flex flex-col xl:flex-row gap-8 w-full">
            {/* Section label */}
            <div className="w-full xl:w-[280px] shrink-0 flex flex-col">
              <h2 className="text-sm-semibold text-gray-900">Company Registration Details</h2>
              <p className="text-sm-regular text-gray-600">
                Official registration information of your company.
              </p>
            </div>

            {/* Form panel */}
            <div className="flex-1 max-w-[624px] rounded-xl border border-gray-200 shadow-[0_1px_2px_rgba(10,13,18,0.05)] bg-white flex flex-col">
              <div className="p-6 flex flex-col gap-5">
                <section className="w-full flex flex-col md:flex-row justify-between gap-6">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm-medium text-gray-700 after:text-brand/600 after:content-['*']">
                      Company NPWP
                    </label>
                    <MyTextField
                      name="npwp"
                      trigger={trigger}
                      placeholder="e.g. 1234 5678 9012 3456"
                      control={control}
                      value={npwp}
                      errors={errors?.npwp?.message}
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm-medium text-gray-700 after:text-brand/600 after:content-['*']">
                      NIB / Business Registration Number
                    </label>
                    <MyTextField
                      name="nib"
                      trigger={trigger}
                      placeholder="e.g. 1901 2200 0928 2"
                      control={control}
                      value={nib}
                      errors={errors?.nib?.message}
                    />
                  </div>
                </section>

                <div className="flex flex-col gap-1.5 max-w-[312px]">
                  <label className="text-sm-medium text-gray-700 after:text-brand/600 after:content-['*']">
                    Date of Establishment
                  </label>
                  <MyTextField
                    type="date"
                    name="date_of_establishment"
                    trigger={trigger}
                    placeholder="Select date"
                    control={control}
                    value={date_of_establishment}
                    errors={errors?.date_of_establishment?.message}
                  />
                </div>
              </div>
            </div>
          </div>

          <hr className="w-full border-gray-200" />

          {/* Form Area 2: Supporting Legal Documents */}
          <div className="flex flex-col xl:flex-row gap-8 w-full">
            {/* Section label */}
            <div className="w-full xl:w-[280px] shrink-0 flex flex-col">
              <h2 className="text-sm-semibold text-gray-900">Supporting Legal Documents</h2>
              <p className="text-sm-regular text-gray-600">
                Upload documents to support the verification of your company’s legal status.
              </p>
            </div>

            {/* Form panel */}
            <div className="flex-1 max-w-[624px] rounded-xl border border-gray-200 shadow-[0_1px_2px_rgba(10,13,18,0.05)] bg-white flex flex-col">
              <div className="p-6 flex flex-col gap-5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm-medium text-gray-700 after:text-brand/600 after:content-['*']">
                    NPWP
                  </label>
                  <MyDropzone
                    colorBg="bg-white"
                    multiple={false}
                    accept={['.png', '.jpg', '.jpeg', '.svg', '.gif']}
                    maxSize={5242880} // 5MB
                    onChange={(files) => {
                      setValue('npwp_document', files && files.length > 0 ? files[0] : null, {
                        shouldDirty: true,
                      })
                    }}
                    errors={errors?.npwp_document?.message}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm-medium text-gray-700">NIB</label>
                  <MyDropzone
                    colorBg="bg-white"
                    multiple={false}
                    accept={['.png', '.jpg', '.jpeg', '.svg', '.gif']}
                    maxSize={5242880} // 5MB
                    onChange={(files) => {
                      setValue('nib_document', files && files.length > 0 ? files[0] : null, {
                        shouldDirty: true,
                      })
                    }}
                    errors={errors?.nib_document?.message}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm-medium text-gray-700">Akta Pendirian</label>
                  <MyDropzone
                    colorBg="bg-white"
                    multiple={false}
                    accept={['.png', '.jpg', '.jpeg', '.svg', '.gif']}
                    maxSize={5242880} // 5MB
                    onChange={(files) => {
                      setValue(
                        'akta_pendirian_document',
                        files && files.length > 0 ? files[0] : null,
                        {
                          shouldDirty: true,
                        }
                      )
                    }}
                    errors={errors?.akta_pendirian_document?.message}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm-medium text-gray-700">Akta Perubahan Terbaru</label>
                  <MyDropzone
                    colorBg="bg-white"
                    multiple={false}
                    accept={['.png', '.jpg', '.jpeg', '.svg', '.gif']}
                    maxSize={5242880} // 5MB
                    onChange={(files) => {
                      setValue(
                        'akta_perubahan_terbaru_document',
                        files && files.length > 0 ? files[0] : null,
                        {
                          shouldDirty: true,
                        }
                      )
                    }}
                    errors={errors?.akta_perubahan_terbaru_document?.message}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="px-8 w-full">
          <hr className="w-full border-gray-200 mb-5" />
          <div className="flex justify-end w-full gap-3">
            <MyButton
              variant="outlined"
              color="secondary"
              type="button"
              size="md"
              disabled={isSubmitting}
            >
              <span className="text-sm-semibold">Cancel & save draft</span>
            </MyButton>
            <MyButton
              size="md"
              variant="filled"
              color="primary"
              type="submit"
              disabled={isSubmitting}
            >
              <span className="text-sm-semibold text-white">Next</span>
            </MyButton>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StepLegalBusinessInfo
