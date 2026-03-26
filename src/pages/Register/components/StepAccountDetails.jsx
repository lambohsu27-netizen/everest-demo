import { MyButton, MyTextField, MyBgPatternDecorativeCube, MyLogo } from '@interstellar-component'
import { CheckCircle, Eye, EyeOff } from '@untitled-ui/icons-react'
import { useState } from 'react'
import CheckIcon from '../../../assets/Check-icon.svg'
import GoogleIcon from '../../../assets/GoogleIcon.svg'

function StepAccountDetails({ control, errors, trigger, watch, isSubmitting, nav }) {
  const [show, setShow] = useState(false)
  const { name, email, password } = watch()

  const passwordChecks = {
    containUppercase: /[A-Z]/.test(password || ''),
    containLowercase: /[a-z]/.test(password || ''),
    containNumber: /\d/.test(password || ''),
    containSpecialCharacter: /[@$!%*?&#\-+=~^|`_'";:/.,\\]/.test(password || ''),
    minimumLength: password?.length >= 8,
  }

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
            <p className="display-sm-semibold text-gray-900">Create admin account</p>
            <p className="text-md-regular text-gray-600">
              Enter your details to create the administrator account.
            </p>
          </div>
        </div>

        <div className="z-40 relative flex w-full flex-col gap-y-5 mt-2">
          <div className="gap-1 column">
            <p className="text-sm-medium text-gray-700">Name</p>
            <MyTextField
              name="name"
              trigger={trigger}
              placeholder="Enter your name"
              control={control}
              value={name}
              errors={errors?.name?.message}
              focusColor="#01172D"
              focusShadow="#E6EBF0"
            />
          </div>

          <div className="gap-1 column">
            <p className="text-sm-medium text-gray-700">Email</p>
            <MyTextField
              name="email"
              trigger={trigger}
              placeholder="Enter your email"
              control={control}
              value={email}
              errors={errors?.email?.message}
              focusColor="#01172D"
              focusShadow="#E6EBF0"
            />
          </div>

          <div className="gap-1 column">
            <p className="text-sm-medium text-gray-700">Password</p>
            <MyTextField
              type={show ? 'text' : 'password'}
              name="password"
              placeholder="Create a password"
              control={control}
              value={password}
              errors={errors?.password?.message}
              endAdornment={
                <span
                  onClick={() => setShow(!show)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      setShow(!show)
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  style={{ padding: '4px', cursor: 'pointer' }}
                >
                  {show ? <Eye width={17} height={17} /> : <EyeOff width={17} height={17} />}
                </span>
              }
              focusColor="#01172D"
              focusShadow="#E6EBF0"
            />
          </div>

          <section className="w-full flex flex-col gap-y-2">
            <div className="text-sm-regular flex items-center gap-2 text-gray-light/600">
              {passwordChecks.minimumLength !== true ? (
                <img src={CheckIcon} alt="CheckIcon" />
              ) : (
                <div className="text-success/600">
                  <CheckCircle className="size-5" />
                </div>
              )}
              Must be at least 8 characters
            </div>
            <div className="text-sm-regular flex items-center gap-2 text-gray-light/600">
              {passwordChecks.containUppercase !== true ? (
                <img src={CheckIcon} alt="CheckIcon" />
              ) : (
                <div className="flex items-center text-success/600">
                  <CheckCircle className="size-5" />
                </div>
              )}
              Must contain one special character
            </div>
          </section>

          <div className="z-40 relative w-full space-y-4 mt-6">
            <MyButton
              type="submit"
              color="primary"
              variant="filled"
              size="lg"
              expanded
              disabled={isSubmitting}
            >
              <p className="text-md-semibold">Continue</p>
            </MyButton>

            <StepAccountDetailsFooter isSubmitting={isSubmitting} />
          </div>

          <StepAccountDetailsLogin nav={nav} />
        </div>
      </div>
    </section>
  )
}

export function StepAccountDetailsFooter({ isSubmitting }) {
  return (
    <MyButton
      type="button"
      color="secondary"
      variant="outlined"
      size="lg"
      expanded
      disabled={isSubmitting}
    >
      <div className="flex items-center gap-x-3">
        <img src={GoogleIcon} alt="GoogleIcon" />
        <p className="text-md-semibold">Sign up with Google</p>
      </div>
    </MyButton>
  )
}

export function StepAccountDetailsLogin({ nav }) {
  return (
    <div className="z-40 relative w-full flex justify-center mt-4">
      <p className="text-sm-regular text-gray-600">
        Already have an account?{' '}
        <span
          role="button"
          tabIndex={0}
          className="text-sm-semibold text-brand/700 cursor-pointer"
          onClick={() => nav('/login')}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') nav('/login')
          }}
        >
          Log in
        </span>
      </p>
    </div>
  )
}

export default StepAccountDetails
