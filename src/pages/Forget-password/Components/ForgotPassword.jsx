import { ArrowLeft, Key01 } from '@untitled-ui/icons-react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import {
  MyBgPatternDecorativeCube,
  MyTextField,
  MyButton,
} from '@interstellar-component'
import { ForgetPasswordSchema } from '../schema'
import { handleError, checkErrorYup } from '../../../services/Helper'
import { useForgetPassword } from '../context'

function ForgotPassword() {
  const { sendEmail, navigate } = useForgetPassword()

  const {
    handleSubmit,
    control,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(ForgetPasswordSchema),
  })

  const onSubmit = handleSubmit(handleError(sendEmail, control), checkErrorYup)

  return (
    <div className="mx-auto w-full md:mt-36 md:w-3/4">
      <div className="md:mx-0">
        {/* bg */}
        {/* Content */}
        <div className="mb-6 flex flex-col items-center justify-center md:mb-8">
          <div className="mb-4 md:mb-5">
            <MyBgPatternDecorativeCube />
          </div>
          <div className="z-0 mb-4 rounded-xl border-2 p-3 md:mb-6">
            <Key01 />
          </div>
          <div className="z-0 px-2 md:px-0">
            <p className="text-xl-semibold mb-3 text-center text-gray-light/900">
              Forgot Password?
            </p>
            <p className="text-md-regular text-center text-gray-light/600">
              No worries, we’ll send you reset instructions.
            </p>
          </div>
        </div>

        <div className="z-10 flex flex-col items-center justify-center">
          <form className="z-10 w-full max-w-[360px]" onSubmit={onSubmit}>
            <section className="mb-6 flex flex-col gap-y-1.5">
              <label
                htmlFor="email"
                className="text-sm-medium text-gray-light/700"
              >
                Email
              </label>
              <MyTextField
                name="email"
                // type="email"
                trigger={trigger}
                placeholder="Enter your email"
                control={control}
                errors={errors?.email?.message}
              />
            </section>
            <div className="flex flex-col items-center justify-center">
              <div className="w-full">
                <MyButton
                  type="submit"
                  color="primary"
                  variant="filled"
                  size="lg"
                  expanded
                  disabled={isSubmitting}
                >
                  <p className="text-md-semibold">Reset password</p>
                </MyButton>
              </div>
            </div>
          </form>

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
  )
}

export default ForgotPassword
