import {
  ArrowLeft,
  CheckCircle,
  Lock01,
  Eye,
  EyeOff,
} from '@untitled-ui/icons-react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useState } from 'react'
import {
  MyBgPatternDecorativeCube,
  MyTextField,
  MyButton,
} from '@interstellar-component'
import CheckIcon from '../Assets/Check-icon.svg'
import { setNewPasswordSchema } from '../schema'
import { useForgetPassword } from '../context'
import { handleError, checkErrorYup } from '../../../services/Helper'

function SetNewPassword() {
  const { updatePassword } = useForgetPassword()
  const { navigate } = useForgetPassword()
  const [show, setShow] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const {
    handleSubmit,
    control,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(setNewPasswordSchema),
    defaultValues: {
      password: '',
    },
  })
  const { password } = watch()

  const passwordChecks = {
    containUppercase: /[A-Z]/.test(password),
    containLowercase: /[a-z]/.test(password),
    containNumber: /\d/.test(password),
    containSpecialCharacter: /[@$!%*?&#\-+=~^|`_'";:/.,\\]/.test(password),
    minimumLength: password?.length >= 8,
  }

  const onSubmit = handleSubmit(
    handleError(updatePassword, control),
    checkErrorYup
  )

  return (
    <div className="mx-auto w-full md:mt-1 md:w-3/4">
      <div className="md:mx-0">
        {/* bg */}
        {/* Content */}
        <div>
          <div className="mb-6 flex flex-col items-center justify-center md:mb-8">
            <div className="mb-4 md:mb-5">
              <MyBgPatternDecorativeCube />
            </div>
            <div className="z-10 mb-4 rounded-xl border-2 p-3 md:mb-6">
              <Lock01 />
            </div>
            <div className="z-10 w-full max-w-[360px] px-2 md:px-0">
              <p className="text-xl-semibold mb-3 text-center text-gray-light/900">
                Set new password
              </p>
              <p className="text-md-regular text-center text-gray-light/600">
                Your new password must be different to previously used
                passwords.
              </p>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center">
            <form className="w-full max-w-[360px]" onSubmit={onSubmit}>
              <section className="mb-4 flex flex-col gap-y-1.5">
                <label
                  htmlFor="password"
                  className="text-sm-medium text-gray-light/700"
                >
                  New password
                </label>
                <MyTextField
                  name="password"
                  type={show ? 'text' : 'password'}
                  placeholder="Input new password"
                  control={control}
                  errors={errors?.password?.message}
                  disabled={isSubmitting}
                  endAdornment={
                    <div className="flex justify-center">
                      <span
                        onClick={() => setShow(!show)}
                        style={{
                          padding: '4px',
                          cursor: 'pointer',
                        }}
                      >
                        {show ? <Eye /> : <EyeOff />}
                      </span>
                    </div>
                  }
                />
              </section>

              <section className="mb-5 flex flex-col gap-y-1.5">
                <label
                  htmlFor="confirmPassword"
                  className="text-sm-medium text-gray-light/700"
                >
                  Confirm new password
                </label>
                <MyTextField
                  name="confirmPassword"
                  type={showConfirm ? 'text' : 'password'}
                  placeholder="Input confirm new password"
                  control={control}
                  errors={errors?.confirmPassword?.message}
                  disabled={isSubmitting}
                  endAdornment={
                    <div className="flex justify-center">
                      <span
                        onClick={() => setShowConfirm(!showConfirm)}
                        style={{
                          padding: '4px',
                          cursor: 'pointer',
                        }}
                      >
                        {showConfirm ? <Eye /> : <EyeOff />}
                      </span>
                    </div>
                  }
                />
              </section>

              <div className="mb-6 flex flex-col gap-y-2">
                <div className="text-sm-regular flex items-center gap-2 text-gray-light/600">
                  {/* {passwordChecks.minimumLength !== true ? ( */}
                  {/* <div className=""> */}
                  {/* <img src={CheckIcon} alt="CheckIcon" /> */}
                  {/* <CheckIcon className="size-5" /> */}
                  {/* </div> */}
                  {/* ) : ( */}
                  {/* <div className="text-success/600"> */}
                  {/* <CheckCircle className="size-5" /> */}
                  {/* </div> */}
                  {/* )} */}
                  Must be at least 12 characters
                </div>
                {/* 2 */}
                <div className="text-sm-regular flex items-center gap-2 text-gray-light/600">
                  {/* {passwordChecks.containUppercase !== true ? ( */}
                  {/* <img src={CheckIcon} alt="CheckIcon" /> */}
                  {/* ) : ( */}
                  {/* <div className="flex items-center text-success/600"> */}
                  {/* <CheckCircle className="size-5" /> */}
                  {/* </div> */}
                  {/* )} */}
                  <p className="">
                    Password must contain at least one uppercase letter
                  </p>
                </div>

                {/* 3 */}
                <div className="text-sm-regular flex items-center gap-2 text-gray-light/600">
                  {/* {passwordChecks.containLowercase !== true ? ( */}
                  {/* <img src={CheckIcon} alt="CheckIcon" /> */}
                  {/* ) : ( */}
                  {/* <div className="text-success/600"> */}
                  {/* <CheckCircle className="size-5" /> */}
                  {/* </div> */}
                  {/* )} */}
                  Password must contain at least one lowercase letter
                </div>
                {/* 4 */}
                <div className="text-sm-regular flex items-center gap-2 text-gray-light/600">
                  {/* {passwordChecks.containNumber !== true ? ( */}
                  {/* <img src={CheckIcon} alt="CheckIcon" /> */}
                  {/* ) : ( */}
                  {/* <div className="text-success/600"> */}
                  {/* <CheckCircle className="size-5" /> */}
                  {/* </div> */}
                  {/* )} */}
                  Password must contain at least one number
                </div>
                {/* 5 */}
                <div className="text-sm-regular flex items-center gap-2 text-gray-light/600">
                  {/* {passwordChecks.containSpecialCharacter !== true ? ( */}
                  {/* <img src={CheckIcon} alt="CheckIcon" /> */}
                  {/* ) : ( */}
                  {/* <div className="text-success/600"> */}
                  {/* <CheckCircle className="size-5" /> */}
                  {/* </div> */}
                  {/* )} */}
                  Password must contain at least one special character
                </div>
              </div>

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
            </form>
            <div className="mb-6 mt-4 flex items-center justify-center md:mt-6">
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

export default SetNewPassword
