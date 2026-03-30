import { ArrowLeft, Mail01 } from '@untitled-ui/icons-react'
import { useEffect, useRef, useState } from 'react'
import moment from 'moment'
import { MyBgPatternDecorativeCube, MyButton } from '@interstellar-component'
import { useForgetPassword } from '../context'

function CheckYourEmail() {
  const { continueWithOtp, resendEmail, navigate, countdown, setCountdown } = useForgetPassword()
  const localUser_id = localStorage.getItem('user_id')
  const localForgetemail = localStorage.getItem('email_forget_password')

  const numberOfDigits = 4
  const [otp, setOtp] = useState(new Array(numberOfDigits).fill(''))
  const otpBoxReference = useRef([])

  const stringOTP = otp.toString().replace(/,/g, '')

  function handleChange(value, index) {
    value = value.replace(/\D/, '')
    const newArr = [...otp]
    newArr[index] = value
    setOtp(newArr)

    if (value && index < numberOfDigits - 1) {
      otpBoxReference.current[index + 1].focus()
    }
  }

  function handleBackspaceAndEnter(e, index) {
    if (e.key === 'Backspace' && !e.target.value && index > 0) {
      otpBoxReference.current[index - 1].focus()
    }
    if (e.key === 'Enter' && e.target.value && index < numberOfDigits - 1) {
      otpBoxReference.current[index + 1].focus()
    }
  }

  // COUNT DOWN
  const [minutes, setMinutes] = useState(0)
  const [seconds, setSeconds] = useState(0)

  useEffect(() => {
    if (countdown) {
      const intervalId = setInterval(() => {
        const now = moment()
        const timeDifference = moment(countdown).diff(now)

        const minutesRemaining = moment.duration(timeDifference).minutes()
        const secondsRemaining = moment.duration(timeDifference).seconds()

        setMinutes(minutesRemaining)
        setSeconds(secondsRemaining)

        if (timeDifference < 0) {
          clearInterval(intervalId)
          setMinutes(0)
          setSeconds(0)
        }
      }, 1000)

      return () => clearInterval(intervalId)
    }
  }, [countdown])

  // Set the countdown from localStorage on component mount
  useEffect(() => {
    const storedCountdown = localStorage.getItem('countdown_to_new_otp')
    if (storedCountdown) {
      setCountdown(storedCountdown)
    }
  }, [])

  // Save the countdown to localStorage
  useEffect(() => {
    if (countdown) {
      localStorage.setItem('countdown_to_new_otp', countdown)
    }
  }, [countdown])

  return (
    <div className="mx-auto w-full md:mt-36 md:w-3/4">
      <div>
        {/* bg */}
        {/* Content */}
        <div className="mb-6 flex flex-col items-center justify-center md:mb-8">
          <div className="mb-4 md:mb-5">
            <MyBgPatternDecorativeCube />
          </div>
          <div className="z-0 mb-4 rounded-xl border-2 p-3 md:mb-6">
            <Mail01 />
          </div>
          <div className="z-0 px-2 md:px-0">
            <p className="text-xl-semibold mb-3 text-center text-gray-light/900">
              Check your email
            </p>
            <p className="text-md-regular text-center text-gray-light/600">
              We sent a verification code to {localForgetemail || '-'}
            </p>
          </div>
        </div>

        <div className="flex flex-col flex-wrap items-center justify-center">
          <div className="mb-6 flex h-14 w-full max-w-[360px] items-center justify-center gap-1.5 md:mb-8 md:h-16 md:gap-4">
            {otp.map((digit, index) => (
              <input
                key={index}
                value={digit}
                maxLength={1}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyUp={(e) => handleBackspaceAndEnter(e, index)}
                ref={(reference) => (otpBoxReference.current[index] = reference)}
                className={`border ${
                  digit ? 'border-brand/500 border-2' : ''
                } display-lg-medium z-0 block h-auto w-20 appearance-none rounded-xl px-2 py-2.5 text-center text-brand/600 focus:border-brand/500 focus:border-2 focus:outline-none focus:shadow-focus-rings/ring-brand-mega`}
              />
            ))}
          </div>
          <div className="z-10 w-full max-w-[360px]">
            <MyButton
              type="submit"
              color="primary"
              variant="filled"
              size="lg"
              expanded
              disabled={stringOTP?.length !== 4}
              onClick={() => continueWithOtp(stringOTP)}
            >
              <p className="text-md-semibold">Continue</p>
            </MyButton>
          </div>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-1 text-center md:mt-8">
            <p className="text-md-regular text-gray-light/600">Didn’t receive the email?</p>
            <MyButton
              disabled={seconds !== 0}
              onClick={() => {
                setOtp(new Array(numberOfDigits).fill(''))
                resendEmail({
                  user_email: localForgetemail,
                  user_id: localUser_id,
                })
              }}
            >
              <p className="text-sm-semibold z-0 mr-2 text-brand/700">Click to resend</p>
            </MyButton>
            <p
              className={`text-sm-semibold z-0 text-red-600 ${
                minutes === 0 && seconds === 0 ? 'hidden' : ''
              }`}
            >{`(${minutes}:${seconds})`}</p>
          </div>
          <div className="z-0 mt-6 flex items-center justify-center md:mt-8">
            <MyButton onClick={() => navigate('/login')}>
              <ArrowLeft size="15" />
              <p className="text-sm-semibold z-0 text-center text-gray-600">Back to login</p>
            </MyButton>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CheckYourEmail
