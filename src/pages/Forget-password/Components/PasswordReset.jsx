import { ArrowLeft, CheckCircle } from '@untitled-ui/icons-react'
import { MyBgPatternDecorativeCube, MyButton } from '@interstellar-component'
import { useForgetPassword } from '../context'

function PasswordReset() {
  const { navigate } = useForgetPassword()
  return (
    <div className="mx-auto w-full md:mt-36 md:w-3/4">
      <div className="md:mx-0">
        {/* bg */}
        {/* Content */}
        <div>
          <div className="mb-6 flex flex-col items-center justify-center md:mb-8">
            <div className="mb-4 md:mb-5">
              <MyBgPatternDecorativeCube />
            </div>
            <div className="z-10 mb-4 rounded-xl border-2 p-3 md:mb-6">
              <CheckCircle />
            </div>
            <div className="z-10 w-full max-w-[360px] px-2 md:px-0">
              <p className="text-xl-semibold mb-3 text-center text-gray-light/900">
                Password reset
              </p>
              <p className="text-md-regular text-center text-gray-light/600">
                Your password has been successfully reset. Click below to log in
                magically.
              </p>
            </div>
          </div>

          <div className="z-10 flex flex-col items-center justify-center">
            <div className="z-10 w-full max-w-[360px]">
              <MyButton
                type="submit"
                color="primary"
                variant="filled"
                size="lg"
                expanded
                onClick={() => navigate('/login')}
              >
                <p className="text-md-semibold">Continue</p>
              </MyButton>
            </div>
            <div className="z-10 mt-6 flex items-center justify-center md:mt-8">
              <MyButton onClick={() => navigate('/login')}>
                <ArrowLeft size="15" />
                <p className="text-sm-semibold text-center text-gray-600">
                  Back to login
                </p>
              </MyButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PasswordReset
