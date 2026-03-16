import { MyButton, MyTextField } from '@interstellar-component'

function StepVerification({ control, trigger, isSubmitting, onBack }) {
  return (
    <section className="w-full h-full flex items-center justify-center ">
      <div className="z-40 flex flex-col gap-6 items-center">
        <div className="gap-y-2 column items-center text-center">
          <p className="display-sm-semibold text-gray-900">Verify your account</p>
          <p className="text-md-regular text-gray-600">
            Enter the OTP sent to your email to confirm your account.
          </p>
        </div>
      </div>

      <div className="z-40 relative flex w-full flex-col gap-y-5 mt-2">
        <div className="gap-1 column">
          <p className="text-sm-medium text-gray-700">OTP</p>
          <MyTextField
            name="otp"
            trigger={trigger}
            placeholder="Enter 6-digit OTP"
            control={control}
            focusColor="#01172D"
            focusShadow="#E6EBF0"
          />
        </div>
      </div>

      <div className="z-40 relative w-full space-y-4 mt-6">
        <MyButton
          type="submit"
          color="primary"
          variant="filled"
          size="lg"
          expanded
          disabled={isSubmitting}
        >
          <p className="text-md-semibold">Verify</p>
        </MyButton>

        <MyButton
          type="button"
          color="secondary"
          variant="outlined"
          size="lg"
          expanded
          disabled={isSubmitting}
          onClick={onBack}
        >
          <p className="text-md-semibold">Back</p>
        </MyButton>
      </div>
    </section>
  )
}

export default StepVerification
