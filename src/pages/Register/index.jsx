import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { Eye, EyeOff } from '@untitled-ui/icons-react'
import CryptoJS from 'crypto-js'
import {
  MyBgPatternDecorativeCube,
  MyButton,
  MyCheckbox,
  MyTextField,
  MyLogo,
} from '@interstellar-component'

import { useRegister } from './Context'
import { checkErrorYup, handleError } from '../../services/Helper'
import RegisterSchema from './schema'
import AlertModal from './modal'

function Register() {
  const { register, currentModal, handleCurrentModal } = useRegister()
  const nav = useNavigate()

  const [show, setShow] = useState(false)
  const localRememberMe = localStorage.getItem('rv5zzc9noTdU5AD2') || false

  const {
    setValue,
    handleSubmit,
    control,
    watch,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(RegisterSchema),
  })

  useEffect(() => {
    if (localRememberMe) {
      const decrypted = CryptoJS.AES.decrypt(
        localRememberMe,
        import.meta.env.VITE_APP_SECRET_KEY
      ).toString(CryptoJS.enc.Utf8)

      if (decrypted) {
        try {
          const rememberMeData = JSON.parse(decrypted)
          const decryptedpassword = CryptoJS.AES.decrypt(
            rememberMeData.password,
            import.meta.env.VITE_APP_SECRET_KEY
          ).toString(CryptoJS.enc.Utf8)

          setValue('email', rememberMeData?.email || '')
          setValue('password', decryptedpassword || '')
          setValue('remember_me', true)
        } catch (error) {
          // Silent error
        }
      }
    } else {
      setValue('remember_me', false)
    }
  }, [localRememberMe, setValue])

  const { email, password, remember_me } = watch()

  const onSubmit = handleSubmit(handleError(register, control), checkErrorYup)

  return (
    <>
      <AlertModal
        open={currentModal?.current === 'alert-modal'}
        handleCurrentModal={handleCurrentModal}
        currentModal={currentModal}
      />
      <main className="flex min-h-screen z-50">
        <div className="w-[30.55%] min-w-[220px] bg-brand/800 max-md:hidden flex items-center justify-center flex-shrink-0">
          {/* Brand area */}
        </div>
        <div id="right" className="flex flex-1 items-center justify-center max-md:w-full">
          <form
            className="items-center justify-center gap-6 w-full max-w-[480px] rounded-xl p-5 md:p-10 column z-50"
            onSubmit={onSubmit}
          >
            <div className="z-0">
              <MyBgPatternDecorativeCube />
            </div>
            <div className="z-40 flex flex-col gap-6 items-center">
              <MyLogo />
              <div className="gap-y-2 column items-center text-center">
                <p className="display-sm-semibold text-gray-900">Create Admin Account</p>
                <p className="text-md-regular text-gray-600">Start your 30-day free trial.</p>
              </div>
            </div>
            <div className="z-40 relative flex w-full flex-col gap-y-5 mt-2">
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
                      style={{
                        padding: '4px',
                        cursor: 'pointer',
                      }}
                    >
                      {show ? <Eye width={17} height={17} /> : <EyeOff width={17} height={17} />}
                    </span>
                  }
                  focusColor="#01172D"
                  focusShadow="#E6EBF0"
                />
              </div>
            </div>
            <section className="z-40 relative flex w-full items-center justify-between">
              <div className="flex flex-1 items-center gap-x-2">
                <MyCheckbox
                  name="remember_me"
                  control={control}
                  onChangeForm={(e) => {
                    setValue('remember_me', e.target.checked)
                  }}
                  checked={remember_me}
                />
                <p className="text-sm-medium text-gray-700">Remember for 30 days</p>
              </div>
            </section>
            <div className="z-40 relative w-full space-y-4">
              <MyButton
                type="submit"
                color="primary"
                variant="filled"
                size="lg"
                expanded
                disabled={isSubmitting}
              >
                <p className="text-md-semibold">Get started</p>
              </MyButton>
              <MyButton
                type="submit"
                color="primary"
                variant="filled"
                size="lg"
                expanded
                disabled={isSubmitting}
              >
                <p className="text-md-semibold">Sign up with Google</p>
              </MyButton>
            </div>
            <div className="z-40 relative w-full flex justify-center mt-4">
              <p className="text-sm-regular text-gray-600">
                Already have an account?{' '}
                <span
                  role="button"
                  tabIndex={0}
                  className="text-sm-semibold text-primary-700 cursor-pointer"
                  onClick={() => nav('/login')}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      nav('/login')
                    }
                  }}
                >
                  Log in
                </span>
              </p>
            </div>
          </form>
        </div>
      </main>
    </>
  )
}

export default Register
