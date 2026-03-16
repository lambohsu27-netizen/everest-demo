import { MyButton, MyTextField, MyBgPatternDecorativeCube, MyLogo } from '@interstellar-component'
import { ArrowLeft } from '@untitled-ui/icons-react'

function StepVerification({ control, trigger, watch, isSubmitting, onBack }) {
  const email = watch?.()?.email || 'olivia@everest.com'

  return (
    <section className="w-full  h-full flex items-start justify-center pt-24">
      <div className="items-center justify-center gap-6 w-full max-w-[360px] rounded-xl column z-50">
        <div className="z-0">
          <MyBgPatternDecorativeCube />
        </div>
        <div className="z-40 flex flex-col gap-6 items-center">
          <MyLogo />
        </div>

        <div className="z-40 flex flex-col gap-6 items-center">
          <div className="gap-y-2 column items-center text-center">
            <p className="display-sm-semibold text-gray-900">Check your email</p>
            <p className="text-md-regular text-gray-600">
              We sent a verification link to <strong>{email}</strong>
            </p>
          </div>
        </div>

        <div className="z-40 relative w-full space-y-8">
          <MyButton
            type="submit"
            color="primary"
            variant="filled"
            size="lg"
            expanded
            disabled={isSubmitting}
          >
            <p className="text-md-semibold">Enter code manually</p>
          </MyButton>

          <div className="w-full items-center justify-center flex">
            <MyButton
              variant="link"
              color="primary"
              onClick={onBack}
              disabled={isSubmitting}
              className="w-fit p-0 h-fit !text-primary-700"
            >
              <div className="flex items-center gap-2">
                <ArrowLeft size={20} />
                <p className="text-sm-semibold">Back to log in</p>
              </div>
            </MyButton>
          </div>
        </div>
      </div>
    </section>
  )
}

export default StepVerification
