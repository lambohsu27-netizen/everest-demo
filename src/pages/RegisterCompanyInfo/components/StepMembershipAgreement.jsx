import { MyButton, MyBgPatternDecorativeCube, MyLogo, MyCheckbox } from '@interstellar-component'
import { ChevronLeft } from '@untitled-ui/icons-react'

function StepMembershipAgreement({ isSubmitting, onBack, accepted, setAccepted }) {
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
            <p className="display-sm-semibold text-gray-900">Membership Agreement</p>
            <p className="text-md-regular text-gray-600">
              Review and agree to the terms and conditions required to activate your company membership
            </p>
          </div>
        </div>

        <div className="z-40 relative flex w-full flex-col gap-y-6 mt-4">
          <div className="max-h-[300px] overflow-y-auto p-4 bg-gray-50 rounded-lg border border-gray-200 text-sm-regular text-gray-700">
            <h4 className="text-md-semibold mb-2">Terms and Conditions</h4>
            <p className="mb-4">
              By becoming a member of Everest platform, you agree to comply with all our rules and regulations regarding corporate account usage.
            </p>
            <p className="mb-4">
              Your company data will be stored securely and used in accordance with our Privacy Policy. We may perform verification checks on the information provided.
            </p>
            <p>
              Please ensure all details provided are accurate and the representative is authorized by the company to act on its behalf.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex items-start gap-3">
              <MyCheckbox
                checked={accepted.terms}
                onChange={(e) => setAccepted({ ...accepted, terms: e.target.checked })}
              />
              <p className="text-sm-regular text-gray-600">
                I have read and agree to the <span className="text-brand/700 font-semibold cursor-pointer">Terms and Conditions</span>
              </p>
            </div>
            <div className="flex items-start gap-3">
              <MyCheckbox
                checked={accepted.privacy}
                onChange={(e) => setAccepted({ ...accepted, privacy: e.target.checked })}
              />
              <p className="text-sm-regular text-gray-600">
                I have read and agree to the <span className="text-brand/700 font-semibold cursor-pointer">Privacy Policy</span>
              </p>
            </div>
          </div>

          <div className="z-40 relative w-full flex flex-col space-y-4 mt-2">
            <MyButton
              type="submit"
              color="primary"
              variant="filled"
              size="lg"
              expanded
              disabled={isSubmitting || !accepted.terms || !accepted.privacy}
            >
              <p className="text-md-semibold">Accept & Activate Membership</p>
            </MyButton>

            <button
              type="button"
              onClick={onBack}
              className="flex items-center justify-center gap-2 text-sm-semibold text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ChevronLeft size={20} />
              Back to representative info
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default StepMembershipAgreement
