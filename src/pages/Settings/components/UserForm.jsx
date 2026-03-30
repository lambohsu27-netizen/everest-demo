import { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { Copy01, Mail01, Phone, RefreshCw04, XClose } from '@untitled-ui/icons-react'
import { MyButton, MyTextField, MyAutocomplete, MyAvatar, myToaster } from '@interstellar-component'
import { encryptPassword } from '@src/services/Helper'
import { useSettings } from '../Context'

function generateRandomPassword(length = 16) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&*'
  let result = ''
  const array = new Uint8Array(length)
  crypto.getRandomValues(array)
  for (let i = 0; i < length; i++) result += chars[array[i] % chars.length]
  return result
}

export default function UserForm({ mode }) {
  const {
    userDetail,
    closeUserPanel,
    openUserDetail,
    activePanelUserId,
    createUser,
    updateUser,
    roles,
    fetchRoles,
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
  const [isVisible, setIsVisible] = useState(false)

  const fileInputRef = useRef(null)

  useEffect(() => {
    const frame = requestAnimationFrame(() => setIsVisible(true))
    return () => cancelAnimationFrame(frame)
  }, [])

  // Fetch roles for the dropdown
  useEffect(() => {
    if (roles.length === 0) fetchRoles(1, '')
  }, [roles.length, fetchRoles])

  // Populate form for edit mode
  useEffect(() => {
    if (isEdit && userDetail) {
      setName(userDetail.name ?? '')
      setEmail(userDetail.email ?? '')
      setPhone(userDetail.phone ?? '')
      const matchedRole = roles.find((r) => r.id === userDetail.role_id) ?? null
      if (matchedRole) {
        setSelectedRole({ label: matchedRole.name, value: matchedRole.id })
      } else {
        setSelectedRole(null)
      }
      setIsActive(userDetail.is_active ?? true)
      setAvatarPreview(userDetail.avatar_url ?? null)
      const companies = userDetail.user_companies?.map((c) => {
        const name = c.name ?? c.company?.name
        const id = c.id ?? c.company?.id
        return name ? { label: name, value: id ?? name } : null
      }).filter(Boolean) ?? []
      setSelectedCompanies(companies)
    }
  }, [isEdit, userDetail])

  const animateClose = (callback) => {
    setIsVisible(false)
    setTimeout(callback, 300)
  }

  const handleBack = () => {
    if (isEdit) animateClose(() => openUserDetail(activePanelUserId))
    else animateClose(closeUserPanel)
  }

  const handleClose = () => animateClose(closeUserPanel)

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

  const roleOptions = roles.map((r) => ({ label: r.name, value: r.id }))

  const companyOptions = [
    { label: 'Everest', value: 'everest' },
    { label: 'Kalachakra', value: 'kalachakra' },
    { label: 'Merpati', value: 'merpati' },
    { label: 'Garuda Indonesia', value: 'garuda-indonesia' },
    { label: 'Telkom Indonesia', value: 'telkom-indonesia' },
    { label: 'Bank Mandiri', value: 'bank-mandiri' },
    { label: 'Pertamina', value: 'pertamina' },
    { label: 'Astra International', value: 'astra-international' },
    { label: 'Tokopedia', value: 'tokopedia' },
    { label: 'GoTo Group', value: 'goto-group' },
  ]

  const validate = () => {
    const errs = {}
    if (!name.trim()) errs.name = 'Full name is required.'
    if (!email.trim()) errs.email = 'Email is required.'
    if (!phone.trim()) errs.phone = 'Phone is required.'
    if (!selectedRole) errs.roleId = 'Role is required.'
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
      formData.append('role_id', selectedRole?.value ?? '')
      formData.append('is_active', isActive ? 'true' : 'false')
      formData.append('company_ids', JSON.stringify(selectedCompanies.map((c) => c.value)))

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
    console.log(text)
    navigator.clipboard.writeText(text)
    myToaster({ message: 'Password copied to clipboard' })
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-gray-950/70 backdrop-blur-md transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
        onClick={handleClose}
      />

      {/* Slide-out drawer */}
      <div
        className={`fixed  inset-y-0 right-0 z-50 flex pl-10 transition-transform duration-300 ease-in-out ${isVisible ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="relative flex flex-col w-[375px] border-l border-gray-200 bg-white shadow-xl">
          {/* Close button */}
          <button
            type="button"
            onClick={handleClose}
            className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-lg text-gray-500 hover:text-gray-700"
          >
            <XClose size={20} />
          </button>

          <form onSubmit={handleSubmit} className="flex h-full flex-col">
            {/* Scrollable content */}
            {/* Header */}
            <div className="flex flex-col gap-0.5 px-4 pb-8 pt-8">
              <h3 className="text-xl font-semibold leading-[30px] text-gray-900">
                {isEdit ? 'Edit user' : 'Add user'}
              </h3>
              <p className="text-base font-normal leading-6 text-gray-600">
                {isEdit
                  ? 'Please provide the details you would like to edit.'
                  : 'Please provide the details for a new user.'}
              </p>
            </div>
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
                          className={`relative mt-0.5 inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full transition-colors duration-200 ${isActive ? 'bg-brand/600' : 'bg-gray-200'}`}
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
                          Profile photo <span className="text-brand/600">*</span>
                        </p>
                        <div className="flex items-center gap-4">
                          <MyAvatar size={64} photo={avatarFile ?? avatarPreview} />
                          <div className="flex items-center gap-3 ml-auto">
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
                          Full name <span className="text-brand/600">*</span>
                        </p>
                        <MyTextField
                          name="name"
                          value={name}
                          placeholder="e.g. Eve Leroy"
                          isError={!!errors.name}
                          helperText={errors.name || ''}
                          onChangeForm={(e) => { setName(e.target.value); clearError('name') }}
                          focusColor="#7F56D9"
                          focusShadow="#7F56D93D"
                        />
                      </div>

                      {/* Email */}
                      <div className="flex flex-col gap-1.5">
                        <p className="text-sm font-medium leading-5 text-gray-700">
                          Email <span className="text-brand/600">*</span>
                        </p>
                        <MyTextField
                          name="email"
                          value={email}
                          placeholder="e.g. eve.leroy@kalachakra.io"
                          isError={!!errors.email}
                          helperText={errors.email || ''}
                          onChangeForm={(e) => { setEmail(e.target.value); clearError('email') }}
                          focusColor="#7F56D9"
                          focusShadow="#7F56D93D"
                          startAdornment={<Mail01 className="h-5 w-5 text-gray-500" />}
                        />
                      </div>

                      {/* Phone */}
                      <div className="flex flex-col gap-1.5">
                        <p className="text-sm font-medium leading-5 text-gray-700">
                          Phone <span className="text-brand/600">*</span>
                        </p>
                        <MyTextField
                          name="phone"
                          value={phone}
                          placeholder="e.g. +62 817 8817 3723"
                          isError={!!errors.phone}
                          helperText={errors.phone || ''}
                          onChangeForm={(e) => { setPhone(e.target.value); clearError('phone') }}
                          focusColor="#7F56D9"
                          focusShadow="#7F56D93D"
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
                    <span className="text-sm font-semibold leading-5 text-gray-900">Personal info</span>
                  </div>
                  <div className="rounded-xl border border-gray-200 bg-white pt-5 shadow-xs">
                    <div className="flex flex-col gap-5 px-4 pb-5">
                      {/* Role Dropdown */}
                      <div className="flex flex-col gap-1.5">
                        <p className="text-sm font-medium leading-5 text-gray-700">
                          Role <span className="text-brand/600">*</span>
                        </p>
                        <MyAutocomplete
                          name="role"
                          options={roleOptions}
                          value={selectedRole}
                          placeholder="Select role"
                          error={errors.roleId}
                          isOptionEqualToValue={(option, val) => option?.value === val?.id}
                          getOptionLabel={(e) => e?.label || ''}
                          onChange={(_e, val) => { setSelectedRole(val); clearError('roleId') }}
                          focusColor="#7F56D9"
                          focusShadow="#7F56D93D"
                        />
                      </div>

                      {/* Company Multi-select */}
                      <div className="flex flex-col gap-1.5">
                        <p className="text-sm font-medium leading-5 text-gray-700">
                          Company <span className="text-brand/600">*</span>
                        </p>
                        <MyAutocomplete
                          name="company"
                          multiple
                          freeSolo
                          options={companyOptions}
                          value={selectedCompanies}
                          placeholder="Type and press Enter"
                          isOptionEqualToValue={(option, val) => option?.value === val?.value}
                          getOptionLabel={(e) => e?.label || e || ''}
                          onChange={(_e, val) => {
                            const normalized = val.map((v) =>
                              typeof v === 'string' ? { label: v, value: v } : v
                            )
                            setSelectedCompanies(normalized)
                          }}
                          focusColor="#7F56D9"
                          focusShadow="#7F56D93D"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Password Card */}
              <div className="mt-6 mb-6 px-4">
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
                            focusColor="#7F56D9"
                            focusShadow="#7F56D93D"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(password)}
                          className="text-sm font-semibold text-brand/700 hover:text-brand/800"
                        >
                          <Copy01 className="size-5 ml-3" stroke="currentColor" />
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
            <div className="flex flex-col gap-3 pb-3">
              <div className="h-px bg-gray-200" />
              <div className="flex items-center justify-end gap-3 px-4">
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
                  {isSubmitting ? 'Saving…' : 'Submit'}
                </MyButton>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

UserForm.propTypes = {
  mode: PropTypes.oneOf(['create', 'edit']).isRequired,
}
