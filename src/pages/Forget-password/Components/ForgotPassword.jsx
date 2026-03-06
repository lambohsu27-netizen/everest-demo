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
    <div className="container mx-auto mt-36 w-full md:w-3/4">
      <div className="mx-4 md:mx-0">
        {/* bg */}
        {/* Content */}
        <div className="mb-8 flex flex-col items-center justify-center">
          <div className="mb-5">
            <MyBgPatternDecorativeCube />
          </div>
          <div className="z-0 mb-6 rounded-xl border-2 p-3">
            <Key01 />
          </div>
          <div className="z-0">
            <p className="text-xl-semibold mb-3 text-center text-gray-light/900">
              Forgot Password?
            </p>
            <p className="text-md-regular text-center text-gray-light/600">
              No worries, we’ll send you reset instructions.
            </p>
          </div>
        </div>

        <div className="z-10 flex flex-col items-center justify-center">
          <form className="z-10 w-[360px]" onSubmit={onSubmit}>
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

          <div className="z-10 mt-8 flex items-center justify-center">
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
