// Libraries
import { useState, useEffect, useRef } from 'react'
import SimpleBar from 'simplebar-react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { format } from 'date-fns'
// UI Icons
import { XClose, Plus, Edit01, HelpCircle, Calendar } from '@untitled-ui/icons-react'
// Shared Components
import {
  MyTextField,
  MyButton,
  MyButtonGroupV2,
  MyTooltip,
  MyAsyncDropdown,
  MyAutocomplete,
  MyConfirmModal,
  MyCheckbox,
  MyTextArea,
  MyCalendar,
} from '@interstellar-component'
// Context
import { useEnquiry } from '../Context'
// Schema
import { schema } from '../schema'
// Utils
import { handleError, checkErrorYup } from '../../../services/Helper'
import { searchKota, searchKecamatan, searchKelurahan } from '../../../services/indonesiaAddress'

function Formslider() {
  // const { getAccess } = useApp()
  // const access = getAccess(Access?.Enquiry) // Note: 'access' variable is declared but not used later

  const {
    currentSlider,
    handleCurrentSlider,
    createEnquiry,
    showEnquiry,
    updateEnquiry,
    createdPassword,
    setIsChanged,
    isChanged,
    handleCurrentModal,
  } = useEnquiry()

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
      nik: '',
      jenis_kelamin: 'Pria',
      telepon: '',
      tempat_lahir: '',
      tanggal_lahir: null,
      kode_pos: '',
      kelurahan: null,
      kota: null,
      kecamatan: null,
      alamat: '',
      nama_ibu: '',
      agreement: false,
      tujuan_permintaan: null,
      penjelasan: '',
      delete_photo: false,
      isActive: true,
    },
  })

  const {
    deleted_at,
    jenis_kelamin,
    tanggal_lahir,
    kelurahan,
    kota,
    kecamatan,
    tujuan_permintaan,
    delete_photo,
  } = watch()
  // console.log('photo', photo)

  const [title, setTitle] = useState('New Request')
  const [clickedCopy, setClickedCopy] = useState(false)
  const [isConfirmModalOpen, setConfirmModalOpen] = useState(false)
  const [isInitialDataLoaded, setIsInitialDataLoaded] = useState(false)
  const initialValues = useRef({})
  const watchedValues = watch()

  // const handleGeneratePassword = useCallback(() => {
  //   generatePassword((field, value) => {
  //     setValue(field, value, { shouldDirty: true })
  //   })
  // }, [generatePassword, setValue])

  useEffect(() => {
    let isMounted = true
    setIsInitialDataLoaded(false)
    setIsChanged(false)

    // --- EDIT MODE ---
    if (currentSlider?.id) {
      setTitle('Memuat...')
      showEnquiry(currentSlider.id)
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
          console.error('Error fetching enquiry:', err)
          if (isMounted) {
            handleError(err)
            handleCurrentSlider(null)
          }
        })
    } else {
      // --- ADD MODE ---
      setTitle('New Request')
      reset({
        email: '',
        name: '',
        nik: '',
        jenis_kelamin: 'Pria',
        telepon: '',
        tempat_lahir: '',
        tanggal_lahir: null,
        kode_pos: '',
        kelurahan: null,
        kota: null,
        kecamatan: null,
        alamat: '',
        nama_ibu: '',
        agreement: false,
        tujuan_permintaan: null,
        penjelasan: '',
        delete_photo: false,
        isActive: true,
      })
      // handleGeneratePassword()

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
    // handleGeneratePassword,
    setIsChanged,
    setValue,
    showEnquiry,
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
    handleError(currentSlider?.id ? updateEnquiry : createEnquiry, control),
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
        title={`Anda yakin ingin ${currentSlider?.id ? 'mengubah' : 'menambahkan'} data enquiry?`}
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
            className="absolute right-[12px] top-[12px] flex h-11 w-11 items-center justify-center rounded-lg p-2 text-gray-400 hover:bg-gray-50 active:bg-gray-100"
          >
            <XClose size={24} stroke="currentColor" />
          </button>
          <div className="rounded-lg border border-gray-300 p-[10px] shadow-shadows/shadow-lg">
            {currentSlider?.id ? (
              <Edit01 className="size-5 text-gray-700" />
            ) : (
              <Plus className="size-5 text-gray-700" />
            )}
          </div>
          <div className="flex flex-1 flex-col gap-6">
            <section className="flex flex-col gap-1">
              <p className="text-xl-semibold text-gray-900">{title}</p>
              <p className="text-sm-regular text-gray-600 max-w-[300px]">
                Please complete the following field to continue the process.
              </p>
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
                  <p className="text-sm-semibold text-gray-900">General Information</p>

                  {/* Name */}
                  <div className="flex flex-col gap-y-1.5">
                    <label
                      htmlFor="name"
                      className="text-sm-medium text-gray-700 after:text-brand-600 after:content-['*']"
                    >
                      Name
                    </label>
                    <MyTextField
                      id="name"
                      disabled={Boolean(deleted_at)}
                      name="name"
                      control={control}
                      placeholder="Input name"
                      errors={errors?.name?.message}
                      focusColor="#0A2349"
                      focusShadow="#DCE3F1"
                    />
                  </div>

                  {/* Email */}
                  <div className="flex flex-col gap-y-1.5">
                    <label
                      htmlFor="email"
                      className="text-sm-medium text-gray-700 after:text-brand-600 after:content-['*']"
                    >
                      Email
                    </label>
                    <MyTextField
                      id="email"
                      disabled={Boolean(deleted_at)}
                      name="email"
                      control={control}
                      placeholder="Input email"
                      errors={errors?.email?.message}
                      focusColor="#0A2349"
                      focusShadow="#DCE3F1"
                    />
                    <p className="text-sm-regular text-gray-600">
                      Email ini akan digunakan sebagai alamat pengiriman hasil Credit Report.
                    </p>
                  </div>

                  {/* NIK */}
                  <div className="flex flex-col gap-y-1.5">
                    <label
                      htmlFor="nik"
                      className="text-sm-medium text-gray-700 after:text-brand-600 after:content-['*']"
                    >
                      NIK
                    </label>
                    <MyTextField
                      id="nik"
                      disabled={Boolean(deleted_at)}
                      name="nik"
                      type="number"
                      control={control}
                      placeholder="Input NIK"
                      errors={errors?.nik?.message}
                      focusColor="#0A2349"
                      focusShadow="#DCE3F1"
                    />
                  </div>

                  {/* Jenis Kelamin + Telepon/HP */}
                  <div className="flex gap-x-3">
                    {/* Jenis Kelamin */}
                    <div className="flex flex-col gap-y-1.5">
                      <label className="text-sm-medium text-gray-700 after:text-brand-600 after:content-['*']">
                        Jenis Kelamin
                      </label>
                      <MyButtonGroupV2
                        disabled={Boolean(deleted_at)}
                        buttons={[
                          { label: 'Pria', value: 'Pria' },
                          { label: 'Wanita', value: 'Wanita' },
                        ]}
                        value={jenis_kelamin}
                        onChange={(val) => setValue('jenis_kelamin', val, { shouldDirty: true })}
                      />
                      {errors?.jenis_kelamin?.message && (
                        <p className="text-sm-regular text-error-600">
                          {errors.jenis_kelamin.message}
                        </p>
                      )}
                    </div>

                    {/* Telepon/HP */}
                    <div className="flex flex-1 flex-col gap-y-1.5">
                      <label
                        htmlFor="telepon"
                        className="text-sm-medium text-gray-700 after:text-brand-600 after:content-['*']"
                      >
                        Telepon/HP
                      </label>
                      <MyTextField
                        id="telepon"
                        disabled={Boolean(deleted_at)}
                        name="telepon"
                        type="number"
                        control={control}
                        placeholder="Input nomor telepon"
                        errors={errors?.telepon?.message}
                        focusColor="#0A2349"
                        focusShadow="#DCE3F1"
                      />
                    </div>
                  </div>

                  {/* Tempat Lahir + Tanggal Lahir */}
                  <div className="flex gap-x-3">
                    {/* Tempat Lahir */}
                    <div className="flex flex-1 flex-col gap-y-1.5">
                      <label
                        htmlFor="tempat_lahir"
                        className="text-sm-medium text-gray-700 after:text-brand-600 after:content-['*']"
                      >
                        Tempat Lahir
                      </label>
                      <MyTextField
                        id="tempat_lahir"
                        disabled={Boolean(deleted_at)}
                        name="tempat_lahir"
                        control={control}
                        placeholder="Input tempat lahir"
                        errors={errors?.tempat_lahir?.message}
                        focusColor="#0A2349"
                        focusShadow="#DCE3F1"
                      />
                    </div>

                    {/* Tanggal Lahir */}
                    <div className="flex flex-1 flex-col gap-y-1.5">
                      <label className="text-sm-medium text-gray-700 after:text-brand-600 after:content-['*']">
                        Tanggal Lahir
                      </label>
                      <MyCalendar
                        value={tanggal_lahir}
                        onChange={(date) => setValue('tanggal_lahir', date, { shouldDirty: true })}
                        target={(open, show) => (
                          <button
                            type="button"
                            disabled={Boolean(deleted_at)}
                            onClick={show}
                            className="flex h-11 w-full items-center gap-2 rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-left shadow-shadows/shadow-xs hover:bg-gray-50 disabled:cursor-not-allowed disabled:bg-gray-50"
                          >
                            <Calendar className="size-5 text-gray-400" stroke="currentColor" />
                            <span
                              className={`text-md-regular flex-1 ${tanggal_lahir ? 'text-gray-400' : 'text-gray-400'}`}
                            >
                              {tanggal_lahir
                                ? format(new Date(tanggal_lahir), 'MMM d, yyyy')
                                : 'Pilih tanggal'}
                            </span>
                          </button>
                        )}
                      />
                      {errors?.tanggal_lahir?.message && (
                        <p className="text-sm-regular text-error-600">
                          {errors.tanggal_lahir.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Kode Pos + Kelurahan */}
                  <div className="flex gap-x-3">
                    {/* Kode Pos */}
                    <div className="flex flex-1 flex-col gap-y-1.5">
                      <label
                        htmlFor="kode_pos"
                        className="text-sm-medium text-gray-700 after:text-brand-600 after:content-['*']"
                      >
                        Kode Pos
                      </label>
                      <MyTextField
                        id="kode_pos"
                        disabled={Boolean(deleted_at)}
                        name="kode_pos"
                        type="number"
                        control={control}
                        placeholder="Input kode pos"
                        errors={errors?.kode_pos?.message}
                        focusColor="#0A2349"
                        focusShadow="#DCE3F1"
                      />
                    </div>

                    {/* Kelurahan */}
                    <div className="flex flex-1 flex-col gap-y-1.5">
                      <label className="text-sm-medium text-gray-700 after:text-brand-600 after:content-['*']">
                        Kelurahan
                      </label>
                      <MyAsyncDropdown
                        trigger={trigger}
                        disabled={Boolean(deleted_at) || !kecamatan}
                        getOnRender={false}
                        name="kelurahan"
                        placeholder={
                          kecamatan ? 'Pilih kelurahan' : 'Pilih kecamatan terlebih dahulu'
                        }
                        control={control}
                        error={errors?.kelurahan?.message}
                        isOptionEqualToValue={(option, value) => option?.id === value?.id}
                        getOptionLabel={(e) => e?.name || ''}
                        value={kelurahan}
                        focusColor="#0A2349"
                        focusShadow="#DCE3F1"
                        asyncFunction={searchKelurahan}
                        extraData={{ district_id: kecamatan?.id }}
                        onChange={(_e, value) =>
                          setValue('kelurahan', value, { shouldDirty: true })
                        }
                      />
                    </div>
                  </div>

                  {/* Kota + Kecamatan */}
                  <div className="flex gap-x-3">
                    {/* Kota */}
                    <div className="flex flex-1 flex-col gap-y-1.5">
                      <label className="text-sm-medium text-gray-700 after:text-brand-600 after:content-['*']">
                        Kota
                      </label>
                      <MyAsyncDropdown
                        trigger={trigger}
                        disabled={Boolean(deleted_at)}
                        getOnRender={false}
                        name="kota"
                        placeholder="Pilih kota"
                        control={control}
                        error={errors?.kota?.message}
                        isOptionEqualToValue={(option, value) => option?.id === value?.id}
                        getOptionLabel={(e) => e?.name || ''}
                        value={kota}
                        focusColor="#0A2349"
                        focusShadow="#DCE3F1"
                        asyncFunction={searchKota}
                        onChange={(_e, value) => {
                          setValue('kota', value, { shouldDirty: true })
                          // Cascade: reset kecamatan & kelurahan when kota changes
                          setValue('kecamatan', null, { shouldDirty: true })
                          setValue('kelurahan', null, { shouldDirty: true })
                        }}
                      />
                    </div>

                    {/* Kecamatan */}
                    <div className="flex flex-1 flex-col gap-y-1.5">
                      <label className="text-sm-medium text-gray-700 after:text-brand-600 after:content-['*']">
                        Kecamatan
                      </label>
                      <MyAsyncDropdown
                        trigger={trigger}
                        disabled={Boolean(deleted_at) || !kota}
                        getOnRender={false}
                        name="kecamatan"
                        placeholder={kota ? 'Pilih kecamatan' : 'Pilih kota terlebih dahulu'}
                        control={control}
                        error={errors?.kecamatan?.message}
                        isOptionEqualToValue={(option, value) => option?.id === value?.id}
                        getOptionLabel={(e) => e?.name || ''}
                        value={kecamatan}
                        focusColor="#0A2349"
                        focusShadow="#DCE3F1"
                        asyncFunction={searchKecamatan}
                        extraData={{ regency_id: kota?.id }}
                        onChange={(_e, value) => {
                          setValue('kecamatan', value, { shouldDirty: true })
                          // Cascade: reset kelurahan when kecamatan changes
                          setValue('kelurahan', null, { shouldDirty: true })
                        }}
                      />
                    </div>
                  </div>

                  {/* Alamat Sesuai Identitas */}
                  <div className="flex flex-col gap-y-1.5">
                    <div className="flex items-center gap-x-1.5">
                      <label className="text-sm-medium text-gray-700 after:text-brand-600 after:content-['*']">
                        Alamat Sesuai Identitas
                      </label>
                      <MyTooltip title="Masukkan alamat sesuai dengan KTP" placement="top">
                        <HelpCircle className="size-4 text-gray-400" stroke="currentColor" />
                      </MyTooltip>
                    </div>
                    <MyTextArea
                      name="alamat"
                      control={control}
                      placeholder="Input alamat sesuai identitas"
                      errors={errors}
                      disabled={Boolean(deleted_at)}
                    />
                  </div>

                  {/* Nama Ibu Gadis Kandung */}
                  <div className="flex flex-col gap-y-1.5">
                    <label
                      htmlFor="nama_ibu"
                      className="text-sm-medium text-gray-700 after:text-brand-600 after:content-['*']"
                    >
                      Nama Ibu Gadis Kandung
                    </label>
                    <MyTextField
                      id="nama_ibu"
                      disabled={Boolean(deleted_at)}
                      name="nama_ibu"
                      control={control}
                      placeholder="Input nama ibu gadis kandung"
                      errors={errors?.nama_ibu?.message}
                      focusColor="#0A2349"
                      focusShadow="#DCE3F1"
                    />
                  </div>

                  {/* Agreement Checkbox */}
                  <div className="flex items-start gap-x-2">
                    <MyCheckbox
                      name="agreement"
                      value
                      control={control}
                      disabled={Boolean(deleted_at)}
                    />
                    <button
                      type="button"
                      disabled={Boolean(deleted_at)}
                      className="text-sm-regular cursor-pointer text-left text-gray-700 disabled:cursor-not-allowed"
                      onClick={() =>
                        setValue('agreement', !watch('agreement'), { shouldDirty: true })
                      }
                    >
                      Mengajukan permohonan Informasi Debitur yang tersimpan dalam informasi biro
                      Kredit PT CLIK.
                    </button>
                  </div>

                  {/* Tujuan Permintaan */}
                  <div className="flex flex-col gap-y-1.5">
                    <label className="text-sm-medium text-gray-700 after:text-brand-600 after:content-['*']">
                      Tujuan Permintaan
                    </label>
                    <MyAutocomplete
                      disabled={Boolean(deleted_at)}
                      name="tujuan_permintaan"
                      placeholder="Pilih tujuan permintaan"
                      control={control}
                      error={errors?.tujuan_permintaan?.message}
                      options={[
                        { label: 'Others', value: 'others' },
                        { label: 'Kredit Perumahan', value: 'kredit_perumahan' },
                        { label: 'Kredit Kendaraan', value: 'kredit_kendaraan' },
                        { label: 'Kredit Usaha', value: 'kredit_usaha' },
                        { label: 'Kartu Kredit', value: 'kartu_kredit' },
                      ]}
                      isOptionEqualToValue={(option, value) => option?.value === value?.value}
                      getOptionLabel={(e) => e?.label || ''}
                      value={tujuan_permintaan}
                      focusColor="#0A2349"
                      focusShadow="#DCE3F1"
                      onChange={(_e, value) =>
                        setValue('tujuan_permintaan', value, { shouldDirty: true })
                      }
                    />
                  </div>

                  {/* Penjelasan */}
                  <div className="flex flex-col gap-y-1.5">
                    <div className="flex items-center gap-x-1.5">
                      <label className="text-sm-medium text-gray-700">Penjelasan</label>
                      <MyTooltip
                        title="Jelaskan tujuan permintaan informasi kredit secara singkat"
                        placement="top"
                      >
                        <HelpCircle className="size-4 text-gray-400" stroke="currentColor" />
                      </MyTooltip>
                    </div>
                    <MyTextArea
                      name="penjelasan"
                      control={control}
                      placeholder="Input penjelasan"
                      errors={errors}
                      disabled={Boolean(deleted_at)}
                    />
                  </div>
                </div>
              </div>
            </SimpleBar>
          </section>
          <footer className="flex items-center justify-end gap-4 border-t border-gray-200 px-4 py-4">
            {!deleted_at && (
              <MyButton
                disabled={isSubmitting}
                type="button"
                color="secondary"
                variant="outlined"
                size="md"
                onClick={() => {
                  // Save as Draft - submit with draft flag
                  setValue('isDraft', true, { shouldDirty: false })
                  setConfirmModalOpen(true)
                }}
              >
                <p className="text-sm-semibold">Save as Draft</p>
              </MyButton>
            )}

            {!deleted_at && (
              <MyButton
                disabled={isSubmitting || (currentSlider?.id && !isChanged)}
                onClick={() => {
                  setValue('isDraft', false, { shouldDirty: false })
                  setConfirmModalOpen(true)
                }}
                color="primary"
                variant="filled"
                size="md"
              >
                <p className="text-sm-semibold">Next</p>
              </MyButton>
            )}
          </footer>
        </form>
      </div>
    </>
  )
}

export default Formslider
