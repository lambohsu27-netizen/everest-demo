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
} from '@interstellar-component'

import loginPhoto from '../../assets/Login/loginPhoto.png'
import bipura_logo from '../../assets/Login/bipura_logo.png'

import { useLogin } from './Context'
import { checkErrorYup, handleError } from '../../services/Helper'
import { LoginSchema } from './schema'
import AlertModal from './modal'

function Login() {
  const { login, currentModal, handleCurrentModal } = useLogin()
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
    resolver: yupResolver(LoginSchema),
  })

  useEffect(() => {
    if (localRememberMe) {
      const decrypted = CryptoJS.AES.decrypt(
        localRememberMe,
        import.meta.env.VITE_APP_SECRET_KEY
      ).toString(CryptoJS.enc.Utf8)

      // console.log('decrypted: ', decrypted)

      if (decrypted) {
        try {
          const rememberMeData = JSON.parse(decrypted)
          // console.log('pass: ', rememberMeData.password)
          const decryptedpassword = CryptoJS.AES.decrypt(
            rememberMeData.password,
            import.meta.env.VITE_APP_SECRET_KEY
          ).toString(CryptoJS.enc.Utf8)
          // console.log('decryptedpassword; ', decryptedpassword)

          setValue('email', rememberMeData?.email || '')
          setValue('password', decryptedpassword || '')
          setValue('remember_me', true)
        } catch (error) {
          console.error('Failed to parse JSON:', error)
        }
      }
    } else {
      setValue('remember_me', false)
    }
  }, [localRememberMe, setValue])

  const { email, password, remember_me } = watch()

  const onSubmit = handleSubmit(handleError(login, control), checkErrorYup)

  return (
    <>
      <AlertModal
        open={currentModal?.current === 'alert-modal'}
        handleCurrentModal={handleCurrentModal}
        currentModal={currentModal}
      />
      <main className="flex h-screen z-50">
        <div id="left" className="flex w-full items-center justify-center max-md:w-full">
          <form
            className="items-center justify-center gap-6 w-full max-w-[480px] rounded-xl p-5 md:p-10 column z-50"
            onSubmit={onSubmit}
          >
            <div className="z-0">
              <MyBgPatternDecorativeCube />
            </div>
            {/* <img
              src={MantapLogoLogin}
              alt="logo"
              width={152}
              height={118}
              className="z-40"
            /> */}
            <div className="z-40 flex flex-col gap-6 items-center">
              <img src={bipura_logo} alt="logo" width={42} height={21} />
              <div className="gap-y-2 column items-center text-center">
                <p className="display-sm-semibold text-gray-900">Log in to your account</p>
                <p className="text-md-regular text-gray-600">
                  Welcome back! Please enter your details.
                </p>
              </div>
            </div>
            <div className="z-40 relative flex w-full flex-col gap-y-5 mt-2">
              <div className="gap-1 column">
                <p className="text-sm-medium text-gray-700">Email</p>
                <MyTextField
                  name="email"
                  // type="email"
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
                  placeholder="Enter your password"
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
              <MyButton color="primary" variant="text" onClick={() => nav('/forget-password')}>
                <p className="text-sm-semibold">Forgot password</p>
              </MyButton>
            </section>
            <div className="z-40 relative w-full">
              <MyButton
                type="submit"
                color="primary"
                variant="filled"
                size="lg"
                expanded
                disabled={isSubmitting}
              >
                <p className="text-md-semibold">Login</p>
              </MyButton>
            </div>
          </form>
        </div>
        {/* <div id="right" className="w-5/12 overflow-hidden rounded-l-extraLarge max-md:hidden">
          <img src={loginPhoto} alt="Login Illustration" className="h-full w-full object-cover" />
        </div> */}
      </main>
    </>
  )
}

export default Login
