import { MyButton, MyTextField, MyBgPatternDecorativeCube, MyLogo } from '@interstellar-component'
import { ChevronLeft } from '@untitled-ui/icons-react'

function StepRepresentativeInfo({ control, errors, trigger, watch, isSubmitting, onBack }) {
  const { rep_name, rep_position, rep_email, rep_phone } = watch()

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
            <p className="display-sm-semibold text-gray-900">Authorized Representative Information</p>
            <p className="text-md-regular text-gray-600">
              Provide details of the individual authorized to represent the company
            </p>
          </div>
        </div>

        <div className="z-40 relative flex w-full flex-col gap-y-5 mt-2">
          <div className="gap-1 column">
            <p className="text-sm-medium text-gray-700">Full Name</p>
            <MyTextField
              name="rep_name"
              trigger={trigger}
              placeholder="Enter representative full name"
              control={control}
              value={rep_name}
              errors={errors?.rep_name?.message}
              focusColor="#01172D"
              focusShadow="#E6EBF0"
            />
          </div>

          <div className="gap-1 column">
            <p className="text-sm-medium text-gray-700">Position / Title</p>
            <MyTextField
              name="rep_position"
              trigger={trigger}
              placeholder="e.g. Director, CEO"
              control={control}
              value={rep_position}
              errors={errors?.rep_position?.message}
              focusColor="#01172D"
              focusShadow="#E6EBF0"
            />
          </div>

          <div className="gap-1 column">
            <p className="text-sm-medium text-gray-700">Corporate Email Address</p>
            <MyTextField
              name="rep_email"
              trigger={trigger}
              placeholder="Enter corporate email"
              control={control}
              value={rep_email}
              errors={errors?.rep_email?.message}
              focusColor="#01172D"
              focusShadow="#E6EBF0"
            />
          </div>

          <div className="gap-1 column">
            <p className="text-sm-medium text-gray-700">Phone Number</p>
            <MyTextField
              name="rep_phone"
              trigger={trigger}
              placeholder="+65 1234 5678"
              control={control}
              value={rep_phone}
              errors={errors?.rep_phone?.message}
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
              Back to legal info
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default StepRepresentativeInfo
