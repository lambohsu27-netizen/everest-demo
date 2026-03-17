import { MyButton, MyTextField, MyBgPatternDecorativeCube, MyLogo, MyAutocomplete, MyTextArea } from '@interstellar-component'
import { ChevronLeft } from '@untitled-ui/icons-react'

function StepLegalBusinessInfo({ control, errors, trigger, watch, isSubmitting, onBack }) {
  const { registration_number, business_type, registered_address, incorporation_date } = watch()

  return (
    <section className="w-full h-full flex items-center justify-center">
      <div className="items-center justify-center gap-6 w-full max-w-[480px] rounded-xl p-5 md:p-10 column z-50">
        <div className="z-0">
          <MyBgPatternDecorativeCube />
        </div>
        <div className="z-40 flex flex-col gap-6 items-center">
          <MyLogo />
        </div>

        <div className="z-40 flex flex-col gap-6 items-center">
          <div className="gap-y-2 column items-center text-center">
            <p className="display-sm-semibold text-gray-900">Legal & Business Information</p>
            <p className="text-md-regular text-gray-600">
              Provide legal and registration details required to verify your company
            </p>
          </div>
        </div>

        <div className="z-40 relative flex w-full flex-col gap-y-5 mt-2">
          <div className="gap-1 column">
            <p className="text-sm-medium text-gray-700">Registration Number (UEN)</p>
            <MyTextField
              name="registration_number"
              trigger={trigger}
              placeholder="Enter registration number"
              control={control}
              value={registration_number}
              errors={errors?.registration_number?.message}
              focusColor="#01172D"
              focusShadow="#E6EBF0"
            />
          </div>

          <div className="gap-1 column">
            <p className="text-sm-medium text-gray-700">Business Type</p>
            <MyAutocomplete
              name="business_type"
              options={[
                { label: 'Private Limited Company', value: 'private_limited' },
                { label: 'Sole Proprietorship', value: 'sole_proprietorship' },
                { label: 'Partnership', value: 'partnership' },
                { label: 'Limited Liability Partnership (LLP)', value: 'llp' },
              ]}
              trigger={trigger}
              placeholder="Select business type"
              control={control}
              value={business_type}
              errors={errors?.business_type?.message}
            />
          </div>

          <div className="gap-1 column">
            <p className="text-sm-medium text-gray-700">Registered Address</p>
            <MyTextArea
              name="registered_address"
              trigger={trigger}
              placeholder="Enter registered address"
              control={control}
              value={registered_address}
              errors={errors?.registered_address?.message}
              rows={3}
            />
          </div>

          <div className="gap-1 column">
            <p className="text-sm-medium text-gray-700">Date of Incorporation</p>
            <MyTextField
              name="incorporation_date"
              trigger={trigger}
              placeholder="YYYY-MM-DD"
              control={control}
              value={incorporation_date}
              errors={errors?.incorporation_date?.message}
              focusColor="#01172D"
              focusShadow="#E6EBF0"
            />
          </div>

          <div className="z-40 relative w-full flex flex-col space-y-4 mt-6">
            <MyButton
              type="submit"
              color="primary"
              variant="filled"
              size="lg"
              expanded
              disabled={isSubmitting}
            >
              <p className="text-md-semibold">Continue</p>
            </MyButton>

            <button
              type="button"
              onClick={onBack}
              className="flex items-center justify-center gap-2 text-sm-semibold text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ChevronLeft size={20} />
              Back to basic info
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default StepLegalBusinessInfo
