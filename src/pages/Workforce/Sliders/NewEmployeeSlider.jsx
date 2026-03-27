// Libraries
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller } from 'react-hook-form'
import SimpleBar from 'simplebar-react'
// UI Icons
import { XClose, UserPlus01, User01, Mail01 } from '@untitled-ui/icons-react'
// Shared Components
import { MyButton, MyTextField, MyAutocomplete, MyDoubleCard, MyHorizontalTabV2, WhatsApp } from '@interstellar-component'
// Context
import { useWorkforce } from '../Context'

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
  position: yup
    .object({ label: yup.string(), value: yup.string() })
    .nullable()
    .required('Position is required'),
  whatsapp: yup.string().required('WhatsApp number is required'),
  email: yup.string().email('Invalid email').optional(),
})

// ── static options (swap with real API calls later) ────────────────────────────
const ENTITY_OPTIONS = [
  { label: 'PT Everest Maju Sejahtera', value: 'everest' },
  { label: 'PT Annapurna Berdiri Tinggi', value: 'annapurna' },
]

const LEVEL_OPTIONS = [
  { label: 'Intern', value: 'intern' },
  { label: 'Staff', value: 'staff' },
  { label: 'Supervisor', value: 'supervisor' },
  { label: 'Manager', value: 'manager' },
  { label: 'Director', value: 'director' },
]

const POSITION_OPTIONS = [
  { label: 'Operations Supervisor', value: 'ops-supervisor' },
  { label: 'Administrative Staff', value: 'admin-staff' },
  { label: 'HR Manager', value: 'hr-manager' },
  { label: 'Finance Director', value: 'finance-director' },
  { label: 'Marketing Director', value: 'marketing-director' },
]

// ── helpers ────────────────────────────────────────────────────────────────────
/** Inline label for form fields */
function FieldLabel({ children, required }) {
  return (
    <p className="text-sm-medium text-gray/700 mb-1">
      {children}
      {required && <span className="ml-0.5 text-error/500">*</span>}
    </p>
  )
}

/** Compact select built on MyAutocomplete */
function SelectField({ label, required, name, control, options, placeholder, errors }) {
  return (
    <div className="flex flex-col gap-0.5">
      <FieldLabel required={required}>{label}</FieldLabel>
      <MyAutocomplete
        name={name}
        control={control}
        options={options}
        placeholder={placeholder}
        errors={errors}
      />
    </div>
  )
}

// ── main component ─────────────────────────────────────────────────────────────
function NewEmployeeSlider() {
  const { handleCurrentSlider } = useWorkforce()

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
      position: null,
      whatsapp: '',
      email: '',
    },
  })

  const onSubmit = handleSubmit(() => {
    // TODO: wire to real API
    handleCurrentSlider(null)
  })

  const handleClose = () => handleCurrentSlider(null)

  return (
    <div className="flex h-screen w-[420px] flex-col">
      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <header className="relative flex items-start gap-x-4 px-6 py-6 border-b border-gray/100">
        <button
          type="button"
          onClick={handleClose}
          className="absolute right-[12px] top-[12px] flex h-10 w-10 items-center justify-center rounded-lg p-2 text-gray-light/400 hover:bg-gray-light/50 active:bg-gray-light/100"
        >
          <XClose size={24} stroke="currentColor" />
        </button>

        {/* Icon badge */}
        <div className="z-0 rounded-lg border border-gray/300 bg-white p-2.5 shadow-shadows/shadow-xs-skeuomorphic shrink-0">
          <UserPlus01 className="size-5 text-gray/700" />
        </div>

        {/* Title + subtitle */}
        <div className="flex flex-1 flex-col gap-1 pt-1">
          <p className="text-lg-semibold text-gray/900">New employee</p>
          <p className="text-sm-regular text-gray/600">
            Enter employee details to save them in the system.
          </p>
        </div>
      </header>

      {/* ── Scrollable body ─────────────────────────────────────────────────── */}
      <form noValidate onSubmit={onSubmit} className="flex flex-1 flex-col overflow-hidden">
        <section className="flex-1 overflow-hidden">
          <SimpleBar forceVisible="y" style={{ maxHeight: '100%' }}>
            <div className="flex flex-col gap-6 px-6 py-6">

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
                      <p className="text-xs text-error/500 mt-0.5">{errors.category.message}</p>
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
                  />

                  {/* Full name */}
                  <div className="flex flex-col gap-0.5">
                    <FieldLabel required>Full name</FieldLabel>
                    <MyTextField
                      name="fullName"
                      control={control}
                      placeholder="e.g. Kania Elfira"
                      errors={errors?.fullName?.message}
                      startAdornment={<User01 className="size-4 text-gray/400" />}
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
                  />

                  {/* Position */}
                  <SelectField
                    label="Position"
                    required
                    name="position"
                    control={control}
                    options={POSITION_OPTIONS}
                    placeholder="Select position"
                    errors={errors?.position?.message ?? errors?.position?.value?.message}
                  />

                  {/* WhatsApp */}
                  <div className="flex flex-col gap-0.5">
                    <FieldLabel required>WhatsApp</FieldLabel>
                    <MyTextField
                      name="whatsapp"
                      control={control}
                      placeholder="e.g. 0817766544"
                      errors={errors?.whatsapp?.message}
                      startAdornment={<WhatsApp className="size-4 text-success/500" />}
                    />
                  </div>

                  {/* Email */}
                  <div className="flex flex-col gap-0.5">
                    <FieldLabel>Email</FieldLabel>
                    <MyTextField
                      name="email"
                      control={control}
                      placeholder="e.g. kania.elfira@starling.com"
                      errors={errors?.email?.message}
                      startAdornment={<Mail01 className="size-4 text-gray/400" />}
                    />
                    <p className="text-xs-regular text-gray/500 mt-0.5">
                      Used as an alternative method for sending the form link.
                    </p>
                  </div>

                </div>
              </MyDoubleCard>

            </div>
          </SimpleBar>
        </section>

        {/* ── Footer ──────────────────────────────────────────────────────────── */}
        <footer className="flex items-center justify-end gap-3 border-t border-gray/200 px-6 py-4">
          <MyButton
            type="button"
            color="secondary"
            variant="outlined"
            size="md"
            onClick={handleClose}
          >
            <p className="text-sm-semibold">Cancel</p>
          </MyButton>

          <MyButton
            type="submit"
            color="primary"
            variant="filled"
            size="md"
            disabled={isSubmitting}
          >
            <p className="text-sm-semibold">Submit</p>
          </MyButton>
        </footer>
      </form>
    </div>
  )
}

export default NewEmployeeSlider
