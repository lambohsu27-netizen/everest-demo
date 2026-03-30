// Libraries
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller } from 'react-hook-form'
import SimpleBar from 'simplebar-react'
// UI Icons
import {
  XClose,
  FilePlus02,
  User01,
  Mail01,
  Building07,
  Briefcase02,
  Calendar,
  RefreshCw01,
  RefreshCcw05,
} from '@untitled-ui/icons-react'
// Shared Components
import {
  MyButton,
  MyTextField,
  MyAutocomplete,
  MyDoubleCard,
  MyHorizontalTabV2,
} from '@interstellar-component'
// Context
import { useReportEnquiry } from '../Context'

// ── validation schema ──────────────────────────────────────────────────────────
const schema = yup.object({
  category: yup.string().required('Category is required'),
  entity: yup
    .object({ label: yup.string(), value: yup.string() })
    .nullable()
    .required('Entity is required'),
  fullName: yup.string().required('Full name is required'),
  level: yup
    .object({ label: yup.string(), value: yup.string() })
    .nullable()
    .required('Level is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  consentExpiry: yup
    .object({ label: yup.string(), value: yup.string() })
    .nullable()
    .required('Consent expiry is required'),
  repeatEvery: yup
    .object({ label: yup.string(), value: yup.string() })
    .nullable()
    .required('Repeat every is required'),
})

// ── static options ────────────────────────────────────────────────────────────
const ENTITY_OPTIONS = [
  { label: 'PT Everest Maju Sejahtera', value: 'everest' },
  { label: 'PT Annapurna Tinggi Sejahtera', value: 'annapurna' },
]

const LEVEL_OPTIONS = [
  { label: 'Intern', value: 'intern' },
  { label: 'Staff', value: 'staff' },
  { label: 'Supervisor', value: 'supervisor' },
  { label: 'Manager', value: 'manager' },
  { label: 'Director', value: 'director' },
]

const CONSENT_EXPIRY_OPTIONS = [
  { label: 'One time request', value: 'one-time' },
  { label: '3 months', value: '3m' },
  { label: '6 months', value: '6m' },
  { label: '1 year', value: '1y' },
]

const REPEAT_EVERY_OPTIONS = [
  { label: 'None', value: 'none' },
  { label: 'Weekly', value: 'weekly' },
  { label: 'Monthly', value: 'monthly' },
  { label: 'Yearly', value: 'yearly' },
]

// ── helpers ────────────────────────────────────────────────────────────────────
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
      />
    </div>
  )
}

// ── main component ─────────────────────────────────────────────────────────────
function NewEnquirySlider() {
  const { handleCurrentSlider } = useReportEnquiry()

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      category: 'Candidate',
      entity: null,
      fullName: '',
      level: null,
      email: '',
      consentExpiry: { label: 'One time request', value: 'one-time' },
      repeatEvery: { label: 'None', value: 'none' },
    },
  })

  const onSubmit = handleSubmit(() => {
    // TODO: wire to real API
    handleCurrentSlider(null)
  })

  const handleClose = () => handleCurrentSlider(null)

  return (
    <div className="flex h-screen w-[420px] flex-col bg-white shadow-xl">
      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <header className="relative flex items-start gap-x-4 px-6 py-6 border-b border-gray-100">
        <button
          type="button"
          onClick={handleClose}
          className="absolute right-[12px] top-[12px] flex h-10 w-10 items-center justify-center rounded-lg p-2 text-gray-400 hover:bg-gray-50 active:bg-gray-100"
        >
          <XClose size={24} stroke="currentColor" />
        </button>

        {/* Title + subtitle */}
        <div className="flex flex-1 flex-col gap-1 pt-1">
          <p className="text-lg font-semibold text-gray-900">New Request</p>
          <p className="text-sm text-gray-500 font-medium">REQ-0000001</p>
        </div>
      </header>

      {/* ── Scrollable body ─────────────────────────────────────────────────── */}
      <form noValidate onSubmit={onSubmit} className="flex flex-1 flex-col overflow-hidden">
        <section className="flex-1 overflow-hidden">
          <SimpleBar forceVisible="y" style={{ maxHeight: '100%' }}>
            <div className="flex flex-col gap-6 px-6 py-6 bg-gray-50/30">
              {/* General Information card */}
              <MyDoubleCard heading="General Information" innerClassName="p-4">
                <div className="flex flex-col gap-5">
                  {/* Category toggle */}
                  <div className="flex flex-col gap-1.5">
                    <FieldLabel>Category</FieldLabel>
                    <Controller
                      name="category"
                      control={control}
                      render={({ field }) => (
                        <MyHorizontalTabV2
                          fitContent
                          value={field.value}
                          onChange={field.onChange}
                          tabs={[
                            { label: 'Candidate', value: 'Candidate' },
                            { label: 'Employee', value: 'Employee' },
                          ]}
                        />
                      )}
                    />
                    {errors.category && (
                      <p className="text-xs text-red-500 mt-0.5">{errors.category.message}</p>
                    )}
                  </div>

                  {/* Entity */}
                  <SelectField
                    label="Entity"
                    required
                    name="entity"
                    control={control}
                    options={ENTITY_OPTIONS}
                    placeholder="Select entity"
                    errors={errors?.entity?.message ?? errors?.entity?.value?.message}
                    startAdornment={<Building07 className="size-4 text-gray-400" />}
                  />

                  {/* Full name */}
                  <div className="flex flex-col gap-0.5">
                    <FieldLabel required>Full name</FieldLabel>
                    <MyTextField
                      name="fullName"
                      control={control}
                      placeholder="e.g. Kania Elfira"
                      errors={errors?.fullName?.message}
                      startAdornment={<User01 className="size-4 text-gray-400" />}
                    />
                  </div>

                  {/* Level */}
                  <SelectField
                    label="Level"
                    required
                    name="level"
                    control={control}
                    options={LEVEL_OPTIONS}
                    placeholder="Select level"
                    errors={errors?.level?.message ?? errors?.level?.value?.message}
                    startAdornment={<Briefcase02 className="size-4 text-gray-400" />}
                  />

                  {/* Email */}
                  <div className="flex flex-col gap-0.5">
                    <FieldLabel required>Email</FieldLabel>
                    <MyTextField
                      name="email"
                      control={control}
                      placeholder="e.g. kania.elfira@starling.com"
                      errors={errors?.email?.message}
                      startAdornment={<Mail01 className="size-4 text-gray-400" />}
                    />
                    <p className="text-xs text-gray-500 mt-1.5">
                      Used as an alternative method for sending the form link.
                    </p>
                  </div>
                </div>
              </MyDoubleCard>

              {/* Request option card */}
              <MyDoubleCard heading="Request option" innerClassName="p-4">
                <div className="flex flex-col gap-5">
                  {/* Consent Expiry */}
                  <SelectField
                    label="Consent Expiry"
                    name="consentExpiry"
                    control={control}
                    options={CONSENT_EXPIRY_OPTIONS}
                    placeholder="One time request"
                    errors={errors?.consentExpiry?.message ?? errors?.consentExpiry?.value?.message}
                    startAdornment={<Calendar className="size-4 text-gray-400" />}
                  />

                  {/* Repeat Every */}
                  <SelectField
                    label="Repeat Every"
                    name="repeatEvery"
                    control={control}
                    options={REPEAT_EVERY_OPTIONS}
                    placeholder="None"
                    errors={errors?.repeatEvery?.message ?? errors?.repeatEvery?.value?.message}
                    startAdornment={<RefreshCcw05 className="size-4 text-gray-400" />}
                  />
                </div>
              </MyDoubleCard>
            </div>
          </SimpleBar>
        </section>

        {/* ── Footer ──────────────────────────────────────────────────────────── */}
        <footer className="flex items-center justify-end gap-3 border-t border-gray-200 px-6 py-4">
          <MyButton
            type="button"
            color="secondary"
            variant="outlined"
            size="md"
            onClick={handleClose}
          >
            Cancel
          </MyButton>

          <MyButton
            type="submit"
            color="primary"
            variant="filled"
            size="md"
            disabled={isSubmitting}
          >
            Submit
          </MyButton>
        </footer>
      </form>
    </div>
  )
}

export default NewEnquirySlider
