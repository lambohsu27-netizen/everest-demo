// Libraries
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller, useWatch } from 'react-hook-form'
import SimpleBar from 'simplebar-react'
// UI Icons
import {
  XClose,
  User01,
  Mail01,
  Building07,
  Briefcase02,
  Calendar,
  RefreshCcw05,
  Edit01,
} from '@untitled-ui/icons-react'
// Shared Components
import {
  MyButton,
  MyTextField,
  MyAutocomplete,
  MyDoubleCard,
  MyHorizontalTabV2,
  WhatsApp,
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
  fullName: yup.mixed().required('Full name is required'),
  level: yup
    .object({ label: yup.string(), value: yup.string() })
    .nullable()
    .required('Level is required'),
  position: yup
    .object({ label: yup.string(), value: yup.string() })
    .nullable()
    .when('category', {
      is: 'Employee',
      then: (yupSchema) => yupSchema.required('Position is required'),
      otherwise: (yupSchema) => yupSchema.optional(),
    }),
  whatsapp: yup.string().when('category', {
    is: 'Employee',
    then: (yupSchema) => yupSchema.required('WhatsApp is required'),
    otherwise: (yupSchema) => yupSchema.optional(),
  }),
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

const POSITION_OPTIONS = [
  { label: 'Product Designer', value: 'product-designer' },
  { label: 'Frontend Engineer', value: 'frontend-engineer' },
  { label: 'Backend Engineer', value: 'backend-engineer' },
  { label: 'HR Manager', value: 'hr-manager' },
]

const EMPLOYEE_OPTIONS = [
  {
    label: 'Phoenix Baker',
    value: '1',
    supportingText: 'Product Manager',
    email: 'phoenix.baker@everest.com',
    entity: { label: 'PT Everest Maju Sejahtera', value: 'everest' },
    level: { label: 'Supervisor', value: 'supervisor' },
    position: { label: 'Product Designer', value: 'product-designer' },
    whatsapp: '08123456789',
  },
  {
    label: 'Lana Steiner',
    value: '2',
    supportingText: 'Frontend Engineer',
    email: 'lana.steiner@everest.com',
    entity: { label: 'PT Everest Maju Sejahtera', value: 'everest' },
    level: { label: 'Staff', value: 'staff' },
    position: { label: 'Software Engineer', value: 'software-engineer' },
    whatsapp: '08123456780',
  },
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
  renderOption,
  getOptionLabel,
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
        renderOption={renderOption}
        getOptionLabel={getOptionLabel}
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
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      category: 'Candidate',
      entity: null,
      fullName: '',
      level: null,
      position: null,
      whatsapp: '',
      email: '',
      consentExpiry: null,
      repeatEvery: null,
    },
  })

  const category = useWatch({ control, name: 'category' })

  const onSubmit = handleSubmit(() => {
    // TODO: wire to real API
    handleCurrentSlider(null)
  })

  const handleClose = () => handleCurrentSlider(null)

  const handleEmployeeChange = (e, val) => {
    if (val) {
      setValue('entity', val.entity)
      setValue('level', val.level)
      setValue('position', val.position)
      setValue('whatsapp', val.whatsapp)
      setValue('email', val.email)
    }
  }

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
                    <FieldLabel>Target</FieldLabel>
                    <Controller
                      name="category"
                      control={control}
                      render={({ field }) => (
                        <MyHorizontalTabV2
                          fitContent
                          value={field.value}
                          onChange={(val) => {
                            field.onChange(val)
                            // Clear fields when toggling
                            setValue('fullName', '')
                            setValue('entity', null)
                            setValue('level', null)
                            setValue('position', null)
                            setValue('whatsapp', '')
                            setValue('email', '')
                          }}
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

                  {/* Full name - Searchable if Employee, text if Candidate */}
                  <div className="flex flex-col gap-0.5">
                    <FieldLabel required>Full name</FieldLabel>
                    {category === 'Employee' ? (
                      <Controller
                        name="fullName"
                        control={control}
                        render={({ field: { onChange, value } }) => (
                          <MyAutocomplete
                            name="fullName"
                            control={control}
                            options={EMPLOYEE_OPTIONS}
                            placeholder="Search employee"
                            value={value}
                            onChange={(e, val) => {
                              onChange(val)
                              handleEmployeeChange(e, val)
                            }}
                            errors={errors.fullName?.message}
                            renderOption={(option) => (
                              <div className="flex items-center gap-3">
                                <div className="size-8 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200">
                                  <User01 className="size-4 text-gray-500" />
                                </div>
                                <div className="flex flex-col">
                                  <span className="text-sm font-medium text-gray-900">
                                    {option.label}
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    {option.supportingText}
                                  </span>
                                </div>
                              </div>
                            )}
                          />
                        )}
                      />
                    ) : (
                      <MyTextField
                        name="fullName"
                        control={control}
                        placeholder="e.g. Kania Elfira"
                        errors={errors?.fullName?.message}
                        startAdornment={<User01 className="size-4 text-gray-400" />}
                      />
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

                  {/* Position (Employee only) */}
                  {category === 'Employee' && (
                    <SelectField
                      label="Position"
                      required
                      name="position"
                      control={control}
                      options={POSITION_OPTIONS}
                      placeholder="Select position"
                      errors={errors?.position?.message ?? errors?.position?.value?.message}
                      startAdornment={<Building07 className="size-4 text-gray-400" />}
                    />
                  )}

                  {/* WhatsApp (Employee only) */}
                  {category === 'Employee' && (
                    <div className="flex flex-col gap-0.5">
                      <FieldLabel required>WhatsApp</FieldLabel>
                      <MyTextField
                        name="whatsapp"
                        control={control}
                        placeholder="e.g. 0817766544"
                        errors={errors?.whatsapp?.message}
                        startAdornment={<WhatsApp className="size-4 text-green-500" />}
                      />
                    </div>
                  )}

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
                    <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
                      {category === 'Employee'
                        ? 'This email will be used to send the Credit Report form link to the employee.'
                        : 'Used as an alternative method for sending the form link.'}
                    </p>
                  </div>

                  {/* Edit action for employee */}
                  {category === 'Employee' && (
                    <button
                      type="button"
                      className="flex items-center gap-2 text-sm font-semibold text-brand/700 hover:text-brand/800 w-max"
                    >
                      <Edit01 className="size-4" />
                      Edit employee details
                    </button>
                   )}
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
                    placeholder="Select date"
                    errors={errors?.consentExpiry?.message ?? errors?.consentExpiry?.value?.message}
                    startAdornment={<Calendar className="size-4 text-gray-400" />}
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
