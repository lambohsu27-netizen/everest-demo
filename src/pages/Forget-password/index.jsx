import { CheckCircle, Key01, Mail02, Passcode } from '@untitled-ui/icons-react'
import LineProgress from './Assets/Connector.svg'
import ForgotPassword from './Components/ForgotPassword'
import CheckYourEmail from './Components/CheckYourEmail'
import SetNewPassword from './Components/SetNewPassword'
import PasswordReset from './Components/PasswordReset'
import { useForgetPassword } from './context'
import Logo from '../../assets/Login/bipura_logo.png'

function ForgetPassword() {
  const { currentStep } = useForgetPassword()

  return (
    <main className="container flex min-h-screen flex-col md:flex-row">
      {/* LEFT - hidden on mobile, visible from md up */}
      <div className="hidden min-h-screen w-full flex-shrink-0 bg-gray-light/100 px-8 pt-12 md:block md:w-[440px]">
        {/* logo */}
        <div className="mb-10 h-10 w-32">
          <img src={Logo} alt="Logo" />
        </div>
        {/* Content */}
        <div className="md:gap-x-10">
          {/* details */}
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="flex flex-col items-center justify-center">
              <div
                className={`rounded-xl border-2 px-3 py-3 ${
                  currentStep.step_1 ? 'opacity-100' : 'opacity-50'
                }`}
              >
                <Key01 />
              </div>
              <div className="mx-6 my-1">
                <img src={LineProgress} alt="LineProgress" />
              </div>
            </div>
            <div className="max-sm:hidden">
              <p
                className={`text-sm-${currentStep.step_1 ? 'bold' : 'regular'} text-gray-light/700`}
              >
                Your details
              </p>
              <p className="text-sm-regular text-gray-light/600">please provide your email</p>
            </div>
          </div>
          {/* email */}
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="flex flex-col items-center justify-center">
              <div
                className={`rounded-xl border-2 px-3 py-3 ${
                  currentStep.step_2 ? 'opacity-100' : 'opacity-50'
                }`}
              >
                <Mail02 />
              </div>
              <div className="mx-6 my-1">
                <img src={LineProgress} alt="LineProgress" />
              </div>
            </div>
            <div className="max-sm:hidden">
              <p
                className={`text-sm-${currentStep.step_2 ? 'bold' : 'regular'} text-gray-light/700`}
              >
                Check your email
              </p>
              <p className="text-sm-regular text-gray-light/600">
                Find password reset link on email
              </p>
            </div>
          </div>
          {/* Set New Password */}
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="flex flex-col items-center justify-center">
              <div
                className={`rounded-xl border-2 px-3 py-3 ${
                  currentStep.step_3 ? 'opacity-100' : 'opacity-50'
                }`}
              >
                <Passcode />
              </div>
              <div className="mx-6 my-1">
                <img src={LineProgress} alt="LineProgress" />
              </div>
            </div>
            <div className="max-sm:hidden">
              <p
                className={`text-sm-${currentStep.step_3 ? 'bold' : 'regular'} text-gray-light/700`}
              >
                Set new password
              </p>
              <p className="text-sm-regular text-gray-light/600">Choose a secure password</p>
            </div>
          </div>
          {/* password reset */}
          <div className="flex gap-4">
            <div className="flex flex-col items-center justify-center">
              <div
                className={`rounded-xl border-2 px-3 py-3 ${
                  currentStep.step_4 ? 'opacity-100' : 'opacity-50'
                }`}
              >
                <CheckCircle />
              </div>
            </div>
            <div className="max-sm:hidden">
              <p
                className={`text-sm-${currentStep.step_4 ? 'bold' : 'regular'} text-gray-light/700`}
              >
                Password reset
              </p>
              <p className="text-sm-regular text-gray-light/600">Your password has been reset</p>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT - full width on mobile, flex-1 on desktop */}
      <div className="min-w-0 flex-1 px-4 py-8 md:py-0 md:px-0">
        {currentStep.step_1 && <ForgotPassword />}
        {currentStep.step_2 && <CheckYourEmail />}
        {currentStep.step_3 && <SetNewPassword />}
        {currentStep.step_4 && <PasswordReset />}
      </div>
    </main>
  )
}

export default ForgetPassword
