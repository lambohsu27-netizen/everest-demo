import { MyLogo, MyStep, MyStepper } from '@interstellar-component'
import { Mail01 } from '@untitled-ui/icons-react'
import { useState } from 'react'

import RegisterCompanyInfoForm from './RegisterCompanyInfoForm'

function RegisterCompanyInfo() {
  const [activeStep, setActiveStep] = useState(1)

  return (
    <main className="flex h-screen overflow-hidden z-50">
      {/* Sidebar */}
      <div className="w-[440px] bg-gradient-to-b from-[#53389E] to-[#6941C6] max-md:hidden h-screen flex flex-col justify-between shrink-0">
        <div className="p-8 flex flex-col gap-20">
          <MyLogo showText darkMode />
          <div className="flex flex-col gap-8 pr-8">
            <MyStepper activeStep={activeStep}>
              <MyStep value={1}>
                <div className="flex flex-col">
                  <p className="text-md-semibold text-white">Company Information</p>
                  <p className="text-sm-regular text-white/70">
                    Provide basic information about your company to set up your account
                  </p>
                </div>
              </MyStep>
              <MyStep value={2}>
                <div className="flex flex-col">
                  <p className="text-md-semibold text-white">Legal & Business Information</p>
                  <p className="text-sm-regular text-white/70">
                    Provide legal and registration details required to verify your company
                  </p>
                </div>
              </MyStep>
              <MyStep value={3}>
                <div className="flex flex-col">
                  <p className="text-md-semibold text-white">
                    Authorized Representative Information
                  </p>
                  <p className="text-sm-regular text-white/70">
                    Provide details of the individual authorized to represent the company
                  </p>
                </div>
              </MyStep>
              <MyStep value={4}>
                <div className="flex flex-col">
                  <p className="text-md-semibold text-white">Membership Agreement</p>
                  <p className="text-sm-regular text-white/70">
                    Review and agree to the terms and conditions to activate membership
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

      {/* Main Content */}
      <div className="flex-1 bg-white overflow-hidden">
        <RegisterCompanyInfoForm activeStep={activeStep} setActiveStep={setActiveStep} />
      </div>
    </main>
  )
}

export default RegisterCompanyInfo
