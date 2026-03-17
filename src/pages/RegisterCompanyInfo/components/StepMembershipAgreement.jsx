import { MyButton } from '@interstellar-component'
import { ArrowLeft, ChevronDown } from '@untitled-ui/icons-react'

function StepMembershipAgreement({ isSubmitting, onBack }) {
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
              Membership Agreement
            </h1>
            <p className="text-md-regular text-gray-600">
              Review and agree to the terms and conditions required to activate your company membership.
            </p>
          </div>
        </div>
      </div>

      {/* Section */}
      <div className="flex flex-col gap-8 w-full">
        <div className="px-8 w-full flex flex-col gap-6">
          <div className="flex flex-col xl:flex-row gap-8 w-full">
            {/* Section label */}
            <div className="w-full xl:w-[280px] shrink-0 flex flex-col gap-1">
              <h2 className="text-sm-semibold text-gray-900">Membership agreement</h2>
              <p className="text-sm-regular text-gray-600">
                General Terms & Conditions and Specific Terms & Conditions governing the use of CLIK services.
              </p>
            </div>

            {/* Content panel */}
            <div className="flex-1 max-w-[624px] flex flex-col gap-8 text-sm-regular text-gray-600">
              {/* Block 1 */}
              <div className="flex flex-col gap-3">
                <h3 className="text-sm-semibold text-gray-900 mb-1">About the Service Provider</h3>
                <p>
                  CLIK is a licensed credit information service provider that facilitates access to credit reports in accordance with applicable regulations.
                </p>
                <p>
                  By entering into this agreement, your company acknowledges and agrees to comply with all applicable laws, regulations, and usage limitations related to credit information services.
                </p>
              </div>

              {/* Block 2 */}
              <div className="flex flex-col gap-3">
                <h3 className="text-sm-semibold text-gray-900 mb-1">Target audience</h3>
                <p>
                  The services may only be used for legitimate business purposes, including but not limited to:
                </p>
                <ul className="list-disc pl-5 flex flex-col py-1 gap-1">
                  <li>Employee screening</li>
                  <li>Pre-employment background checks</li>
                  <li>Internal risk monitoring</li>
                </ul>
                <p>
                  The use of credit information for purposes outside those permitted by law is strictly prohibited.
                </p>
              </div>

              {/* Block 3 */}
              <div className="flex flex-col gap-3">
                <h3 className="text-sm-semibold text-gray-900 mb-1">Responsibilities and Obligations</h3>
                <p>
                  By signing this agreement, your company confirms that:
                </p>
                <ul className="list-disc pl-5 flex flex-col py-1 gap-1">
                  <li>All submitted information is accurate and up to date</li>
                  <li>Proper consent has been obtained from individuals prior to requesting credit reports</li>
                  <li>Credit information will be handled confidentially and securely</li>
                </ul>
                <p>
                  CLIK reserves the right to suspend or terminate access in the event of misuse or non-compliance.
                </p>
              </div>

              {/* View more */}
              <div className="flex items-center justify-center relative pt-4">
                <div className="absolute inset-0 flex items-center pt-4" aria-hidden="true">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-white px-2 text-sm-semibold text-gray-700 flex items-center gap-2 cursor-pointer">
                    <ChevronDown className="w-5 h-5 text-gray-500" /> View more
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="px-8 w-full mt-4">
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
              <span className="text-sm-semibold text-white">Sign Membership Agreement</span>
            </MyButton>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StepMembershipAgreement
