import {
  MyButton,
  MyTextField,
  MyBgPatternDecorativeCube,
  MyFeaturedIcon,
} from '@interstellar-component'

import { ArrowLeft } from '@untitled-ui/icons-react'

function StepVerification({
  control,
  trigger,
  watch,
  isSubmitting,
  onBack,
  otpMode,
  setOtpMode,
  otp,
  setOtp,
  handleOtpChange,
  handleOtpBackspaceAndEnter,
  otpBoxReference,
  minutes,
  seconds,
  setCountdown,
}) {
  const email = watch?.()?.email || 'olivia@everest.com'

  return (
    <section className="w-full  h-full flex items-start justify-center pt-24">
      <div className="items-center justify-center gap-6 w-full max-w-[360px] rounded-xl column z-50">
        <div className="z-0">
          <MyBgPatternDecorativeCube />
        </div>
        <div className="z-40 flex flex-col gap-6 items-center">
          <MyFeaturedIcon icon="Mail01" color="Gray" size="xl" />
        </div>

        <div className="z-40 flex flex-col gap-6 items-center">
          <div className="gap-y-2 column items-center text-center">
            <p className="display-sm-semibold text-gray-900">Check your email</p>
            <p className="text-md-regular text-gray-600">
              We sent a verification link to <strong>{email}</strong>
            </p>
          </div>
        </div>

        {/* {otpMode && ( */}
          <div className="z-40 flex flex-col gap-y-1.5 w-full items-center justify-center">
            <div className="flex w-auto items-center justify-center gap-3">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  value={digit}
                  maxLength={1}
                  onChange={(e) => handleOtpChange(e.target.value, index)}
                  onKeyUp={(e) => handleOtpBackspaceAndEnter(e, index)}
                  ref={(reference) => {
                    if (otpBoxReference) {
                      // eslint-disable-next-line no-param-reassign
                      otpBoxReference.current[index] = reference
                    }
                  }}
                  className={`border ${
                    digit ? 'border-brand/500 border-2' : ''
                  } display-lg-medium z-0 block h-auto w-20 appearance-none rounded-xl px-2 py-2.5 text-center text-brand/900 focus:border-brand/500 focus:border-2 focus:outline-none focus:shadow-focus-rings/ring-brand-mega`}
                />
              ))}
            </div>
          </div>
        {/* )} */}

        <div className="z-40 relative w-full space-y-8">
          {/* {otpMode ? ( */}
            <MyButton
              type="submit"
              color="primary"
              variant="filled"x
              size="lg"
              expanded
              disabled={isSubmitting}
              onClick={() => setOtpMode(true)}
            >
              <p className="text-md-semibold">Verify email</p>
            </MyButton>
          {/* ) : (
            <MyButton
              type="button"
              color="primary"
              variant="filled"
              size="lg"
              expanded
              // disabled={isSubmitting}
              onClick={() => setOtpMode(true)}
            >
              <p className="text-md-semibold">Enter code manually</p>
            </MyButton>
          )} */}

          {otpMode && (
            <div className="w-full items-center justify-center flex">
              <p className="text-sm-regular text-gray-600">
                Didn’t receive the email?
                <button
                  type="button"
                  disabled={minutes > 0 || seconds > 0}
                  onClick={() => {
                    setOtp(new Array(4).fill(''))
                    // This sets moment() to current time + 1 min or typical format expected (ISO string)
                    setCountdown(new Date(new Date().getTime() + 60000).toISOString())
                  }}
                  className="text-brand/900 font-semibold ml-1 disabled:opacity-65 disabled:cursor-not-allowed hover:underline"
                >
                  Click to resend
                </button>
                <span
                  className={`text-sm-semibold z-0 text-red-600 ml-2 ${
                    minutes === 0 && seconds === 0 ? 'inline-block' : 'inline-block'
                  }`}
                  style={{ visibility: minutes === 0 && seconds === 0 ? 'hidden' : 'visible' }}
                >
                  {`(${minutes}:${String(seconds).padStart(2, '0')})`}
                </span>
              </p>
            </div>
          )}

          <div className="w-full items-center justify-center flex">
            <MyButton
              variant="link"
              color="primary"
              onClick={onBack}
              disabled={isSubmitting}
              className="w-fit p-0 h-fit !text-primary-700"
            >
              <div className="flex items-center gap-2 text-gray-600">
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
