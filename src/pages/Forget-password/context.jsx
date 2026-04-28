import React, { createContext, useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { myToaster } from '@interstellar-component'
import Service from './service'
import { encryptPassword, myToasterFromApi } from '../../services/Helper'
import { post } from '../../services/NetworkUtils'

const ForgetPasswordContext = createContext()

function ForgetPasswordProvider(props) {
  const navigate = useNavigate()

  const [currentStep, setCurrentStep] = useState({
    step_1: true,
    step_2: false,
    step_3: false,
    step_4: false,
  })

  // SEND OTP TO EMAIL — API returns top-level user_id + countdown_to_new_otp (Forget-password / Argus shape)
  const sendEmail = async (body) => {
    await Service.sendEmail(body)
      .then(myToaster)
      .then((res) => {
        if (res?.user_id) localStorage.setItem('user_id', res.user_id)
        localStorage.setItem('email_forget_password', body.email)
        if (res?.countdown_to_new_otp) {
          localStorage.setItem('countdown_to_new_otp', res.countdown_to_new_otp)
          setCountdown(res.countdown_to_new_otp)
        }
        setCurrentStep({ step_2: true, step_1: false })
      })
      .catch((res) => {
        myToasterFromApi(res)
        if (res?.message === 'an OTP for such user has already exist and still not expired') {
          const nextCountdown = res?.resend_eligible_at || res?.countdown_to_new_otp
          if (nextCountdown) {
            localStorage.setItem('countdown_to_new_otp', nextCountdown)
            setCountdown(nextCountdown)
          }
          setTimeout(() => {
            setCurrentStep({ step_2: true, step_1: false })
            localStorage.setItem('email_forget_password', body.email)
          }, 2000)
        }
      })
  }

  // Validate OTP against the BE before advancing. Uses a peek-style verify
  // that does not consume the code, so reset-password can re-verify it.
  const continueWithOtp = async (otpDigits) => {
    const email = localStorage.getItem('email_forget_password')
    if (!email) {
      myToaster({ status: 400, message: 'Session expired. Please start forgot password again.' })
      return
    }
    await Service.verifyForgotPasswordOtp({ email, code: otpDigits })
      .then((res) => {
        myToaster(res)
        localStorage.setItem('otp_number', otpDigits)
        setCurrentStep({ step_1: false, step_2: false, step_3: true })
      })
      .catch(myToasterFromApi)
  }

  const [countdown, setCountdown] = useState(null)

  // RESEND OTP — body: { user_email, user_id } per CheckYourEmail
  const resendEmail = async (body) => {
    await Service.resendEmail(body)
      .then((res) => {
        myToaster(res)
        if (res?.countdown_to_new_otp) {
          setCountdown(res.countdown_to_new_otp)
          localStorage.setItem('countdown_to_new_otp', res.countdown_to_new_otp)
        }
        if (res?.user_id) localStorage.setItem('user_id', res.user_id)
        setCurrentStep({
          step_1: false,
          step_2: true,
          step_3: false,
          step_4: false,
        })
      })
      .catch((res) => {
        myToasterFromApi(res)
        if (res?.countdown_to_new_otp) {
          setCountdown(res.countdown_to_new_otp)
          localStorage.setItem('countdown_to_new_otp', res.countdown_to_new_otp)
        }
      })
  }

  const updatePassword = async (body) => {
    const email = localStorage.getItem('email_forget_password')
    const code = localStorage.getItem('otp_number')
    if (!email || !code) {
      myToaster({ status: 400, message: 'Session expired. Please start forgot password again.' })
      return
    }

    await post('/v1/auth/reset-password', {
      email,
      code,
      password: encryptPassword(body.password),
    })
      .then(myToaster)
      .then((res) => {
        if (res?.status === 500) return
        setCurrentStep({
          step_1: false,
          step_2: false,
          step_3: false,
          step_4: true,
        })
        localStorage.removeItem('user_id')
        localStorage.removeItem('otp_number')
        localStorage.removeItem('countdown_to_new_otp')
        localStorage.removeItem('email_forget_password')
      })
      .catch(myToasterFromApi)
  }

  return (
    <ForgetPasswordContext.Provider
      value={{
        sendEmail,
        currentStep,
        continueWithOtp,
        updatePassword,
        navigate,
        resendEmail,
        countdown,
        setCountdown,
        setCurrentStep,
      }}
    >
      {props.children}
    </ForgetPasswordContext.Provider>
  )
}

const useForgetPassword = () => {
  const context = useContext(ForgetPasswordContext)
  if (context === undefined) {
    throw new Error('useForgetPassword must be used within a ForgetPasswordProvider')
  }
  return context
}

export { ForgetPasswordProvider, useForgetPassword }
