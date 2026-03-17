import { MyLogo, MyStep, MyStepper } from '@interstellar-component'
import { Mail01 } from '@untitled-ui/icons-react'
import { useState } from 'react'

import { useRegister } from './Context'
import AlertModal from './modal'
import RegisterForm from './RegisterForm'

function Register() {
  const { currentModal, handleCurrentModal } = useRegister()
  const [activeStep, setActiveStep] = useState(4)

  return (
    <>
      <AlertModal
        open={currentModal?.current === 'alert-modal'}
        handleCurrentModal={handleCurrentModal}
        currentModal={currentModal}
      />
      <main className="flex h-screen overflow-hidden z-50">
        <div className="w-[440px] bg-brand/800 max-md:hidden h-screen flex flex-col justify-between shrink-0">
          <div className="p-8 flex flex-col gap-20">
            <MyLogo showText darkMode />
            <div className="flex flex-col gap-8 pr-8">
              <MyStepper activeStep={activeStep}>
                <MyStep value={1}>
                  <div className="flex flex-col">
                    <p className="text-md-semibold text-white">Create admin account</p>
                    <p className="text-sm-regular text-white">
                      Enter your details to create the administrator account.
                    </p>
                  </div>
                </MyStep>
                <MyStep value={2}>
                  <div className="flex flex-col">
                    <p className="text-md-semibold text-white">Review terms & conditions</p>
                    <p className="text-sm-regular text-white">
                      Read and agree to the terms required to use the platform.
                    </p>
                  </div>
                </MyStep>
                <MyStep value={3}>
                  <div className="flex flex-col">
                    <p className="text-md-semibold text-white">Verify your account</p>
                    <p className="text-sm-regular text-[#e9d7fe]">
                      Enter the OTP sent to your email to confirm your account.
                    </p>
                  </div>
                </MyStep>
              </MyStepper>
            </div>
          </div>
          <div className="p-8 flex justify-between items-end h-[96px]">
            <p className="text-sm-regular text-[#e9d7fe]">© Everest 2026</p>
            <div className="flex items-center gap-2 text-[#e9d7fe]">
              <Mail01 size={17} />
              <p className="text-sm-regular">help@everest.com</p>
            </div>
          </div>
        </div>
        <RegisterForm activeStep={activeStep} setActiveStep={setActiveStep} />
      </main>
    </>
  )
}

export default Register
