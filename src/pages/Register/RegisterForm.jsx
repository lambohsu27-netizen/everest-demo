import { yupResolver } from '@hookform/resolvers/yup'
import { MyBgPatternDecorativeCube, MyButton, MyLogo } from '@interstellar-component'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { checkErrorYup, handleError } from '../../services/Helper'
import { useRegister } from './Context'
import RegisterSchema from './schema'
import TermsConditions from './TermsConditions'
import StepAccountDetails, { StepAccountDetailsFooter, StepAccountDetailsLogin } from './components/StepAccountDetails'
import StepVerification from './components/StepVerification'

function RegisterForm({ activeStep, setActiveStep }) {
  const { register } = useRegister()
  const nav = useNavigate()
  const [acceptedTerms, setAcceptedTerms] = useState(false)

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

  if (activeStep === 2) {
    return (
      <div id="right" className="flex flex-1 items-center justify-center max-md:w-full bg-white relative z-50">
        <TermsConditions
          onBack={() => setActiveStep(1)}
          onAccept={() => setActiveStep(3)}
          accepted={acceptedTerms}
          setAccepted={setAcceptedTerms}
        />
      </div>
    )
  }

  return (
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
        </div>

        {activeStep === 1 && (
          <StepAccountDetails
            control={control}
            errors={errors}
            trigger={trigger}
            watch={watch}
          />
        )}

        {activeStep === 3 && (
          <StepVerification
            control={control}
            trigger={trigger}
          />
        )}

        <div className="z-40 relative w-full space-y-4 mt-6">
          <MyButton
            type="submit"
            color="primary"
            variant="filled"
            size="lg"
            expanded
            disabled={isSubmitting}
            onClick={(e) => {
              if (activeStep < 3) {
                e.preventDefault()
                setActiveStep(activeStep + 1)
              }
            }}
          >
            <p className="text-md-semibold">{activeStep === 3 ? 'Verify' : 'Continue'}</p>
          </MyButton>

          {activeStep === 1 && (
            <StepAccountDetailsFooter isSubmitting={isSubmitting} />
          )}

          {activeStep > 1 && (activeStep !== 2) && (
            <MyButton
              type="button"
              color="secondary"
              variant="outlined"
              size="lg"
              expanded
              disabled={isSubmitting}
              onClick={() => setActiveStep(activeStep - 1)}
            >
              <p className="text-md-semibold">Back</p>
            </MyButton>
          )}
        </div>

        {activeStep === 1 && (
          <StepAccountDetailsLogin nav={nav} />
        )}
      </form>
    </div>
  )
}

export default RegisterForm
