import { MyButton, MyTextField, MyDropzone } from '@interstellar-component'
import { ArrowLeft, Mail01, Phone } from '@untitled-ui/icons-react'

function StepRepresentativeInfo({
  control,
  errors,
  trigger,
  watch,
  setValue,
  isSubmitting,
  onBack,
}) {
  const { rep_name, rep_position, rep_email, rep_phone } = watch()

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
            <h1 className="display-xs-semibold text-gray-900">
              Authorized Representative Information
            </h1>
            <p className="text-md-regular text-gray-600">
              Provide details of the individual authorized to represent the company for this
              application.
            </p>
          </div>
        </div>
      </div>

      {/* Section */}
      <div className="flex flex-col gap-8 w-full">
        <div className="px-8 w-full flex flex-col gap-6">
          <div className="flex flex-col xl:flex-row gap-8 w-full">
            {/* Section label */}
            <div className="w-full xl:w-[280px] shrink-0 flex flex-col">
              <h2 className="text-sm-semibold text-gray-900">Authorized Representative</h2>
              <p className="text-sm-regular text-gray-600">
                Information about the person legally authorized to act on behalf of the company.
              </p>
            </div>

            {/* Form panel */}
            <div className="flex-1 max-w-[624px] rounded-xl border border-gray-200 shadow-[0_1px_2px_rgba(10,13,18,0.05)] bg-white flex flex-col">
              <div className="p-6 flex flex-col gap-6">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm-medium text-gray-700">Full name</label>
                  <MyTextField
                    name="rep_name"
                    trigger={trigger}
                    placeholder="e.g. Budi Hartono"
                    control={control}
                    value={rep_name}
                    errors={errors?.rep_name?.message}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm-medium text-gray-700">Job title</label>
                  <MyTextField
                    name="rep_position"
                    trigger={trigger}
                    placeholder="Input job title"
                    control={control}
                    value={rep_position}
                    errors={errors?.rep_position?.message}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm-medium text-gray-700 after:text-brand/600 after:content-['*']">
                    Email address
                  </label>
                  <MyTextField
                    name="rep_email"
                    trigger={trigger}
                    placeholder="phoenix.baker@gmail.com"
                    control={control}
                    value={rep_email}
                    errors={errors?.rep_email?.message}
                    startAdornment={<Mail01 className="w-5 h-5 text-gray-500" />}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm-medium text-gray-700 after:text-brand/600 after:content-['*']">
                    Phone number
                  </label>
                  <MyTextField
                    name="rep_phone"
                    trigger={trigger}
                    placeholder="62 882 1992 1992"
                    control={control}
                    value={rep_phone}
                    errors={errors?.rep_phone?.message}
                    startAdornment={<Phone className="w-5 h-5 text-gray-500" />}
                  />
                </div>

                <div className="flex flex-col gap-1.5 pt-4 border-t border-gray-200">
                  <div className="flex flex-col gap-1">
                    <label className="text-sm-medium text-gray-700 after:text-brand/600 after:content-['*']">
                      Surat kuasa
                    </label>
                  </div>
                  <div className="w-fit mb-1">
                    <MyButton variant="outlined" color="secondary" type="button" size="sm">
                      <span className="text-sm-semibold">Download Template</span>
                    </MyButton>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-col gap-1">
                      <p className="text-sm-regular text-gray-700">
                        Please download the template first, then upload the completed template file.
                      </p>
                      <p className="text-sm-regular text-gray-600">
                        Only files based on the provided template will be accepted.
                      </p>
                    </div>
                    <MyDropzone
                      colorBg="bg-white"
                      multiple={false}
                      accept={['.pdf', '.png', '.jpg', '.jpeg', '.docx']}
                      maxSize={5242880} // 5MB
                      onChange={(files) => {
                        setValue(
                          'surat_kuasa_document',
                          files && files.length > 0 ? files[0] : null,
                          {
                            shouldDirty: true,
                          }
                        )
                      }}
                      errors={errors?.surat_kuasa_document?.message}
                    />
                  </div>
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

export default StepRepresentativeInfo
