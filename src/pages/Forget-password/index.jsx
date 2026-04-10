import { CheckCircle, Key01, Mail02, Passcode, Stars02, UsersPlus } from '@untitled-ui/icons-react'
import LineProgress from './Assets/Connector.svg'
import ForgotPassword from './Components/ForgotPassword'
import CheckYourEmail from './Components/CheckYourEmail'
import SetNewPassword from './Components/SetNewPassword'
import PasswordReset from './Components/PasswordReset'
import { useForgetPassword } from './context'
import Logo from '../../assets/Login/bipura_logo.png'
import { MyLogo } from '@interstellar-component'

function ForgetPassword() {
  const { currentStep } = useForgetPassword()

  return (
    <main className="container flex min-h-screen flex-col md:flex-row">
      {/* LEFT - hidden on mobile, visible from md up */}
      <div className="hidden min-h-screen w-full flex-shrink-0 bg-[#F9FAFB] border-r border-gray-200 px-10 pt-10 md:block md:w-[400px] relative">
        <div className="mb-16 transform scale-90 origin-left">
          <MyLogo showText={true} />
        </div>

        {/* Stepper Content */}
        <div className="flex flex-col">
          {/* Step 1 */}
          <div className="flex items-stretch gap-x-4">
            <div className="flex flex-col items-center">
              <div
                className={`rounded-lg border-[1.5px] p-2 bg-white shadow-sm z-10 ${currentStep.step_1 ? 'border-brand/900 text-brand/700' : 'border-gray-200 text-gray-400 opacity-50'}`}
              >
                <Key01 size={20} strokeWidth={2.5} />
              </div>
              <div className="w-[1.5px] flex-1 bg-gray-200 my-0"></div>
            </div>
            <div className="pb-10 pt-0.5">
              {' '}
              <p
                className={`text-sm font-semibold mb-0.5 ${currentStep.step_1 ? 'text-gray-900' : 'text-gray-500'}`}
              >
                Your details
              </p>
              <p className="text-sm text-gray-500 leading-tight">
                Please provide your name and email
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex items-stretch gap-x-4">
            <div className="flex flex-col items-center">
              <div
                className={`rounded-lg border-[1.5px] p-2 bg-white shadow-sm z-10 ${currentStep.step_2 ? 'border-brand/900 text-brand/700' : 'border-gray-200 text-gray-400 opacity-50'}`}
              >
                <Passcode size={20} strokeWidth={2.5} />
              </div>
              <div className="w-[1.5px] flex-1 bg-gray-200"></div>
            </div>
            <div className="pb-10 pt-0.5">
              <p
                className={`text-sm font-semibold mb-0.5 ${currentStep.step_2 ? 'text-gray-900' : 'text-gray-500'}`}
              >
                Choose a password
              </p>
              <p className="text-sm text-gray-500 leading-tight">Choose a secure password</p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex items-stretch gap-x-4">
            <div className="flex flex-col items-center">
              <div
                className={`rounded-lg border-[1.5px] p-2 bg-white shadow-sm z-10 ${currentStep.step_3 ? 'border-brand/900 text-brand/700' : 'border-gray-200 text-gray-400 opacity-50'}`}
              >
                <UsersPlus size={20} strokeWidth={2.5} />
              </div>
              <div className="w-[1.5px] flex-1 bg-gray-200"></div>
            </div>
            <div className="pb-10 pt-0.5">
              <p
                className={`text-sm font-semibold mb-0.5 ${currentStep.step_3 ? 'text-gray-900' : 'text-gray-500'}`}
              >
                Invite your team
              </p>
              <p className="text-sm text-gray-500 leading-tight">
                Start collaborating with your team
              </p>
            </div>
          </div>

          {/* Step 4 */}
          <div className="flex items-start gap-x-4">
            <div className="flex flex-col items-center">
              <div
                className={`rounded-lg border-[1.5px] p-2 bg-white shadow-sm z-10 ${currentStep.step_4 ? 'border-brand/900 text-brand/700' : 'border-gray-200 text-gray-400 opacity-50'}`}
              >
                <Stars02 size={20} strokeWidth={2.5} />
              </div>
            </div>
            <div className="pt-0.5">
              <p
                className={`text-sm font-semibold mb-0.5 ${currentStep.step_4 ? 'text-gray-900' : 'text-gray-500'}`}
              >
                Add your socials
              </p>
              <p className="text-sm text-gray-500 leading-tight">
                Share posts to your social accounts
              </p>
            </div>
          </div>
        </div>

        {/* Footer Sisi Kiri (Copyright & Support) */}
        <div className="absolute bottom-10 left-10 right-10 flex justify-between items-center text-xs text-gray-500">
          <p>© Everest 2026</p>
          <div className="flex items-center gap-x-1">
            <Mail02 size={14} />
            <span>help@everest.com</span>
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
