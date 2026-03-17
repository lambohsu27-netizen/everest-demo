import { yupResolver } from '@hookform/resolvers/yup'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import * as yup from 'yup'

import StepCompanyInfo from './components/StepCompanyInfo'
import StepLegalBusinessInfo from './components/StepLegalBusinessInfo'
import StepRepresentativeInfo from './components/StepRepresentativeInfo'
import StepMembershipAgreement from './components/StepMembershipAgreement'
import StepMembershipApplicationSubmitSuccessful from './components/StepMembershipApplicationSubmitSuccessful'

const RegisterCompanySchema = yup.object().shape({
  company_name: yup.string().required('Company name is required'),
  business_category: yup.object().required('Business category is required'),
  industry: yup.object().required('Industry is required'),
  website: yup.string().url('Invalid URL format').nullable(), // Optional per Figma (no *)
  company_size: yup.object().required('Company size is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  logo: yup.mixed().required('Logo is required'),
  province: yup.object().required('Province is required'),
  city: yup.object().required('City is required'),
  district: yup.object().required('District is required'),
  subdistrict: yup.object().required('Subdistrict is required'),
  postal_code: yup.object().required('Postal code is required'),
  company_address: yup.string().required('Company address is required'),
  registration_number: yup.string().required('Registration number is required'),
  business_type: yup.string().required('Business type is required'),
  registered_address: yup.string().required('Registered address is required'),
  incorporation_date: yup.string().required('Incorporation date is required'),
  rep_name: yup.string().required('Authorized representative name is required'),
  rep_position: yup.string().required('Position is required'),
  rep_email: yup.string().email('Invalid email').required('Corporate email is required'),
  rep_phone: yup.string().required('Phone number is required'),
})

function RegisterCompanyInfoForm({ activeStep, setActiveStep }) {
  const nav = useNavigate()
  const [accepted, setAccepted] = useState({ terms: false, privacy: false })

  const {
    handleSubmit,
    control,
    trigger,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(RegisterCompanySchema),
    defaultValues: {
      company_name: '',
      business_category: null,
      industry: null,
      website: '',
      company_size: null,
      email: '',
      logo: null,
      province: null,
      city: null,
      district: null,
      subdistrict: null,
      postal_code: null,
      company_address: '',
      registration_number: '',
      business_type: '',
      registered_address: '',
      incorporation_date: '',
      rep_name: '',
      rep_position: '',
      rep_email: '',
      rep_phone: '',
    },
  })

  const onSubmit = handleSubmit((data) => {
    if (activeStep < 4) {
      setActiveStep(activeStep + 1)
    } else if (activeStep === 4) {
      console.log('Final Data:', data)
      // Here you would typically call an API service
      setActiveStep(5)
    }
  })

  return (
    <form id="right" className="flex-1 overflow-y-auto h-full" onSubmit={onSubmit}>
      {activeStep === 1 && (
        <StepCompanyInfo
          control={control}
          errors={errors}
          trigger={trigger}
          watch={watch}
          setValue={setValue}
          isSubmitting={isSubmitting}
        />
      )}

      {activeStep === 2 && (
        <StepLegalBusinessInfo
          control={control}
          errors={errors}
          trigger={trigger}
          watch={watch}
          isSubmitting={isSubmitting}
          onBack={() => setActiveStep(1)}
        />
      )}

      {activeStep === 3 && (
        <StepRepresentativeInfo
          control={control}
          errors={errors}
          trigger={trigger}
          watch={watch}
          isSubmitting={isSubmitting}
          onBack={() => setActiveStep(2)}
        />
      )}

      {activeStep === 4 && (
        <StepMembershipAgreement
          control={control}
          errors={errors}
          trigger={trigger}
          watch={watch}
          isSubmitting={isSubmitting}
          onBack={() => setActiveStep(3)}
          accepted={accepted}
          setAccepted={setAccepted}
        />
      )}

      {activeStep === 5 && (
        <StepMembershipApplicationSubmitSuccessful
          onBackToCompanyList={() => nav('/dashboard')}
        />
      )}
    </form>
  )
}

export default RegisterCompanyInfoForm
