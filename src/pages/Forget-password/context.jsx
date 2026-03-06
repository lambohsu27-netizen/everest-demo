import React, { createContext, useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { myToaster } from '@interstellar-component'
import Service from './service'

const ForgetPasswordContext = createContext()

function ForgetPasswordProvider(props) {
  const navigate = useNavigate()
  const localUser_id = localStorage.getItem('user_id')
  const localOtp_number = localStorage.getItem('otp_number')

  const [currentStep, setCurrentStep] = useState({
    step_1: true,
    step_2: false,
    step_3: false,
    step_4: false,
  })

  // SEND OTP TO EMAIL
  const sendEmail = async (body) => {
    await Service.sendEmail(body)
      .then(myToaster)
      .then((res) => {
        // console.log(res);
        localStorage.setItem('user_id', res?.user_id)
        localStorage.setItem('email_forget_password', body.email)
        localStorage.setItem('countdown_to_new_otp', res?.countdown_to_new_otp)
        setCurrentStep({ step_2: true, step_1: false })
        setCountdown(res?.countdown_to_new_otp)
      })
      .catch((res) => {
        myToaster(res)
        if (
          res.message ===
          'an OTP for such user has already exist and still not expired'
        ) {
          setTimeout(() => {
            setCurrentStep({ step_2: true, step_1: false })
            localStorage.setItem('email_forget_password', body.email)
          }, 2000)
        }
      })
  }

  // SEND OTP RECEIVED TO SERVER
  const sendOTP = async (body) => {
    localStorage.setItem('otp_number', body.otp)

    await Service.sendOTP(body)
      .then(myToaster)
      .then((res) =>
        setCurrentStep({ step_1: false, step_2: false, step_3: true })
      )
      .catch(myToaster)
  }

  // RESET USER PASSWORD AFTER OTP MATCH
  const updatePassword = async (body) => {
    const formData = new FormData()
    formData.append('password', body.password)
    formData.append('user_id', localUser_id)
    formData.append('otp_number', localOtp_number)

    await Service.updateForgottenPassword(formData)
      .then(myToaster)
      .then((res) => {
        if (res.status === 500) return
        setCurrentStep({
          step_1: false,
          step_2: false,
          step_3: false,
          step_4: true,
        })
        localStorage.removeItem('user_id')
        localStorage.removeItem('otp_number')
      })
      .catch(myToaster)
  }

  const [countdown, setCountdown] = useState(null)

  // RESEND OTP to EMAIL
  const resendEmail = async (body) => {
    await Service.resendEmail(body)
      .then((res) => {
        // console.log(res);
        myToaster(res)
        if (res?.countdown_to_new_otp) setCountdown(res?.countdown_to_new_otp)
        setCurrentStep({
          step_1: false,
          step_2: true,
          step_3: false,
          step_4: false,
        })
      })
      .catch((res) => {
        myToaster(res)
      })
  }

  return (
    <ForgetPasswordContext.Provider
      value={{
        sendEmail,
        currentStep,
        sendOTP,
        updatePassword,
        navigate,
        resendEmail,
        countdown,
        setCountdown,
      }}
    >
      {' '}
      {props.children}
    </ForgetPasswordContext.Provider>
  )
}

const useForgetPassword = () => {
  const context = useContext(ForgetPasswordContext)
  if (context === undefined) {
    throw new Error(
      'useForgetPassword must be used within a ForgetPasswordProvider'
    )
  }
  return context
}

export { ForgetPasswordProvider, useForgetPassword }
