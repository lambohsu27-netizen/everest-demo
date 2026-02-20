// Libraries
import { useState, useEffect, useCallback, useRef } from 'react'
import SimpleBar from 'simplebar-react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
// UI Icons
import {
  XClose,
  RefreshCcw01,
  Copy01,
  Repeat04,
  UserPlus01,
  UserEdit,
} from '@untitled-ui/icons-react'
// Shared Components
import {
  MyTextField,
  MyButton,
  MyAvatar,
  WhatsApp,
  MyTooltip,
  MyAsyncDropdown,
  MyConfirmModal,
} from '@interstellar-component'
// Context
import { useUser } from '../Context'
// Schema
import { schema } from '../schema'
// Utils
import { handleError, checkErrorYup, Access } from '../../../services/Helper'
// import MyTextFieldLocal from '../../../localComponents/MyTextFieldLocal'
import { useApp } from '../../../AppContext'

function Formslider() {
  const { getAccess } = useApp()
  const access = getAccess(Access?.USER) // Note: 'access' variable is declared but not used later

  const {
    currentSlider,
    handleCurrentSlider,
    createUser,
    showUser,
    updateUser,
    restoreEnrollment,
    searchRole,
    searchBranch,
    generatePassword,
    createdPassword,
    copyToClipboard,
    setIsChanged,
    isChanged,
    handleCurrentModal,
  } = useUser()

  const {
    setValue,
    handleSubmit,
    control,
    watch,
    formState: { errors, isSubmitting },
    trigger,
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      email: '',
      name: '',
      nip: '',
      whatsapp: '',
      role: null,
      branch: null,
      photo: null,
      delete_photo: false,
      password: '',
      isActive: true,
    },
  })

  const { deleted_at, branch, role, photo, delete_photo } = watch()
  // console.log('photo', photo)

  const [title, setTitle] = useState('Tambah user baru')
  const [clickedCopy, setClickedCopy] = useState(false)
  const [isConfirmModalOpen, setConfirmModalOpen] = useState(false)
  const [isInitialDataLoaded, setIsInitialDataLoaded] = useState(false)
  const initialValues = useRef({})
  const watchedValues = watch()

  const handleGeneratePassword = useCallback(() => {
    generatePassword((field, value) => {
      setValue(field, value, { shouldDirty: true })
    })
  }, [generatePassword, setValue])

  useEffect(() => {
    let isMounted = true
    setIsInitialDataLoaded(false)
    setIsChanged(false)

    // --- EDIT MODE ---
    if (currentSlider?.id) {
      setTitle('Memuat...')
      showUser(currentSlider.id)
        .then((data) => {
          if (!isMounted) return
          setTitle(data.name)
          setValue('email', data.email || '')
          setValue('name', data.name || '')
          setValue('nip', data.nip || '')
          setValue('whatsapp', data.whatsapp || '')
          setValue('role', data.role || null)
          setValue('branch', data.branch || null)
          setValue('photo', data.photo_url || null)
          setValue('delete_photo', false)
          setValue('password', '')
          setValue('deleted_at', data.deleted_at || null)
          setValue('isActive', !data.deleted_at)

          setTimeout(() => {
            if (isMounted) {
              const currentFormValues = watch()
              initialValues.current = { ...currentFormValues }
              setIsInitialDataLoaded(true)
              setIsChanged(false)
            }
          }, 0)
        })
        .catch((err) => {
          console.error('Error fetching user:', err)
          if (isMounted) {
            handleError(err)
            handleCurrentSlider(null)
          }
        })
    } else {
      // --- ADD MODE ---
      setTitle('Tambah user baru')
      reset({
        // Reset form to default values defined in useForm
        email: '',
        name: '',
        nip: '',
        whatsapp: '',
        role: null,
        branch: null,
        photo: null,
        delete_photo: false,
        password: '',
        isActive: true,
      })
      handleGeneratePassword()

      setTimeout(() => {
        if (isMounted) {
          const currentFormValues = watch()
          initialValues.current = { ...currentFormValues }
          setIsInitialDataLoaded(true)
          setIsChanged(false)
        }
      }, 0)
    }

    return () => {
      isMounted = false
    }
  }, [
    currentSlider?.id,
    handleGeneratePassword,
    setIsChanged,
    setValue,
    showUser,
    watch,
    reset,
    handleCurrentSlider,
  ])

  useEffect(() => {
    if (!isInitialDataLoaded || Object.keys(initialValues.current).length === 0) {
      // If not loaded or initialValues is somehow empty, assume no changes yet
      // setIsChanged(false); // This might flicker, better to let the loading effect handle initial false state
      return
    }

    let hasChanges = false
    // Iterate over the keys of the *initial* values to ensure we compare apples to apples
    for (const key in initialValues.current) {
      // Check if key exists in watchedValues too, though it should
      if (Object.prototype.hasOwnProperty.call(watchedValues, key)) {
        const initialValue = initialValues.current[key]
        const watchedValue = watchedValues[key]

        // Normalize undefined/null for comparison consistency
        const normalizedInitial = initialValue ?? null
        const normalizedWatched = watchedValue ?? null

        // Specific comparisons
        if (key === 'role' || key === 'branch') {
          if ((normalizedInitial?.id ?? null) !== (normalizedWatched?.id ?? null)) {
            // console.log(`Change detected in ${key}: Initial ID: ${normalizedInitial?.id}, Watched ID: ${normalizedWatched?.id}`);
            hasChanges = true
            break
          }
        } else if (key === 'photo') {
          // A new file was selected
          if (watchedValue instanceof File) {
            // console.log(`Change detected in ${key}: New file selected`);
            hasChanges = true
            break
          }
          // Photo was marked for deletion (and wasn't initially deleted)
          if (watchedValues.delete_photo && !initialValues.current.delete_photo) {
            // console.log(`Change detected in ${key}: Marked for deletion`);
            hasChanges = true
            break
          }
          // Check if the URL itself changed (less likely unless manually altered)
          // This handles the case where photo goes from URL -> null (without delete_photo flag, e.g. if reset?)
          if (
            typeof normalizedInitial === 'string' &&
            normalizedInitial !== normalizedWatched &&
            !(watchedValue instanceof File)
          ) {
            // console.log(`Change detected in ${key}: URL changed or cleared`);
            hasChanges = true
            break
          }
        } else if (key === 'delete_photo') {
          // This flag change is handled within the 'photo' check above
          continue
        } else {
          // General comparison for primitives (string, number, boolean)
          // Treat '' and null as potentially different if required by schema, otherwise `normalized` handles it.
          if (normalizedInitial !== normalizedWatched) {
            // console.log(`Change detected in ${key}: Initial: ${normalizedInitial}, Watched: ${normalizedWatched}`);
            hasChanges = true
            break
          }
        }
      }
    }

    setIsChanged(hasChanges)

    // No cleanup needed here as setIsChanged(false) is handled by the loading effect
  }, [watchedValues, isInitialDataLoaded, setIsChanged]) // Dependencies: run when watched values change or loading finishes

  const onSubmit = handleSubmit(
    handleError(currentSlider?.id ? updateUser : createUser, control),
    checkErrorYup
  )

  // Reset copy tooltip state when password changes
  useEffect(() => {
    setClickedCopy(false)
  }, [createdPassword])

  return (
    <>
      <MyConfirmModal
        open={isConfirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        onConfirm={() => {
          setConfirmModalOpen(false)
          onSubmit()
        }}
        title={`Anda yakin ingin ${currentSlider?.id ? 'mengubah' : 'menambahkan'} data user?`}
        message="Data yang dibuat akan masuk ke approval untuk ditinjau terlebih dahulu."
        bgColor="bg-warning-100"
      />
      <div className="flex h-screen w-[400px] flex-col">
        <header className="relative mb-6 flex items-start gap-x-4 px-4 pt-6">
          <button
            onClick={() => {
              if (isChanged) {
                handleCurrentModal({ status: true, current: 'unsaved-modal' })
              } else {
                handleCurrentSlider(null)
              }
            }}
            className="absolute right-[12px] top-[12px] flex h-11 w-11 items-center justify-center rounded-lg p-2 text-gray-light-400 hover:bg-gray-light-50 active:bg-gray-light-100"
          >
            <XClose size={24} stroke="currentColor" />
          </button>
          <div className="rounded-lg border border-gray-300 p-[10px] shadow-shadows/shadow-lg">
            {currentSlider?.id ? (
              <UserEdit className="size-5 text-gray-700" />
            ) : (
              <UserPlus01 className="size-5 text-gray-700" />
            )}
          </div>
          <div className="flex flex-1 flex-col gap-6">
            <section className="flex flex-col gap-1">
              <p className="text-xl-semibold text-gray-light-900">{title}</p>
              <p className="text-sm-regular text-gray-light-600">Lengkapi informasi dibawah.</p>
            </section>
          </div>
        </header>

        <hr />

        <form
          // NoValidate prevents browser default validation interfering with RHF/Yup
          noValidate
          onSubmit={onSubmit}
          className="flex flex-1 flex-col overflow-hidden"
        >
          <section className="flex-1 overflow-hidden">
            {/* Use SimpleBar only if content might overflow */}
            <SimpleBar forceVisible="y" style={{ maxHeight: '100%' }}>
              <div className="flex h-full flex-col gap-6 px-4">
                <div className="flex flex-1 flex-col gap-4 py-6">
                  {/* Photo Section */}
                  <div className="gap-[6px] column">
                    <p className="text-sm-medium text-gray-700">Foto profil</p>
                    <div className="flex items-start justify-between">
                      <MyAvatar photo={photo} size={60} />
                      <div className="flex">
                        <MyButton variant="text" size="sm" color="primary">
                          <label
                            htmlFor="photo"
                            className="text-sm-semibold cursor-pointer text-brand-700"
                          >
                            Perbaharui
                          </label>
                        </MyButton>
                        <input
                          accept=".png,.jpeg,.jpg"
                          id="photo"
                          type="file"
                          className="hidden"
                          multiple={false}
                          onChange={(e) => {
                            setValue('photo', e.target.files[0])
                          }}
                          // disabled={isArchived}
                        />
                        <MyButton
                          variant="text"
                          size="sm"
                          color="error"
                          onClick={() => {
                            setValue('photo', null)
                            setValue('delete_photo', true)
                          }}
                        >
                          <p className="text-sm-semibold text-error-600">Hapus</p>
                        </MyButton>
                      </div>
                    </div>
                  </div>

                  <hr />

                  {/* Email */}
                  <div className="flex flex-col gap-y-1.5">
                    <label
                      htmlFor="email" // Correct htmlFor
                      className="text-sm-medium text-gray-light-700 after:text-brand-600 after:content-['*']"
                    >
                      Email
                    </label>
                    <MyTextField
                      id="email" // Add id for label association
                      disabled={Boolean(deleted_at)}
                      name="email"
                      control={control}
                      placeholder="Masukkan email"
                      errors={errors?.email?.message}
                      focusColor="#0A2349"
                      focusShadow="#DCE3F1"
                    />
                  </div>

                  {/* Name */}
                  <div className="flex flex-col gap-y-1.5">
                    <label
                      htmlFor="name"
                      className="text-sm-medium text-gray-light-700 after:text-brand-600 after:content-['*']"
                    >
                      Nama lengkap
                    </label>
                    <MyTextField
                      id="name"
                      disabled={Boolean(deleted_at)}
                      name="name"
                      control={control}
                      placeholder="Input nama"
                      errors={errors?.name?.message}
                      focusColor="#0A2349"
                      focusShadow="#DCE3F1"
                    />
                  </div>

                  {/* NIP */}
                  <div className="flex flex-col gap-y-1.5">
                    <label
                      htmlFor="nip" // Correct htmlFor
                      className="text-sm-medium text-gray-light-700 after:text-brand-600 after:content-['*']"
                    >
                      NIP
                    </label>
                    <MyTextField
                      id="nip" // Add id
                      disabled={Boolean(deleted_at)}
                      name="nip"
                      type="number"
                      control={control}
                      placeholder="Masukkan NIP"
                      errors={errors?.nip?.message}
                      focusColor="#0A2349"
                      focusShadow="#DCE3F1"
                    />
                  </div>

                  {/* WhatsApp */}
                  <div className="flex flex-col gap-y-1.5">
                    <label
                      htmlFor="whatsapp"
                      className="text-sm-medium text-gray-light-700 after:text-brand-600 after:content-['*']"
                    >
                      No. telpon
                    </label>
                    <MyTextField
                      id="whatsapp"
                      startAdornment={<WhatsApp />}
                      disabled={Boolean(deleted_at)}
                      name="whatsapp"
                      type="number"
                      control={control}
                      placeholder="Masukkan nomor telpon"
                      errors={errors?.whatsapp?.message}
                      focusColor="#0A2349"
                      focusShadow="#DCE3F1"
                    />
                  </div>

                  {/* Role */}
                  <div className="flex flex-col gap-y-1.5">
                    <label
                      // No direct htmlFor for Autocomplete needed, but good practice
                      className="text-sm-medium text-gray-light-700 after:text-brand-600 after:content-['*']"
                    >
                      Role
                    </label>
                    <MyAsyncDropdown
                      trigger={trigger}
                      disabled={Boolean(deleted_at)}
                      getOnRender={!!currentSlider?.id} // Fetch options on render only in edit mode maybe? Or always false and rely on typing. Let's keep false.
                      name="role"
                      placeholder="Pilih role"
                      control={control}
                      error={errors?.role?.message || errors?.role?.id?.message} // Check nested errors if applicable
                      isOptionEqualToValue={
                        (option, value) => option?.id === value?.id // Safe navigation
                      }
                      getOptionLabel={(e) => e?.name || ''} // Handle potential null/undefined option
                      value={role} // Controlled component value
                      asyncFunction={searchRole}
                      focusColor="#0A2349"
                      focusShadow="#DCE3F1"
                      onChange={(_e, value) => {
                        // Correct signature for MUI Autocomplete based components usually
                        setValue('role', value, { shouldDirty: true }) // Set value and mark dirty
                      }}
                    />
                  </div>

                  {/* Branch */}
                  <div className="flex flex-col gap-y-1.5">
                    <label className="text-sm-medium text-gray-light-700 after:text-brand-600 after:content-['*']">
                      Penempatan
                    </label>
                    <MyAsyncDropdown
                      trigger={trigger}
                      disabled={Boolean(deleted_at)}
                      getOnRender={false} // Keep false, load on interaction
                      name="branch"
                      placeholder="Pilih penempatan"
                      control={control}
                      error={errors?.branch?.message || errors?.branch?.id?.message} // Check nested errors
                      isOptionEqualToValue={
                        (option, value) => option?.id === value?.id // Safe navigation
                      }
                      getOptionLabel={(e) => e?.name || ''} // Handle potential null/undefined
                      value={branch} // Controlled component value
                      focusColor="#0A2349"
                      focusShadow="#DCE3F1"
                      asyncFunction={searchBranch}
                      onChange={(_e, value) => {
                        setValue('branch', value, { shouldDirty: true }) // Set value and mark dirty
                      }}
                    />
                  </div>

                  {/* Password */}
                  {/* <div className="flex flex-col gap-y-1.5">
                    <label
                      htmlFor="password"
                      className="text-sm-medium text-gray-light-700 after:text-brand-600 after:content-['*']"
                    >
                      Password
                    </label>
                    <MyTextFieldLocal
                      disabled={1}
                      name="password"
                      control={control}
                      placeholder="Klik generate untuk perbaharui"
                      errors={errors?.password?.message}
                      focusColor={'#0A2349'}
                      focusShadow={'#DCE3F1'}
                      endAdornment={
                        <button
                          color={'primary'}
                          variant={'text'}
                          // className="flex h-[43px] items-center gap-2 border-l pl-3"
                          disabled={createdPassword ? false : true}
                          size={'lg'}
                          onClick={(e) => {
                            e.preventDefault()
                            copyToClipboard(createdPassword)
                            setClickedCopy(true)
                          }}
                          onMouseLeave={() => setClickedCopy(false)}
                          className="flex h-[43px] items-center gap-2 border-l pl-3"
                        >
                          {createdPassword ? (
                            <MyTooltip
                              placement="left"
                              target={
                                <div className="flex items-center gap-2">
                                  <Copy01 />
                                  <p className="text-sm-semibold text-gray-700">
                                    Copy
                                  </p>
                                </div>
                              }
                            >
                              <p className="text-xs-medium text-white">
                                {clickedCopy ? 'copied!' : 'copy to clipboard'}
                              </p>
                            </MyTooltip>
                          ) : (
                            <>
                              <Copy01 />
                              <p className="text-sm-semibold text-gray-700">
                                Copy
                              </p>
                            </>
                          )}
                        </button>
                      }
                    />
                  </div> */}
                  {/* Generate Button */}
                  <button
                    type="button"
                    className={`flex items-center gap-2 ${deleted_at ? 'cursor-not-allowed opacity-50' : 'hover:text-brand-700'}`}
                    onClick={(e) => {
                      e.preventDefault()
                      if (!deleted_at) {
                        handleGeneratePassword()
                      }
                    }}
                    disabled={Boolean(deleted_at)}
                  >
                    <Repeat04
                      className={`size-5 ${deleted_at ? 'text-gray-light-400' : 'text-brand-500'}`}
                    />
                    <p
                      className={`text-sm-semibold ${deleted_at ? 'text-gray-light-400' : 'text-brand-500'}`}
                    >
                      Generate Password Baru
                    </p>
                  </button>
                </div>
              </div>
            </SimpleBar>
          </section>
          <footer className="flex items-center justify-end gap-4 border-t border-gray-light-200 px-4 py-4">
            {deleted_at && (
              <MyButton
                onClick={() => restoreEnrollment(currentSlider.id)}
                type="button"
                color="primary"
                variant="outlined"
                size="md"
                disabled={isSubmitting}
              >
                <RefreshCcw01 className="size-5" stroke="currentColor" />
                <p className="text-sm-semibold">Restore</p>
              </MyButton>
            )}

            <MyButton
              // disabled={isSubmitting}
              onClick={() => {
                if (isChanged) {
                  handleCurrentModal({ status: true, current: 'unsaved-modal' })
                } else {
                  handleCurrentSlider(null)
                }
              }}
              type="button"
              color="secondary"
              variant="outlined"
              size="md"
            >
              <p className="text-sm-semibold">Batalkan</p>
            </MyButton>

            {!deleted_at && (
              <MyButton
                disabled={isSubmitting || (currentSlider?.id && !isChanged)}
                // type="submit"
                onClick={() => setConfirmModalOpen(true)}
                color="primary"
                variant="filled"
                size="md"
              >
                <p className="text-sm-semibold">Simpan</p>
              </MyButton>
            )}
          </footer>
        </form>
      </div>
    </>
  )
}

export default Formslider
