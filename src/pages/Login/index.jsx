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
import MantapLogoLogin from '../../assets/Login/mantapLogologin.png'

import { useLogin } from './Context'
import { checkErrorYup, handleError } from '../../services/Helper'
import { LoginSchema } from './schema'
import AlertModal from './modal'

function Login() {
  const { login, currentModal, handleCurrentModal } = useLogin()
  const nav = useNavigate()

  const [show, setShow] = useState(false)
  const localRememberMe = localStorage.getItem('rv5zzc9noTdU5AD2')

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

  // useEffect(() => {
  //   if (localRememberMe) {
  //     const decrypted = CryptoJS.AES.decrypt(
  //       localRememberMe,
  //       import.meta.env.VITE_APP_SECRET_KEY
  //     ).toString(CryptoJS.enc.Utf8)

  //     // console.log('decrypted: ', decrypted)

  //     if (decrypted) {
  //       try {
  //         const rememberMeData = JSON.parse(decrypted)
  //         // console.log('pass: ', rememberMeData.password)
  //         const decryptedpassword = CryptoJS.AES.decrypt(
  //           rememberMeData.password,
  //           import.meta.env.VITE_APP_SECRET_KEY
  //         ).toString(CryptoJS.enc.Utf8)
  //         // console.log('decryptedpassword; ', decryptedpassword)

  //         setValue('email', rememberMeData?.email || '')
  //         setValue('password', decryptedpassword || '')
  //         setValue('remember_me', true)
  //       } catch (error) {
  //         console.error('Failed to parse JSON:', error)
  //       }
  //     }
  //   } else {
  //     setValue('remember_me', false)
  //   }
  // }, [localRememberMe, setValue])

  const { email, password, remember_me } = watch()

  const onSubmit = handleSubmit(handleError(login, control), checkErrorYup)

  return (
    <>
      <AlertModal
        open={currentModal?.current === 'alert-modal'}
        handleCurrentModal={handleCurrentModal}
        currentModal={currentModal}
      />
      <main className="flex h-screen">
        <div
          id="left"
          className="flex w-7/12 items-center justify-center max-md:w-full"
        >
          <form
            className="items-center justify-center gap-6 rounded-xl p-10 column"
            onSubmit={onSubmit}
          >
            <div className="z-0">
              <MyBgPatternDecorativeCube />
            </div>
            <img
              src={MantapLogoLogin}
              alt="logo"
              width={152}
              height={118}
              className="z-40"
            />
            <div className="z-40 flex min-w-[400px] flex-col gap-y-6">
              <div className="gap-y-2 column">
                <p className="display-sm-semibold text-gray-900">
                  Selamat datang
                </p>
                <p className="text-md-regular text-gray-600">
                  Silahkan login terlebih dahulu.
                </p>
              </div>
            </div>
            <div className="flex min-w-[400px] flex-col gap-y-5">
              <div className="gap-1 column">
                <p className="text-sm-medium text-gray-700">Email / NIP</p>
                <MyTextField
                  name="email"
                  // type="email"
                  trigger={trigger}
                  placeholder="Masukkan email atau NIP anda"
                  control={control}
                  value={email}
                  errors={errors?.email?.message}
                  focusColor={'#01172D'}
                  focusShadow={'#E6EBF0'}
                />
              </div>

              <div className="gap-1 column">
                <p className="text-sm-medium text-gray-700">Password</p>

                <MyTextField
                  type={show ? 'text' : 'password'}
                  name="password"
                  placeholder="Masukkan password anda"
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
                      {show ? (
                        <Eye width={17} height={17} />
                      ) : (
                        <EyeOff width={17} height={17} />
                      )}
                    </span>
                  }
                  focusColor={'#01172D'}
                  focusShadow={'#E6EBF0'}
                />
              </div>
            </div>
            <section className="flex min-w-[400px] items-center justify-end">
              {/* <div className="flex flex-1 items-center gap-x-2">
                <MyCheckbox
                  name="remember_me"
                  control={control}
                  onChangeForm={(e) => {
                    setValue('remember_me', e.target.checked)
                  }}
                  checked={remember_me}
                />
                <p className="text-sm-medium text-gray-light-700">Ingat saya</p>
              </div> */}
              <MyButton
                color="primary"
                variant="text"
                onClick={() => nav('/forget-password')}
              >
                <p className="text-sm-semibold">Lupa password</p>
              </MyButton>
            </section>
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
          </form>
          <div className="absolute bottom-8 left-8 h-[16px] w-[108px]">
            {/* <LogoKalachakra /> */}
          </div>
        </div>
        <div
          id="right"
          className="w-5/12 overflow-hidden rounded-l-extraLarge max-md:hidden"
        >
          <img
            src={loginPhoto}
            alt="Login Illustration"
            className="h-full w-full object-cover"
          />
        </div>
      </main>
    </>
  )
}

export default Login
