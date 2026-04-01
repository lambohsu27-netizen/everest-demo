import React, { useEffect, useState } from 'react'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller } from 'react-hook-form'
import SimpleBar from 'simplebar-react'
import { XClose, Calendar, RefreshCcw05 } from '@untitled-ui/icons-react'
import { format } from 'date-fns'
import {
  MyButton,
  MyTextField,
  MyAutocomplete,
  MyDoubleCard,
  MyCalendar,
} from '@interstellar-component'

const schema = yup.object({
  levelName: yup.string().required('Employment Level Name is required'),
  salaryFrom: yup.string().required('Salary Range (from) is required'),
  salaryTo: yup.string().required('Salary Range (to) is required'),
  consentExpiry: yup.date().nullable().required('Consent Expiry is required'),
  repeatEvery: yup
    .object({ label: yup.string(), value: yup.string() })
    .nullable()
    .required('Repeat Every is required'),
})

const REPEAT_EVERY_OPTIONS = [
  { label: 'Monthly', value: 'monthly', subLabel: 'every 1 month' },
  { label: 'Bi-monthly', value: 'bi-monthly', subLabel: 'every 2 months' },
  { label: 'Quarterly', value: 'quarterly', subLabel: 'every 3 months' },
  { label: 'Semiannual', value: 'semiannual', subLabel: 'every 6 months' },
  { label: 'Annual', value: 'annual', subLabel: 'yearly' },
]

function FieldLabel({ children, required }) {
  return (
    <p className="text-sm font-medium text-gray-700 mb-1">
      {children}
      {required && <span className="ml-0.5 text-red-500">*</span>}
    </p>
  )
}

function SelectField({
  label,
  required,
  name,
  control,
  options,
  placeholder,
  errors,
  startAdornment,
  hintText,
  ...props
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <FieldLabel required={required}>{label}</FieldLabel>
      <MyAutocomplete
        name={name}
        control={control}
        options={options}
        placeholder={placeholder}
        errors={errors}
        startAdornment={startAdornment}
        {...props}
      />
      {hintText && <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">{hintText}</p>}
    </div>
  )
}

export default function NewLevelSlider({ open, mode = 'create', initialData, onClose }) {
  const [isVisible, setIsVisible] = useState(false)

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      levelName: '',
      salaryFrom: '',
      salaryTo: '',
      consentExpiry: null,
      repeatEvery: null,
    },
  })

  useEffect(() => {
    if (open) {
      if (mode === 'edit' && initialData) {
        const salaryParts = initialData.salaryRange ? initialData.salaryRange.split(' - ') : ['', '']
        
        let repeatVal = null
        if (initialData.repeatEvery) {
          const lower = initialData.repeatEvery.toLowerCase()
          if (lower.includes('month') && !lower.includes('3') && !lower.includes('6')) repeatVal = REPEAT_EVERY_OPTIONS[0]
          else if (lower.includes('2 month')) repeatVal = REPEAT_EVERY_OPTIONS[1]
          else if (lower.includes('3 month')) repeatVal = REPEAT_EVERY_OPTIONS[2]
          else if (lower.includes('6 month')) repeatVal = REPEAT_EVERY_OPTIONS[3]
          else if (lower.includes('year') || lower.includes('annual')) repeatVal = REPEAT_EVERY_OPTIONS[4]
        }

        reset({
          levelName: initialData.level || '',
          salaryFrom: salaryParts[0] || '',
          salaryTo: salaryParts[1] || '',
          consentExpiry: new Date(), // Mock date since dummy data is '5 years'
          repeatEvery: repeatVal,
        })
      } else {
        reset({
          levelName: '',
          salaryFrom: '',
          salaryTo: '',
          consentExpiry: null,
          repeatEvery: null,
        })
      }
      const frame = requestAnimationFrame(() => setIsVisible(true))
      return () => cancelAnimationFrame(frame)
    }
    setIsVisible(false)
    return undefined
  }, [open, mode, initialData, reset])

  const animateClose = () => {
    setIsVisible(false)
    setTimeout(() => {
      onClose()
      reset()
    }, 300)
  }

  const onSubmit = handleSubmit(() => {
    animateClose()
  })

  if (!open && !isVisible) return null

  return (
    <>
      <div
        role="presentation"
        className={`fixed inset-0 z-40 bg-gray-950/70 backdrop-blur-md transition-opacity duration-300 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={animateClose}
      />

      <div
        className={`fixed inset-y-0 right-0 z-50 flex pl-10 transition-transform duration-300 ease-in-out ${
          isVisible ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex h-screen w-[420px] flex-col bg-white shadow-xl">
          {/* Header */}
          <header className="relative flex items-start gap-x-4 px-6 py-6 border-b border-gray-100">
            <button
              type="button"
              onClick={animateClose}
              className="absolute right-[12px] top-[12px] flex h-10 w-10 items-center justify-center rounded-lg p-2 text-gray-400 hover:bg-gray-50 active:bg-gray-100"
            >
              <XClose size={24} stroke="currentColor" />
            </button>

            <div className="flex flex-1 flex-col gap-1 pt-1">
              <p className="text-lg font-semibold text-gray-900">
                {mode === 'edit' ? 'Edit Employment Level' : 'New Employment Level'}
              </p>
              <p className="text-sm text-gray-500 font-medium leading-relaxed pr-6">
                {mode === 'edit'
                  ? 'Update the employment level and its associated screening rules.'
                  : 'Define an employment level and its associated screening rules.'}
              </p>
            </div>
          </header>

          <form noValidate onSubmit={onSubmit} className="flex flex-1 flex-col overflow-hidden">
            <section className="flex-1 overflow-hidden">
              <SimpleBar forceVisible="y" style={{ maxHeight: '100%' }}>
                <div className="flex flex-col gap-6 px-6 py-6 bg-gray-50/30">
                  {/* Level Information card */}
                  <MyDoubleCard heading="Level Information" innerClassName="p-4">
                    <div className="flex flex-col gap-5">
                      <div className="flex flex-col gap-0.5">
                        <FieldLabel required>Employment Level Name</FieldLabel>
                        <MyTextField
                          name="levelName"
                          control={control}
                          placeholder="e.g. Kania Elfira"
                          errors={errors?.levelName?.message}
                        />
                      </div>

                      <div className="flex flex-col gap-0.5">
                        <FieldLabel required>Salary Range (from)</FieldLabel>
                        <MyTextField
                          name="salaryFrom"
                          control={control}
                          placeholder="e.g. Rp5,999,999"
                          errors={errors?.salaryFrom?.message}
                        />
                      </div>

                      <div className="flex flex-col gap-0.5">
                        <FieldLabel required>Salary Range (to)</FieldLabel>
                        <MyTextField
                          name="salaryTo"
                          control={control}
                          placeholder="e.g. Rp9,999,999"
                          errors={errors?.salaryTo?.message}
                        />
                      </div>
                    </div>
                  </MyDoubleCard>

                  {/* Screening Rules Card */}
                  <MyDoubleCard heading="Screening Rules" innerClassName="p-4">
                    <div className="flex flex-col gap-5">
                      {/* Consent Expiry */}
                      <Controller
                        name="consentExpiry"
                        control={control}
                        render={({ field }) => (
                          <MyCalendar
                            value={field.value}
                            onChange={field.onChange}
                            target={(isCalendarOpen, show) => (
                              <div className="flex flex-col gap-1.5">
                                <FieldLabel required>Consent Expiry</FieldLabel>
                                <button
                                  type="button"
                                  onClick={show}
                                  className={`flex items-center gap-3 w-full rounded-lg border px-3.5 py-2.5 text-left transition-all ${
                                    errors.consentExpiry
                                      ? 'border-red-300 ring-1 ring-red-300 shadow-[0_0_0_4px_rgba(240,68,56,0.24)]'
                                      : 'border-gray-300 hover:border-brand/400 hover:ring-4 hover:ring-brand/100'
                                  }`}
                                >
                                  <Calendar className="size-4 text-gray-400" />
                                  <div className="flex flex-1 flex-col overflow-hidden">
                                    {field.value ? (
                                      <span className="text-sm font-medium text-gray-900">
                                        {format(field.value, 'MMM d, yyyy')}
                                      </span>
                                    ) : (
                                      <span className="text-sm text-gray-400">Select date</span>
                                    )}
                                  </div>
                                  <XClose
                                    className="size-5 text-gray-400 rotate-[-90deg]"
                                    strokeWidth={2}
                                  />
                                </button>
                                {errors.consentExpiry && (
                                  <p className="text-xs text-red-500">
                                    {errors.consentExpiry.message}
                                  </p>
                                )}
                                <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
                                  Duration for which employee consent remains valid.
                                </p>
                              </div>
                            )}
                          />
                        )}
                      />

                      {/* Repeat Every */}
                      <SelectField
                        label="Repeat Every"
                        name="repeatEvery"
                        control={control}
                        options={REPEAT_EVERY_OPTIONS}
                        placeholder="Select interval"
                        errors={errors?.repeatEvery?.message ?? errors?.repeatEvery?.value?.message}
                        startAdornment={<RefreshCcw05 className="size-4 text-gray-400" />}
                        hintText="How often screening should be repeated for this employment level."
                        renderOption={(option) => (
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-900">
                              {option.label}
                            </span>
                            {option.subLabel && (
                              <span className="text-xs text-gray-500">{option.subLabel}</span>
                            )}
                          </div>
                        )}
                        focusColor="#7f56d9"
                        focusShadow="#7f56d93d"
                      />
                    </div>
                  </MyDoubleCard>
                </div>
              </SimpleBar>
            </section>

            {/* Footer */}
            <footer className="flex items-center justify-end gap-3 border-t border-gray-200 px-6 py-4 bg-white">
              <MyButton type="button" color="secondary" variant="outlined" size="md" onClick={animateClose}>
                Cancel
              </MyButton>

              <MyButton type="submit" color="primary" variant="filled" size="md" disabled={isSubmitting}>
                Submit
              </MyButton>
            </footer>
          </form>
        </div>
      </div>
    </>
  )
}
