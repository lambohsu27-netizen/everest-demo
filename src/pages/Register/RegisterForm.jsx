import { yupResolver } from '@hookform/resolvers/yup'
import { useState, useRef, useEffect, useCallback } from 'react'
import moment from 'moment'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { checkErrorYup, handleError } from '../../services/Helper'
import StepAccountDetails from './components/StepAccountDetails'
import StepVerification from './components/StepVerification'
import StepEmailVerified from './components/StepEmailVerified'
import { useRegister } from './Context'
import RegisterSchema from './schema'
import TermsConditions from './components/TermsConditions'

function RegisterForm({ activeStep, setActiveStep }) {
  const { register } = useRegister()
  const nav = useNavigate()
  const [acceptedTerms, setAcceptedTerms] = useState(false)

  const [otpMode, setOtpMode] = useState(false)
  const numberOfDigits = 4
  const [otp, setOtp] = useState(new Array(numberOfDigits).fill(''))
  const otpBoxReference = useRef([])

  const handleOtpChange = useCallback(
    (value, index) => {
      const normalizedValue = value.replace(/\D/, '')
      const newArr = [...otp]
      newArr[index] = normalizedValue
      setOtp(newArr)

      if (normalizedValue && index < numberOfDigits - 1) {
        otpBoxReference.current[index + 1]?.focus()
      }
    },
    [otp]
  )

  const handleOtpBackspaceAndEnter = useCallback((e, index) => {
    if (e.key === 'Backspace' && !e.target.value && index > 0) {
      otpBoxReference.current[index - 1]?.focus()
    }
    if (e.key === 'Enter' && e.target.value && index < numberOfDigits - 1) {
      otpBoxReference.current[index + 1]?.focus()
    }
  }, [])

  // COUNT DOWN
  const [minutes, setMinutes] = useState(0)
  const [seconds, setSeconds] = useState(0)
  const [countdown, setCountdown] = useState(null)

  useEffect(() => {
    if (!countdown) return

    const intervalId = setInterval(() => {
      const now = moment()
      const timeDifference = moment(countdown).diff(now) // ms

      if (timeDifference <= 0) {
        clearInterval(intervalId)
        setMinutes(0)
        setSeconds(0)
        localStorage.removeItem('countdown_to_new_otp')
        return
      }

      const dur = moment.duration(timeDifference)
      setMinutes(dur.minutes())
      setSeconds(dur.seconds())
    }, 1000)

    return () => {
      clearInterval(intervalId)
    }
  }, [countdown])

  useEffect(() => {
    const storedCountdown = localStorage.getItem('countdown_to_new_otp')
    if (storedCountdown) {
      setCountdown(storedCountdown)
    }
  }, [])

  useEffect(() => {
    if (countdown) {
      localStorage.setItem('countdown_to_new_otp', countdown)
    }
  }, [countdown])

  const {
    handleSubmit,
    control,
    trigger,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(RegisterSchema),
  })

  const onSubmit = handleSubmit((data) => {
    if (activeStep < 3) {
      setActiveStep(activeStep + 1)
    } else {
      handleError(register, control)(data)
    }
  }, checkErrorYup)

  return (
    <form id="right" className="flex-1 overflow-y-hidden h-full" onSubmit={onSubmit}>
      {activeStep === 1 && (
        <StepAccountDetails
          control={control}
          errors={errors}
          trigger={trigger}
          watch={watch}
          isSubmitting={isSubmitting}
          nav={nav}
        />
      )}

      {activeStep === 2 && (
        <TermsConditions
          onBack={() => setActiveStep(1)}
          onAccept={() => setActiveStep(3)}
          accepted={acceptedTerms}
          setAccepted={setAcceptedTerms}
        />
      )}

      {activeStep === 3 && (
        <StepVerification
          control={control}
          trigger={trigger}
          watch={watch}
          isSubmitting={isSubmitting}
          onBack={() => setActiveStep(2)}
          otpMode={otpMode}
          setOtpMode={setOtpMode}
          otp={otp}
          setOtp={setOtp}
          handleOtpChange={handleOtpChange}
          handleOtpBackspaceAndEnter={handleOtpBackspaceAndEnter}
          otpBoxReference={otpBoxReference}
          minutes={minutes}
          seconds={seconds}
          setCountdown={setCountdown}
        />
      )}

      {activeStep === 4 && (
        <StepEmailVerified
          isSubmitting={isSubmitting}
          onBack={() => nav('/login')}
          onContinue={onSubmit}
        />
      )}
    </form>
  )
}

export default RegisterForm
