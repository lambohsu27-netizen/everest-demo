import { yupResolver } from '@hookform/resolvers/yup'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { checkErrorYup, handleError } from '../../services/Helper'
import StepAccountDetails from './components/StepAccountDetails'
import StepVerification from './components/StepVerification'
import { useRegister } from './Context'
import RegisterSchema from './schema'
import TermsConditions from './TermsConditions'

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

  return (
    <form id="right" className="flex-1" onSubmit={onSubmit}>
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
          isSubmitting={isSubmitting}
          onBack={() => setActiveStep(2)}
        />
      )}
    </form>
  )
}

export default RegisterForm
