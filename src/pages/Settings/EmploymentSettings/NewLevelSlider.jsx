import React, { useEffect, useState } from 'react'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller } from 'react-hook-form'
import SimpleBar from 'simplebar-react'
import { XClose, Calendar, RefreshCcw05 } from '@untitled-ui/icons-react'
import { format, isValid, parseISO } from 'date-fns'
import {
  MyButton,
  MyTextField,
  MyAsyncDropdown,
  MyCalendar,
} from '@interstellar-component'
import { checkErrorYup, handleError } from '@src/services/Helper'
import { useEmploymentSettings } from './Context'

const schema = yup.object({
  name: yup.string().required('Employment Level Name is required'),
  salary_from: yup.string().required('Salary Range (from) is required'),
  salary_to: yup.string().required('Salary Range (to) is required'),
  currency: yup.string().default('IDR'),
  consent_expiry: yup.date().nullable().required('Consent Expiry is required'),
  repeat_every: yup
    .object({ label: yup.string(), value: yup.string() })
    .nullable()
    .required('Repeat Every is required'),
  is_active: yup.boolean().default(true),
})

const REPEAT_EVERY_OPTIONS = [
  { label: 'Monthly', value: 'monthly', subLabel: 'every 1 month' },
  { label: 'Bi-monthly', value: 'bi-monthly', subLabel: 'every 2 months' },
  { label: 'Quarterly', value: 'quarterly', subLabel: 'every 3 months' },
  { label: 'Semiannual', value: 'semiannual', subLabel: 'every 6 months' },
  { label: 'Annual', value: 'annual', subLabel: 'yearly' },
]

/** Kontrak async MyAsyncDropdown: resolve { loading, data } */
function asyncRepeatEveryOptions(params) {
  const q = (params?.search ?? '').toLowerCase().trim()
  const data = REPEAT_EVERY_OPTIONS.filter((o) => {
    if (!q) return true
    return (
      o.label.toLowerCase().includes(q) ||
      (o.subLabel && o.subLabel.toLowerCase().includes(q)) ||
      String(o.value).toLowerCase().includes(q)
    )
  })
  return Promise.resolve({ loading: false, data })
}

function formatSalaryFieldForForm(val) {
  if (val == null || val === '') return ''
  const n = Number(String(val).replace(/\D/g, ''))
  if (Number.isNaN(n)) return ''
  return `Rp${n.toLocaleString('en-US', { maximumFractionDigits: 0 })}`
}

/** Saat mengetik / paste: hanya digit yang dipakai; tampilan Rp + pemisah ribuan. */
function formatSalaryInputValue(raw) {
  const digits = String(raw ?? '').replace(/\D/g, '')
  if (digits === '') return ''
  const n = Number(digits)
  if (!Number.isFinite(n) || n < 0) return ''
  return `Rp${n.toLocaleString('en-US', { maximumFractionDigits: 0 })}`
}

function salaryRupiahFieldClassName(hasError) {
  return [
    'w-full rounded-lg border px-3.5 py-2.5 text-sm text-gray-900 shadow-sm transition-colors placeholder:text-gray-400 focus:outline-none',
    hasError
      ? 'border-red-300 ring-1 ring-red-300'
      : 'border-gray-300 focus:border-brand/400 focus:ring-4 focus:ring-brand/100',
  ].join(' ')
}

function matchRepeatOption(repeatRaw) {
  if (repeatRaw == null || repeatRaw === '') return null
  const s = String(repeatRaw).toLowerCase().trim()
  const byValue = REPEAT_EVERY_OPTIONS.find((o) => o.value === s)
  if (byValue) return byValue
  const byLabel = REPEAT_EVERY_OPTIONS.find((o) => o.label.toLowerCase() === s)
  if (byLabel) return byLabel

  const lower = s
  if (lower.includes('month') && !lower.includes('3') && !lower.includes('6') && !lower.includes('2'))
    return REPEAT_EVERY_OPTIONS[0]
  if (lower.includes('2 month') || lower.includes('bi')) return REPEAT_EVERY_OPTIONS[1]
  if (lower.includes('3 month') || lower.includes('quarter')) return REPEAT_EVERY_OPTIONS[2]
  if (lower.includes('6 month') || lower.includes('semi')) return REPEAT_EVERY_OPTIONS[3]
  if (lower.includes('year') || lower.includes('annual')) return REPEAT_EVERY_OPTIONS[4]
  return null
}

function parseConsentExpiryDate(raw) {
  if (raw == null || raw === '') return null
  if (raw instanceof Date) {
    return Number.isNaN(raw.getTime()) ? null : raw
  }
  if (typeof raw === 'string') {
    const trimmed = raw.trim()
    let d = trimmed.includes('T') ? parseISO(trimmed) : parseISO(trimmed.slice(0, 10))
    if (isValid(d)) return d
    d = new Date(trimmed)
    return Number.isNaN(d.getTime()) ? null : d
  }
  const d = new Date(raw)
  return Number.isNaN(d.getTime()) ? null : d
}

function mapApiRowToFormValues(initialData) {
  if (!initialData) return null
  const name =
    initialData.name ??
    initialData.level ??
    initialData.level_name ??
    initialData.employment_level_name ??
    ''

  let salary_from = ''
  let salary_to = ''
  if (initialData.salary_from != null || initialData.salary_to != null) {
    salary_from = formatSalaryFieldForForm(initialData.salary_from)
    salary_to = formatSalaryFieldForForm(initialData.salary_to)
  } else if (initialData.salaryRange) {
    const salaryParts = String(initialData.salaryRange).split(' - ')
    salary_from = salaryParts[0]?.trim() || ''
    salary_to = salaryParts[1]?.trim() || ''
  } else if (initialData.salary_from_text || initialData.salary_to_text) {
    salary_from = initialData.salary_from_text ?? ''
    salary_to = initialData.salary_to_text ?? ''
  }

  const repeatRaw =
    initialData.repeat_every ?? initialData.repeat_every_value ?? initialData.repeatEvery
  const repeat_every = matchRepeatOption(repeatRaw)

  const rawConsent =
    initialData.consent_expiry ?? initialData.consent_expiry_at ?? initialData.consentExpiry
  const consent_expiry = parseConsentExpiryDate(rawConsent)

  return {
    name,
    salary_from,
    salary_to,
    currency: initialData.currency ?? 'IDR',
    consent_expiry,
    repeat_every,
    is_active: initialData.is_active !== undefined ? Boolean(initialData.is_active) : true,
  }
}

export default function NewLevelSlider({
  open,
  mode = 'create',
  initialData,
  onClose,
  inModalSlider = false,
}) {
  const [isVisible, setIsVisible] = useState(false)
  const { createEmploymentLevel, updateEmploymentLevel, setErr } = useEmploymentSettings()

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
    reset,
    trigger,
  } = useForm({
    mode: 'all',
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      salary_from: '',
      salary_to: '',
      currency: 'IDR',
      consent_expiry: null,
      repeat_every: null,
      is_active: true,
    },
  })

  const repeatEveryValue = watch('repeat_every')

  useEffect(() => {
    if (open) {
      if (mode === 'edit') {
        if (initialData) {
          const mapped = mapApiRowToFormValues(initialData)
          if (mapped) reset(mapped)
        }
      } else {
        reset({
          name: '',
          salary_from: '',
          salary_to: '',
          currency: 'IDR',
          consent_expiry: null,
          repeat_every: null,
          is_active: true,
        })
      }
      const frame = requestAnimationFrame(() => setIsVisible(true))
      return () => cancelAnimationFrame(frame)
    }
    setIsVisible(false)
    return undefined
  }, [open, mode, initialData, reset])

  useEffect(() => () => setErr(null), [setErr])

  const animateClose = () => {
    if (inModalSlider) {
      onClose()
      reset()
      return
    }
    setIsVisible(false)
    setTimeout(() => {
      onClose()
      reset()
    }, 300)
  }

  const onSubmit = handleSubmit(
    handleError(
      async (data) => {
        if (mode === 'edit') {
          await updateEmploymentLevel(data)
        } else {
          await createEmploymentLevel(data)
        }
        animateClose()
      },
      control
    ),
    checkErrorYup
  )

  if (inModalSlider) {
    if (!open) return null
  } else if (!open && !isVisible) {
    return null
  }

  const title =
    mode === 'edit' && initialData?.name
      ? initialData.name
      : mode === 'edit'
        ? 'Edit Employment Level'
        : 'New Employment Level'

  const formClassName = inModalSlider
    ? 'flex h-full min-h-0 w-[420px] flex-col overflow-hidden bg-white'
    : 'flex h-screen w-[420px] flex-col bg-white shadow-xl'

  const formEl = (
    <form noValidate className={formClassName} onSubmit={onSubmit}>
          <header className="relative flex items-start gap-x-4 px-4 pt-6">
            <button
              type="button"
              aria-label="Close"
              onClick={animateClose}
              className="absolute right-[12px] top-[12px] flex h-11 w-11 items-center justify-center rounded-lg p-2 text-gray-light/400 hover:bg-gray-50"
            >
              <XClose className="size-6" stroke="currentColor" />
            </button>

            <div className="flex flex-1 flex-col gap-6 pr-10">
              <section className="flex flex-col gap-1">
                <p className="text-xl-semibold text-gray-light/900">{title}</p>
                <p className="text-sm-regular text-gray-light/600">
                  {mode === 'edit'
                    ? 'Update the employment level and its associated screening rules.'
                    : 'Define an employment level and its associated screening rules. Complete the information below.'}
                </p>
              </section>
            </div>
          </header>

          <hr className="mx-0 my-6 border-gray-light/200" />

          <section className="min-h-0 flex-1 overflow-hidden">
            <SimpleBar forceVisible="y" style={{ height: '100%' }}>
              <div className="flex flex-col gap-6 px-4 pb-6">
                <div className="mt-0.5 rounded-xl bg-gray/25 shadow-sm outline outline-1 outline-gray-200">
                  <span className="text-sm-semibold block px-4 pb-2 pt-3 text-gray-900">
                    Level Information
                  </span>
                  <div className="flex flex-col gap-4 rounded-xl bg-white px-4 py-5 outline outline-1 outline-gray-200">
                    <div className="flex flex-col gap-1.5">
                      <label
                        className="block text-sm font-medium text-gray-700 after:ml-0.5 after:text-blue-500 after:content-['*']"
                        htmlFor="employment-level-name"
                      >
                        Employment Level Name
                      </label>
                      <MyTextField
                        name="name"
                        control={control}
                        placeholder="e.g. Senior Manager"
                        errors={errors?.name?.message}
                        onChangeForm={() => setErr(null)}
                        cypress="employment-level-name"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label
                        className="block text-sm font-medium text-gray-700 after:ml-0.5 after:text-blue-500 after:content-['*']"
                        htmlFor="salary-from"
                      >
                        Salary Range (from)
                      </label>
                      <Controller
                        name="salary_from"
                        control={control}
                        render={({ field }) => (
                          <>
                            <input
                              {...field}
                              id="salary-from"
                              type="text"
                              inputMode="numeric"
                              autoComplete="off"
                              data-test="salary-from"
                              placeholder="e.g. Rp5,999,999"
                              value={field.value ?? ''}
                              onChange={(e) => {
                                setErr(null)
                                field.onChange(formatSalaryInputValue(e.target.value))
                              }}
                              className={salaryRupiahFieldClassName(Boolean(errors?.salary_from))}
                              aria-invalid={errors?.salary_from ? 'true' : 'false'}
                            />
                            {errors?.salary_from?.message && (
                              <p className="mt-1 text-xs text-red-500">{errors.salary_from.message}</p>
                            )}
                          </>
                        )}
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label
                        className="block text-sm font-medium text-gray-700 after:ml-0.5 after:text-blue-500 after:content-['*']"
                        htmlFor="salary-to"
                      >
                        Salary Range (to)
                      </label>
                      <Controller
                        name="salary_to"
                        control={control}
                        render={({ field }) => (
                          <>
                            <input
                              {...field}
                              id="salary-to"
                              type="text"
                              inputMode="numeric"
                              autoComplete="off"
                              data-test="salary-to"
                              placeholder="e.g. Rp9,999,999"
                              value={field.value ?? ''}
                              onChange={(e) => {
                                setErr(null)
                                field.onChange(formatSalaryInputValue(e.target.value))
                              }}
                              className={salaryRupiahFieldClassName(Boolean(errors?.salary_to))}
                              aria-invalid={errors?.salary_to ? 'true' : 'false'}
                            />
                            {errors?.salary_to?.message && (
                              <p className="mt-1 text-xs text-red-500">{errors.salary_to.message}</p>
                            )}
                          </>
                        )}
                      />
                    </div>

                    {/* <div className="flex flex-col gap-1.5">
                      <label
                        className="block text-sm font-medium text-gray-700"
                        htmlFor="employment-level-currency"
                      >
                        Currency
                      </label>
                      <MyTextField
                        name="currency"
                        control={control}
                        placeholder="IDR"
                        disabled
                        errors={errors?.currency?.message}
                        cypress="employment-level-currency"
                      />
                    </div> */}

                    {/* <div className="flex items-center justify-between gap-4 rounded-lg border border-gray-200 px-3 py-2.5">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-sm font-medium text-gray-900">Active</span>
                        <span className="text-xs text-gray-500">
                          When off, this employment level is inactive.
                        </span>
                      </div>
                      <MySwitch name="is_active" control={control} />
                    </div> */}
                  </div>
                </div>

                <div className="mb-0.5 mt-0.5 rounded-xl bg-gray/25 shadow-sm outline outline-1 outline-gray-200">
                  <span className="text-sm-semibold block px-4 pb-2 pt-3 text-gray-900">
                    Screening Rules
                  </span>
                  <div className="flex flex-col gap-4 rounded-xl bg-white px-4 py-5 outline outline-1 outline-gray-200">
                    <Controller
                      name="consent_expiry"
                      control={control}
                      render={({ field }) => (
                        <MyCalendar
                          value={field.value}
                          onChange={field.onChange}
                          target={(isCalendarOpen, show) => (
                            <div className="flex flex-col gap-1.5">
                              <label
                                className="block text-sm font-medium text-gray-700 after:ml-0.5 after:text-blue-500 after:content-['*']"
                                htmlFor="consent-expiry-trigger"
                              >
                                Consent Expiry
                              </label>
                              <button
                                id="consent-expiry-trigger"
                                type="button"
                                onClick={show}
                                className={`flex w-full items-center gap-3 rounded-lg border px-3.5 py-2.5 text-left transition-all ${
                                  errors.consent_expiry
                                    ? 'border-red-300 ring-1 ring-red-300 shadow-[0_0_0_4px_rgba(240,68,56,0.24)]'
                                    : 'border-gray-300 hover:border-brand/400 hover:ring-4 hover:ring-brand/100'
                                }`}
                              >
                                <Calendar className="size-4 text-gray-400" />
                                <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
                                  {field.value ? (
                                    <span className="text-sm font-medium text-gray-900">
                                      {format(field.value, 'MMM d, yyyy')}
                                    </span>
                                  ) : (
                                    <span className="text-sm text-gray-400">Select date</span>
                                  )}
                                </div>
                                <XClose
                                  className="size-5 rotate-[-90deg] text-gray-400"
                                  strokeWidth={2}
                                />
                              </button>
                              {errors.consent_expiry && (
                                <p className="text-xs text-red-500">{errors.consent_expiry.message}</p>
                              )}
                              <p className="mt-1.5 text-xs leading-relaxed text-gray-500">
                                Duration for which employee consent remains valid.
                              </p>
                            </div>
                          )}
                        />
                      )}
                    />

                    <div className="flex flex-col gap-1.5">
                      <label
                        className="block text-sm font-medium text-gray-700 after:ml-0.5 after:text-blue-500 after:content-['*']"
                        htmlFor="repeat-every"
                      >
                        Repeat Every
                      </label>
                      <MyAsyncDropdown
                        name="repeat_every"
                        control={control}
                        value={repeatEveryValue}
                        trigger={trigger}
                        asyncFunction={asyncRepeatEveryOptions}
                        placeholder="Select interval"
                        startAdornment={<RefreshCcw05 className="size-4 text-gray-400" />}
                        error={errors?.repeat_every?.message}
                        getOptionLabel={(option) => option?.label ?? ''}
                        isOptionEqualToValue={(a, b) => a?.value === b?.value}
                        onChange={(_e, v) => {
                          setErr(null)
                          setValue('repeat_every', v, {
                            shouldValidate: true,
                            shouldDirty: true,
                          })
                        }}
                        renderOption={(option) => (
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-900">{option.label}</span>
                            {option.subLabel && (
                              <span className="text-xs text-gray-500">{option.subLabel}</span>
                            )}
                          </div>
                        )}
                        focusColor="#42307D"
                         
                      />
                      <p className="mt-1.5 text-xs leading-relaxed text-gray-500">
                        How often screening should be repeated for this employment level.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </SimpleBar>
          </section>

          <footer className="flex items-center justify-end gap-4 border-t border-gray-light/200 bg-white px-4 py-4">
            <MyButton
              disabled={isSubmitting}
              type="button"
              color="secondary"
              variant="outlined"
              size="md"
              onClick={animateClose}
            >
              <span className="text-sm-semibold">Cancel</span>
            </MyButton>
            <MyButton
              type="submit"
              color="primary"
              variant="filled"
              size="md"
              disabled={isSubmitting}
              cypress="submit-employment-level"
            >
              <span className="text-sm-semibold">Submit</span>
            </MyButton>
          </footer>
    </form>
  )

  if (inModalSlider) {
    return formEl
  }

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
        {formEl}
      </div>
    </>
  )
}
