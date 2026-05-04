import { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { Copy01, Mail01, Phone, RefreshCw04, XClose } from '@untitled-ui/icons-react'
import { MyButton, MyTextField, MyAsyncDropdown, MyAvatar, myToaster } from '@interstellar-component'
import { encryptPassword } from '@src/services/Helper'
import { useSettings } from '../../Context'

function generateRandomPassword(length = 16) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&*'
  let result = ''
  const array = new Uint8Array(length)
  crypto.getRandomValues(array)
  for (let i = 0; i < length; i++) result += chars[array[i] % chars.length]
  return result
}

/** Huruf (Unicode), angka, dan spasi saja (tanpa simbol). */
const NAME_CHAR_PATTERN = /^[\p{L}\p{N} ]+$/u

function sanitizeNameInput(value) {
  return String(value ?? '').replace(/[^\p{L}\p{N} ]/gu, '')
}

function getNameFieldError(value) {
  const raw = String(value ?? '')
  if (!raw.trim()) return 'Full name is required.'
  if (!NAME_CHAR_PATTERN.test(raw)) {
    return 'Full name may only contain letters, numbers, and spaces.'
  }
  return null
}

/** Huruf, angka, dan simbol umum alamat email. */
function sanitizeEmailInput(value) {
  return String(value ?? '').replace(/[^a-zA-Z0-9@._+-]/g, '')
}

const PHONE_MIN_DIGITS = 8
const PHONE_MAX_DIGITS = 15

/** Hanya angka (nomor telepon). */
function sanitizePhoneInput(value) {
  return String(value ?? '').replace(/\D/g, '').slice(0, PHONE_MAX_DIGITS)
}

function getPhoneFieldError(value) {
  const digits = String(value ?? '').replace(/\D/g, '')
  if (!digits) return 'Phone is required.'
  if (!digits.startsWith('62')) {
    return 'Phone must start with country code 62.'
  }
  if (digits.length < PHONE_MIN_DIGITS) {
    return `Phone must be at least ${PHONE_MIN_DIGITS} digits.`
  }
  if (digits.length > PHONE_MAX_DIGITS) {
    return `Phone must be at most ${PHONE_MAX_DIGITS} digits.`
  }
  return null
}

export default function UserForm({ mode }) {
  const {
    userDetail,
    closeUserPanel,
    openUserDetail,
    activePanelUserId,
    createUser,
    updateUser,
    searchOptionRoles,
    searchOptionCompanies,
  } = useSettings()

  const isEdit = mode === 'edit'

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [selectedRole, setSelectedRole] = useState(null)
  const [selectedCompanies, setSelectedCompanies] = useState([])
  const [isActive, setIsActive] = useState(true)
  const [avatarFile, setAvatarFile] = useState(null)
  const [avatarPreview, setAvatarPreview] = useState(null)
  const [deleteAvatar, setDeleteAvatar] = useState(false)
  const [password, setPassword] = useState('')

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const fileInputRef = useRef(null)

  // Populate form for edit mode
  useEffect(() => {
    if (isEdit && userDetail) {
      setName(sanitizeNameInput(userDetail.name ?? ''))
      setEmail(sanitizeEmailInput(userDetail.email ?? ''))
      setPhone(sanitizePhoneInput(userDetail.phone ?? ''))
      if (userDetail.role_id) {
        setSelectedRole({
          id: userDetail.role_id,
          name: userDetail.role?.name ?? '',
        })
      } else {
        setSelectedRole(null)
      }
      setIsActive(userDetail.is_active ?? true)
      setAvatarPreview(userDetail.avatar_url ? userDetail.avatar_full_url : null)
      const companies = userDetail.user_companies?.map((c) => ({
        id: c.company?.id,
        name: c.company?.name,
      })).filter((c) => c.id && c.name) ?? []
      setSelectedCompanies(companies)
    }
  }, [isEdit, userDetail])

  const handleBack = () => {
    if (isEdit) openUserDetail(activePanelUserId)
    else closeUserPanel()
  }

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setAvatarFile(file)
    setDeleteAvatar(false)
    setAvatarPreview(URL.createObjectURL(file))
  }

  const handleDeleteAvatar = () => {
    setAvatarFile(null)
    setAvatarPreview(null)
    setDeleteAvatar(true)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleGeneratePassword = () => {
    setPassword(generateRandomPassword())
  }

  const asyncRoleOptions = async (params) => {
    try {
      const data = await searchOptionRoles(params?.search ?? '')
      return { loading: false, data }
    } catch {
      return { loading: false, data: [] }
    }
  }

  const asyncCompanyOptions = async (params) => {
    try {
      const data = await searchOptionCompanies(params?.search ?? '')
      return { loading: false, data }
    } catch {
      return { loading: false, data: [] }
    }
  }

  const validate = () => {
    const errs = {}
    const nameErr = getNameFieldError(name)
    if (nameErr) errs.name = nameErr
    if (!email.trim()) errs.email = 'Email is required.'
    const phoneErr = getPhoneFieldError(phone)
    if (phoneErr) errs.phone = phoneErr
    if (!selectedRole) errs.roleId = 'Role is required.'
    if (!selectedCompanies?.length) errs.companyIds = 'Company is required.'
    if (!isEdit && !password) errs.password = 'Password is required. Click generate.'
    return errs
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setErrors({})
    setIsSubmitting(true)

    try {
      const formData = new FormData()
      formData.append('name', name.trim())
      formData.append('email', email.trim())
      formData.append('phone', phone.trim())
      formData.append('role_id', selectedRole?.id ?? '')
      formData.append('is_active', isActive ? 'true' : 'false')
      formData.append('company_ids', JSON.stringify(selectedCompanies.map((c) => c.id)))

      if (password) formData.append('password', encryptPassword(password))
      if (avatarFile) formData.append('avatar', avatarFile)
      if (deleteAvatar) formData.append('delete_avatar', 'true')

      if (isEdit) {
        await updateUser(activePanelUserId, formData)
      } else {
        await createUser(formData)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const clearError = (field) => {
    if (errors[field]) setErrors((prev) => { const n = { ...prev }; delete n[field]; return n })
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    myToaster({ message: 'Password copied to clipboard' })
  }

  return (
    <div className="flex h-screen w-[375px] flex-col">
      {/* Header */}
      <header className="relative px-6 py-6">
        <button
          type="button"
          onClick={closeUserPanel}
          className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-lg p-2 text-gray-light/400 hover:bg-gray-light/50"
        >
          <XClose size={24} stroke="currentColor" />
        </button>
        <div className="flex flex-col gap-0.5 pt-2">
          <h3 className="text-xl font-semibold leading-[30px] text-gray-900">
            {isEdit ? 'Edit user' : 'Add user'}
          </h3>
          <p className="text-base font-normal leading-6 text-gray-600">
            {isEdit
              ? 'Please provide the details you would like to edit.'
              : 'Please provide the details for a new user.'}
          </p>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="flex flex-1 flex-col overflow-hidden">
        <div className="flex flex-1 flex-col overflow-y-auto">
          {/* Access Card */}
          <div className="px-4">
            <div className="w-full rounded-xl border border-gray-200 bg-gray-25 shadow-xs">
              <div className="px-5 pb-2 pt-3">
                <span className="text-sm font-semibold leading-5 text-gray-900">Access</span>
              </div>
              <div className="rounded-xl border border-gray-200 bg-white shadow-xs">
                <div className="px-6 py-4">
                  <div className="flex items-start gap-2">
                    <button
                      type="button"
                      onClick={() => setIsActive((v) => !v)}
                      className={`relative mt-0.5 inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full transition-colors duration-200 ${isActive ? 'bg-brand/900' : 'bg-gray-200'}`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-xs transition-transform duration-200 ${isActive ? 'translate-x-[17px]' : 'translate-x-[2px]'} mt-[2px]`}
                      />
                    </button>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-sm font-medium leading-5 text-gray-700">Is active</span>
                      <span className="text-sm font-normal leading-5 text-gray-600">
                        User can login to the system.
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Personal Info Card */}
          <div className="mt-6 px-4">
            <div className="w-full rounded-xl border border-gray-200 bg-gray-25 shadow-xs">
              <div className="px-5 pb-2 pt-3">
                <span className="text-sm font-semibold leading-5 text-gray-900">Personal info</span>
              </div>
              <div className="rounded-xl border border-gray-200 bg-white pt-5 shadow-xs">
                <div className="flex flex-col gap-5 px-4 pb-5">
                  {/* Profile Photo */}
                  <div className="flex flex-col gap-1.5">
                    <p className="text-sm font-medium leading-5 text-gray-700">
                      Profile photo
                    </p>
                    <div className="flex items-center gap-4">
                      <MyAvatar size={64} photo={avatarFile ?? avatarPreview} />
                      <div className="ml-auto flex items-center gap-3">
                        <button
                          type="button"
                          onClick={handleDeleteAvatar}
                          className="text-sm font-semibold text-error/700 hover:text-error/800"
                        >
                          Delete
                        </button>
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="text-sm font-semibold text-brand/700 hover:text-brand/800"
                        >
                          Update
                        </button>
                      </div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".png,.jpeg,.jpg"
                        className="hidden"
                        onChange={handleAvatarChange}
                      />
                    </div>
                  </div>

                  {/* Full Name */}
                  <div className="flex flex-col gap-1.5">
                    <p className="text-sm font-medium leading-5 text-gray-700">
                      Full name <span className="text-brand/900">*</span>
                    </p>
                    <MyTextField
                      name="name"
                      value={name}
                      placeholder="e.g. Eve Leroy"
                      isError={!!errors.name}
                      helperText={errors.name || ''}
                      onChangeForm={(e) => {
                        const v = e.target.value
                        setName(v)
                        const err = getNameFieldError(v)
                        if (err) setErrors((prev) => ({ ...prev, name: err }))
                        else clearError('name')
                      }}
                      focusColor="#42307D"

                    />
                  </div>

                  {/* Email */}
                  <div className="flex flex-col gap-1.5">
                    <p className="text-sm font-medium leading-5 text-gray-700">
                      Email <span className="text-brand/900">*</span>
                    </p>
                    <MyTextField
                      name="email"
                      type='email'
                      value={email}
                      placeholder="e.g. eve.leroy@kalachakra.io"
                      isError={!!errors.email}
                      helperText={errors.email || ''}
                      onChangeForm={(e) => {
                        setEmail(sanitizeEmailInput(e.target.value))
                        clearError('email')
                      }}
                      focusColor="#42307D"

                      startAdornment={<Mail01 className="h-5 w-5 text-gray-500" />}
                    />
                  </div>

                  {/* Phone */}
                  <div className="flex flex-col gap-1.5">
                    <p className="text-sm font-medium leading-5 text-gray-700">
                      Phone <span className="text-brand/900">*</span>
                    </p>
                    <MyTextField
                      name="phone"
                      type="number"
                      inputMode="numeric"
                      value={phone}
                      placeholder="e.g. 6281788173723"
                      isError={!!errors.phone}
                      helperText={errors.phone || ''}
                      onChangeForm={(e) => {
                        const v = sanitizePhoneInput(e.target.value)
                        setPhone(v)
                        const err = getPhoneFieldError(v)
                        if (err) setErrors((prev) => ({ ...prev, phone: err }))
                        else clearError('phone')
                      }}
                      focusColor="#42307D"

                      startAdornment={<Phone className="h-5 w-5 text-gray-500" />}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Role & Company Card */}
          <div className="mt-6 px-4">
            <div className="w-full rounded-xl border border-gray-200 bg-gray-25 shadow-xs">
              <div className="px-5 pb-2 pt-3">
                <span className="text-sm font-semibold leading-5 text-gray-900">Role & Company</span>
              </div>
              <div className="rounded-xl border border-gray-200 bg-white pt-5 shadow-xs">
                <div className="flex flex-col gap-5 px-4 pb-5">
                  {/* Role Dropdown */}
                  <div className="flex flex-col gap-1.5">
                    <p className="text-sm font-medium leading-5 text-gray-700">
                      Role <span className="text-brand/900">*</span>
                    </p>
                    <MyAsyncDropdown
                      name="role"
                      asyncFunction={asyncRoleOptions}
                      value={selectedRole}
                      placeholder="Select role"
                      error={errors.roleId}
                      isOptionEqualToValue={(option, val) => option?.id === val?.id}
                      getOptionLabel={(e) => e?.name || ''}
                      onChange={(_e, val) => { setSelectedRole(val); clearError('roleId') }}
                    // focusColor="#42307D"

                    />
                  </div>

                  {/* Company Multi-select */}
                  <div className="flex flex-col gap-1.5">
                    <p className="text-sm font-medium leading-5 text-gray-700">
                      Company <span className="text-brand/900">*</span>
                    </p>
                    <MyAsyncDropdown
                      name="company"
                      multiple
                      asyncFunction={asyncCompanyOptions}
                      value={selectedCompanies}
                      placeholder="Search companies"
                      error={errors.companyIds}
                      isOptionEqualToValue={(option, val) => option?.id === val?.id}
                      getOptionLabel={(e) => e?.name || ''}
                      onChange={(_e, val) => {
                        setSelectedCompanies(val)
                        clearError('companyIds')
                      }}
                      focusColor="#42307D"

                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Password Card */}
          <div className="mb-6 mt-6 px-4">
            <div className="w-full rounded-xl border border-gray-200 bg-gray-25 shadow-xs">
              <div className="px-5 pb-2 pt-3">
                <span className="text-sm font-semibold leading-5 text-gray-900">Password</span>
              </div>
              <div className="rounded-xl border border-gray-200 bg-white pt-5 shadow-xs">
                <div className="flex flex-col gap-3 px-4 pb-5">
                  <div className="flex items-center gap-2">
                    <div className="flex-1">
                      <MyTextField
                        name="password"
                        value={password}
                        placeholder="Click generate to update"
                        disabled
                        isError={!!errors.password}
                        helperText={errors.password || ''}
                        focusColor="#42307D"

                      />
                    </div>
                    <button
                      type="button"
                      disabled={!password?.trim()}
                      onClick={() => copyToClipboard(password)}
                      className="text-sm font-semibold text-brand/700 hover:text-brand/800 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:text-brand/700"
                    >
                      <Copy01 className="ml-3 size-5" stroke="currentColor" />
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={handleGeneratePassword}
                    className="inline-flex items-center gap-1.5 self-start text-sm font-semibold text-brand/700 hover:text-brand/800"
                  >
                    <RefreshCw04 className="h-4 w-4" stroke="currentColor" />
                    Generate
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-gray-200 px-4 py-3">
          <MyButton
            color="secondary"
            size="md"
            variant="outlined"
            type="button"
            onClick={handleBack}
          >
            Cancel
          </MyButton>
          <MyButton
            color="primary"
            size="md"
            variant="filled"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Submit'}
          </MyButton>
        </div>
      </form>
    </div>
  )
}

UserForm.propTypes = {
  mode: PropTypes.oneOf(['create', 'edit']).isRequired,
}
