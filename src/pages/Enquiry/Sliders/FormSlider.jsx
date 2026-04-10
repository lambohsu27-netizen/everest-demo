// Libraries
import { useState, useEffect, useRef } from 'react'
import SimpleBar from 'simplebar-react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { format } from 'date-fns'
// UI Icons
import {
  XClose,
  Plus,
  Edit01,
  HelpCircle,
  Calendar,
  Trash01,
  Maximize01,
} from '@untitled-ui/icons-react'
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
  MyDropzone,
} from '@interstellar-component'
import SignatureCanvas from 'react-signature-canvas'
import { QRCodeSVG } from 'qrcode.react'
import io from 'socket.io-client'
import ModalTermsCondition from './components/ModalTermsCondition'
// Context
import { useEnquiry } from '../Context'
// Schema
import { schema } from '../schema'
// Utils
import { handleError, checkErrorYup } from '../../../services/Helper'
import { searchKota, searchKecamatan, searchKelurahan } from '../../../services/indonesiaAddress'

const TUJUAN_PERMINTAAN_OPTIONS = [
  { label: 'Others', value: 'others' },
  { label: 'Kredit Perumahan', value: 'kredit_perumahan' },
  { label: 'Kredit Kendaraan', value: 'kredit_kendaraan' },
  { label: 'Kredit Usaha', value: 'kredit_usaha' },
  { label: 'Kartu Kredit', value: 'kartu_kredit' },
]

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
    setIsSignatureModalOpen,
    signatureModalHandlerRef,
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
      isDraft: false,
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
      photo: null,
      photo_selfie: null,
      signature: null,
      isActive: true,
      tnc: false,
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
    photo,
    photo_selfie,
    signature,
  } = watch()
  // console.log('photo', photo)

  const [title, setTitle] = useState('New Request')
  const [clickedCopy, setClickedCopy] = useState(false)
  const [isConfirmModalOpen, setConfirmModalOpen] = useState(false)
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false)
  const [isInitialDataLoaded, setIsInitialDataLoaded] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const initialValues = useRef({})
  const watchedValues = watch()
  const sigPad = useRef(null)

  const [roomId, setRoomId] = useState('')
  const [isMobileSigning, setIsMobileSigning] = useState(false)

  const dataURLtoFile = (dataurl, filename) => {
    const arr = dataurl.split(',')
    const mime = arr[0].match(/:(.*?);/)[1]
    const bstr = atob(arr[1])
    let n = bstr.length
    const u8arr = new Uint8Array(n)
    while (n > 0) {
      n -= 1
      u8arr[n] = bstr.charCodeAt(n)
    }
    return new File([u8arr], filename, { type: mime })
  }

  // Register signature modal handler so parent (index) can forward onSign from SignatureModal
  useEffect(() => {
    signatureModalHandlerRef.current = (dataUrl) => {
      if (sigPad.current) {
        sigPad.current.fromDataURL(dataUrl)
      }
      const file = dataURLtoFile(dataUrl, 'signature.png')
      setValue('signature', file, {
        shouldDirty: true,
        shouldValidate: true,
      })
    }
    return () => {
      signatureModalHandlerRef.current = null
    }
  }, [signatureModalHandlerRef, setValue])

  useEffect(() => {
    if (currentStep === 4) {
      if (!roomId) {
        setRoomId(Math.random().toString(36).substring(2, 15))
      }
    }
  }, [currentStep, roomId])

  useEffect(() => {
    if (currentStep === 4 && roomId) {
      const baseURL = import.meta.env.VITE_API_BASE_URL
        ? import.meta.env.VITE_API_BASE_URL.replace('/backoffice', '')
        : 'http://localhost:4000'
      const newSocket = io(baseURL, {
        transports: ['websocket'],
      })

      newSocket.on('connect', () => {
        newSocket.emit('join-signature-room', roomId)
      })

      newSocket.on('signature-received', (dataUrl) => {
        const file = dataURLtoFile(dataUrl, 'signature.png')
        setValue('signature', file, { shouldDirty: true, shouldValidate: true })
        setIsMobileSigning(false)

        // Wait for the SignatureCanvas component to remount after isMobileSigning becomes false
        setTimeout(() => {
          if (sigPad.current) {
            sigPad.current.fromDataURL(dataUrl)
          }
        }, 150)
      })

      return () => {
        newSocket.disconnect()
      }
    }
  }, [currentStep, roomId, setValue])

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
          setTitle(data.name || 'Edit Draft')
          setValue('isDraft', data.status === 'draft')
          setValue('name', data.name || '')
          setValue('nik', data.nik || '')

          if (data.dob) {
            // BE stores YYYY-MM-DD
            setValue('tanggal_lahir', new Date(data.dob))
          } else {
            setValue('tanggal_lahir', null)
          }

          // Map L/P back to Pria/Wanita
          if (data.gender === 'P') setValue('jenis_kelamin', 'Wanita')
          else if (data.gender === 'L') setValue('jenis_kelamin', 'Pria')
          else setValue('jenis_kelamin', '')

          setValue('alamat', data.address || '')
          setValue('telepon', data.phone || '')
          setValue('email', data.email || '')
          setValue('tempat_lahir', data.tempat_lahir || '')
          setValue('kode_pos', data.kode_pos || '')
          setValue('kelurahan', data.kelurahan || null)
          setValue('kota', data.kota || null)
          setValue('kecamatan', data.kecamatan || null)
          setValue('nama_ibu', data.nama_ibu || '')
          setValue('agreement', data.agreement || false)
          setValue(
            'tujuan_permintaan',
            (() => {
              const raw = data.tujuan_permintaan
              if (!raw) return null
              if (typeof raw === 'object' && raw?.value != null) return raw
              const value = typeof raw === 'string' ? raw : raw?.value
              return TUJUAN_PERMINTAAN_OPTIONS.find((opt) => opt.value === value) || null
            })()
          )
          setValue('penjelasan', data.penjelasan || '')
          setValue('photo', data.photo_ktp_url || null)
          setValue('photo_selfie', data.selfie_with_ktp_url || null)
          setValue('signature', data.signature_url || null)
          setValue('tnc', data.agreement_tnc ?? false)

          setValue('isActive', true)

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
        isDraft: false,
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
        photo: null,
        photo_selfie: null,
        signature: null,
        tnc: false,
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
        } else if (key === 'photo_selfie') {
          // A new file was selected
          if (watchedValue instanceof File) {
            hasChanges = true
            break
          }
          if (
            typeof normalizedInitial === 'string' &&
            normalizedInitial !== normalizedWatched &&
            !(watchedValue instanceof File)
          ) {
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
    handleError((data) => {
      // Submit (final) → always POST /inquiry to process. Save as Draft → PATCH if editing draft, else POST /draft.
      if (data.isDraft) {
        return currentSlider?.id ? updateEnquiry(data) : createEnquiry(data)
      }
      return createEnquiry(data)
    }, control),
    checkErrorYup
  )

  // Reset copy tooltip state when password changes
  useEffect(() => {
    setClickedCopy(false)
  }, [createdPassword])

  const fillDummyData = () => {
    // Dummy data from photo: NOAH UBAIDAH, L, 25/07/61, NIK 3141555322417520, address, 081259728897
    setValue('name', 'NOAH UBAIDAH', { shouldValidate: true, shouldDirty: true })
    setValue('email', 'UBAIDAH@GMAIL.COM', {
      shouldValidate: true,
      shouldDirty: true,
    })
    setValue('nik', '3141555322417520', { shouldValidate: true, shouldDirty: true })
    setValue('telepon', '081259728897', { shouldValidate: true, shouldDirty: true })
    setValue('jenis_kelamin', 'Pria', { shouldValidate: true, shouldDirty: true })
    setValue('tempat_lahir', 'BOGOR', { shouldValidate: true, shouldDirty: true })
    setValue('tanggal_lahir', new Date('1961-07-25'), {
      shouldValidate: true,
      shouldDirty: true,
    })
    setValue('kode_pos', '13960', { shouldValidate: true, shouldDirty: true })
    setValue(
      'kota',
      { id: '3172', name: 'KOTA ADM. JAKARTA TIMUR' },
      { shouldValidate: true, shouldDirty: true }
    )
    setValue(
      'kecamatan',
      { id: '3172030', name: 'CAKUNG' },
      { shouldValidate: true, shouldDirty: true }
    )
    setValue(
      'kelurahan',
      { id: '3172030001', name: 'UJUNG MENTENG' },
      { shouldValidate: true, shouldDirty: true }
    )
    setValue('alamat', 'JALAN UJUNG MENTENG UJUNG MENTENG CAKUNG 0395 13960', {
      shouldValidate: true,
      shouldDirty: true,
    })
    setValue('nama_ibu', 'DAMAYANTI', { shouldValidate: true, shouldDirty: true })
    setValue('agreement', true, { shouldValidate: true, shouldDirty: true })
    setValue(
      'tujuan_permintaan',
      { label: 'Others', value: 'others' },
      { shouldValidate: true, shouldDirty: true }
    )
    setValue('penjelasan', 'Dummy data for testing (NOAH UBAIDAH)', {
      shouldValidate: true,
      shouldDirty: true,
    })
    setIsChanged(true)
  }

  return (
    <>
      <ModalTermsCondition open={isTermsModalOpen} onClose={() => setIsTermsModalOpen(false)} />
      <MyConfirmModal
        open={isConfirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        onConfirm={() => {
          setConfirmModalOpen(false)
          onSubmit()
        }}
        title={
          watchedValues.isDraft
            ? `Anda yakin ingin menyimpan draft data enquiry?`
            : `Anda yakin ingin ${currentSlider?.id ? 'mengubah' : 'menambahkan'} data enquiry?`
        }
        message={
          watchedValues.isDraft
            ? 'Data yang disimpan sebagai draft dapat dilanjutkan nanti dan belum akan diproses.'
            : 'Data yang dibuat akan masuk ke enquiry untuk ditinjau terlebih dahulu.'
        }
        bgColor="bg-warning-100"
      />
      <div className="flex h-screen max-h-[100dvh] md:max-h-none w-[100vw] md:w-[400px] flex-col pt-[72px] md:pt-0 bg-white overflow-hidden">
        <header className="sticky top-0 z-10 shrink-0 bg-white relative mb-6 flex items-start gap-x-3 md:gap-x-4 px-4 pt-3 md:pt-6">
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
          <div className="rounded-lg border border-gray-300 p-[10px] shadow-shadows/shadow-lg shrink-0">
            {currentSlider?.id ? (
              <Edit01 className="size-5 text-gray-700" />
            ) : (
              <Plus className="size-5 text-gray-700" />
            )}
          </div>
          <div className="flex flex-1 flex-col gap-6 w-full pr-8 md:pr-0">
            <section className="flex flex-col gap-1 w-full">
              <p className="text-xl-semibold text-gray-900 break-words">{title}</p>
              <p className="text-sm-regular text-gray-600 w-full max-w-[300px]">
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
          className="flex flex-1 flex-col min-h-0 overflow-hidden"
        >
          <section className="flex-1 min-h-0 overflow-hidden">
            {/* Use SimpleBar only if content might overflow */}
            <SimpleBar forceVisible="y" style={{ maxHeight: '100%' }}>
              <div className="flex h-full flex-col gap-6 px-4">
                <div className={currentStep === 1 ? 'flex flex-1 flex-col gap-4 py-6' : 'hidden'}>
                  <p className="text-sm-semibold text-gray-900">General Information</p>

                  {/* Name */}
                  <div className="flex flex-col gap-y-1.5">
                    <label
                      htmlFor="name"
                      className="text-sm-medium text-gray-700 after:text-brand/900 after:content-['*']"
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
                    />
                  </div>

                  {/* Email */}
                  <div className="flex flex-col gap-y-1.5">
                    <label
                      htmlFor="email"
                      className="text-sm-medium text-gray-700 after:text-brand/900 after:content-['*']"
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
                    />
                    <p className="text-sm-regular text-gray-600">
                      Email ini akan digunakan sebagai alamat pengiriman hasil Credit Report.
                    </p>
                  </div>

                  {/* NIK */}
                  <div className="flex flex-col gap-y-1.5">
                    <label
                      htmlFor="nik"
                      className="text-sm-medium text-gray-700 after:text-brand/900 after:content-['*']"
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
                    />
                  </div>

                  {/* Jenis Kelamin + Telepon/HP */}
                  <div className="flex gap-x-3">
                    {/* Jenis Kelamin */}
                    <div className="flex flex-col gap-y-1.5">
                      <label className="text-sm-medium text-gray-700 after:text-brand/900 after:content-['*']">
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
                        className="text-sm-medium text-gray-700 after:text-brand/900 after:content-['*']"
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
                      />
                    </div>
                  </div>

                  {/* Tempat Lahir + Tanggal Lahir */}
                  <div className="flex gap-x-3">
                    {/* Tempat Lahir */}
                    <div className="flex flex-1 flex-col gap-y-1.5">
                      <label
                        htmlFor="tempat_lahir"
                        className="text-sm-medium text-gray-700 after:text-brand/900 after:content-['*']"
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
                      />
                    </div>

                    {/* Tanggal Lahir */}
                    <div className="flex flex-1 flex-col gap-y-1.5">
                      <label className="text-sm-medium text-gray-700 after:text-brand/900 after:content-['*']">
                        Tanggal Lahir
                      </label>
                      <MyCalendar
                        value={tanggal_lahir}
                        maxYearOffset={17}
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
                        <p className="text-sm-regular text-error/600">
                          {errors.tanggal_lahir.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Address fields (1 row each): Kota -> Kecamatan -> Kelurahan -> Kode Pos */}
                  <div className="flex flex-col gap-y-4">
                    {/* Kota */}
                    <div className="flex flex-col gap-y-1.5">
                      <label className="text-sm-medium text-gray-700 after:text-brand/900 after:content-['*']">
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
                    <div className="flex flex-col gap-y-1.5">
                      <label className="text-sm-medium text-gray-700 after:text-brand/900 after:content-['*']">
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
                        asyncFunction={searchKecamatan}
                        extraData={{ regency_id: kota?.id }}
                        onChange={(_e, value) => {
                          setValue('kecamatan', value, { shouldDirty: true })
                          // Cascade: reset kelurahan when kecamatan changes
                          setValue('kelurahan', null, { shouldDirty: true })
                        }}
                      />
                    </div>

                    {/* Kelurahan */}
                    <div className="flex flex-col gap-y-1.5">
                      <label className="text-sm-medium text-gray-700 after:text-brand/900 after:content-['*']">
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
                        asyncFunction={searchKelurahan}
                        extraData={{ district_id: kecamatan?.id }}
                        onChange={(_e, value) =>
                          setValue('kelurahan', value, { shouldDirty: true })
                        }
                      />
                    </div>

                    {/* Kode Pos */}
                    <div className="flex flex-col gap-y-1.5">
                      <label
                        htmlFor="kode_pos"
                        className="text-sm-medium text-gray-700 after:text-brand/900 after:content-['*']"
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
                      />
                    </div>
                  </div>

                  {/* Alamat Sesuai Identitas */}
                  <div className="flex flex-col gap-y-1.5">
                    <div className="flex items-center gap-x-1.5">
                      <label className="text-sm-medium text-gray-700 after:text-brand/900 after:content-['*']">
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
                      errors={errors?.alamat?.message}
                      disabled={Boolean(deleted_at)}
                    />
                  </div>

                  {/* Nama Ibu Gadis Kandung */}
                  <div className="flex flex-col gap-y-1.5">
                    <label
                      htmlFor="nama_ibu"
                      className="text-sm-medium text-gray-700 after:text-brand/900 after:content-['*']"
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
                    />
                  </div>

                  {/* Agreement Checkbox */}
                  <div className="flex flex-col gap-y-1">
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
                    {errors?.agreement?.message && (
                      <p className="text-sm-regular text-error/600">{errors.agreement.message}</p>
                    )}
                  </div>

                  {/* Tujuan Permintaan */}
                  <div className="flex flex-col gap-y-1.5">
                    <label className="text-sm-medium text-gray-700 after:text-brand/900 after:content-['*']">
                      Tujuan Permintaan
                    </label>
                    <MyAutocomplete
                      disabled={Boolean(deleted_at)}
                      name="tujuan_permintaan"
                      placeholder="Pilih tujuan permintaan"
                      control={control}
                      error={errors?.tujuan_permintaan?.message}
                      options={TUJUAN_PERMINTAAN_OPTIONS}
                      isOptionEqualToValue={(option, value) => option?.value === value?.value}
                      getOptionLabel={(e) => e?.label || ''}
                      value={tujuan_permintaan}
                      onChange={(_e, value) =>
                        setValue('tujuan_permintaan', value, { shouldDirty: true })
                      }
                    />
                  </div>

                  {/* Penjelasan */}
                  <div className="flex flex-col gap-y-1.5">
                    <div className="flex items-center gap-x-1.5">
                      <label className="text-sm-medium text-gray-700 after:text-brand/900 after:content-['*']">
                        Penjelasan
                      </label>
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
                      errors={errors?.penjelasan?.message}
                      disabled={Boolean(deleted_at)}
                    />
                  </div>
                </div>

                {currentStep === 2 && (
                  <div className="flex flex-1 flex-col gap-4 py-6">
                    <p className="text-sm-semibold text-gray-900">Kartu Tanda Penduduk</p>

                    <div className="flex flex-col gap-y-1.5">
                      {photo && typeof photo === 'string' ? (
                        <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-white">
                          <img
                            src={photo}
                            alt="Foto KTP"
                            className="h-auto w-full max-h-80 object-contain"
                          />
                          <button
                            type="button"
                            className="absolute right-2 top-2 z-10 rounded-lg border border-gray-200 bg-white p-2 text-gray-700 shadow-sm hover:bg-gray-50"
                            onClick={() => setValue('photo', null, { shouldDirty: true })}
                          >
                            <Trash01 className="size-5" />
                          </button>
                          <p className="px-3 py-2 text-xs text-gray-500">
                            Foto KTP tersimpan. Klik ikon sampah untuk ganti.
                          </p>
                        </div>
                      ) : (
                        <MyDropzone
                          colorBg="bg-white"
                          multiple={false}
                          accept={['.jpeg', '.png', '.jpg']}
                          maxSize={5242880}
                          showImage
                          onChange={(files) => {
                            setValue('photo', files && files.length > 0 ? files[0] : null, {
                              shouldDirty: true,
                            })
                          }}
                          errors={errors?.photo?.message}
                        />
                      )}
                    </div>
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="flex flex-1 flex-col gap-4 py-6">
                    <p className="text-sm-semibold text-gray-900">Selfie With KTP</p>

                    <div className="flex flex-col gap-y-1.5">
                      {photo_selfie && typeof photo_selfie === 'string' ? (
                        <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-white">
                          <img
                            src={photo_selfie}
                            alt="Selfie dengan KTP"
                            className="h-auto w-full max-h-80 object-contain"
                          />
                          <button
                            type="button"
                            className="absolute right-2 top-2 z-10 rounded-lg border border-gray-200 bg-white p-2 text-gray-700 shadow-sm hover:bg-gray-50"
                            onClick={() => setValue('photo_selfie', null, { shouldDirty: true })}
                          >
                            <Trash01 className="size-5" />
                          </button>
                          <p className="px-3 py-2 text-xs text-gray-500">
                            Selfie dengan KTP tersimpan. Klik ikon sampah untuk ganti.
                          </p>
                        </div>
                      ) : (
                        <MyDropzone
                          colorBg="bg-white"
                          multiple={false}
                          accept={['.jpeg', '.png', '.jpg']}
                          maxSize={5242880}
                          showImage
                          onChange={(files) => {
                            setValue('photo_selfie', files && files.length > 0 ? files[0] : null, {
                              shouldDirty: true,
                            })
                          }}
                          errors={errors?.photo_selfie?.message}
                        />
                      )}
                    </div>
                  </div>
                )}

                {currentStep === 4 && (
                  <div className="flex flex-1 flex-col gap-4 py-6">
                    <p className="text-sm-semibold text-gray-900">Customer Signature</p>

                    <div className="flex flex-col gap-y-1.5">
                      {signature && typeof signature === 'string' ? (
                        <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-white">
                          <img
                            src={signature}
                            alt="Tanda tangan"
                            className="h-auto w-full max-h-64 object-contain bg-white"
                          />
                          <button
                            type="button"
                            className="absolute right-2 top-2 z-10 rounded-lg border border-gray-200 bg-white p-2 text-gray-700 shadow-sm hover:bg-gray-50"
                            onClick={() => {
                              setValue('signature', null, {
                                shouldDirty: true,
                                shouldValidate: true,
                              })
                            }}
                          >
                            <Trash01 className="size-5" />
                          </button>
                          <p className="px-3 py-2 text-xs text-gray-500">
                            Tanda tangan tersimpan. Klik ikon sampah untuk ganti.
                          </p>
                        </div>
                      ) : !isMobileSigning ? (
                        <>
                          <div className="relative overflow-hidden rounded-lg border border-dashed border-gray-300 bg-white">
                            <SignatureCanvas
                              ref={sigPad}
                              penColor="black"
                              canvasProps={{ className: 'w-full h-64' }}
                              onEnd={() => {
                                if (sigPad.current && !sigPad.current.isEmpty()) {
                                  const dataUrl = sigPad.current.toDataURL('image/png')
                                  const file = dataURLtoFile(dataUrl, 'signature.png')
                                  setValue('signature', file, {
                                    shouldDirty: true,
                                    shouldValidate: true,
                                  })
                                }
                              }}
                            />
                            <button
                              type="button"
                              className="absolute right-2 top-2 z-10 rounded-lg border border-gray-200 bg-white p-2 text-error-600 shadow-sm hover:bg-gray-50"
                              onClick={() => {
                                if (sigPad.current) {
                                  sigPad.current.clear()
                                  setValue('signature', null, {
                                    shouldDirty: true,
                                    shouldValidate: true,
                                  })
                                }
                              }}
                            >
                              <Trash01 className="size-5" />
                            </button>
                            <button
                              type="button"
                              className="absolute right-2 bottom-2 z-10 rounded-lg border border-gray-200 bg-white p-2 text-gray-700 shadow-sm hover:bg-gray-50"
                              onClick={() => setIsSignatureModalOpen(true)}
                            >
                              <Maximize01 className="size-5" />
                            </button>
                          </div>

                          <div className="mt-2 flex items-center justify-center">
                            <button
                              type="button"
                              className="text-sm-medium text-brand/900 underline hover:text-brand/700"
                              onClick={() => setIsMobileSigning(true)}
                            >
                              Gambar dari perangkat seluler Anda
                            </button>
                          </div>
                        </>
                      ) : (
                        <div className="flex flex-col items-center justify-center rounded-lg border border-gray-200 bg-white py-8 shadow-sm">
                          <QRCodeSVG
                            value={`${window.location.origin}/mobile-signature/${roomId}`}
                            size={200}
                            fgColor="#000000"
                            bgColor="#ffffff"
                            level="H"
                            includeMargin
                          />
                          <p className="mt-4 text-center text-sm-medium text-brand/900">
                            Scan QR ini di perangkat seluler anda untuk tanda tangan
                          </p>
                          <button
                            type="button"
                            className="mt-6 text-sm-medium text-gray-600 underline hover:text-gray-900"
                            onClick={() => setIsMobileSigning(false)}
                          >
                            Kembali ke tanda tangan langsung
                          </button>
                        </div>
                      )}

                      {errors?.signature?.message && (
                        <p className="text-sm-regular text-error/600">{errors.signature.message}</p>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <MyCheckbox
                        name="tnc"
                        value
                        control={control}
                        disabled={Boolean(deleted_at)}
                      />
                      <p className="text-sm-regular text-gray-700">
                        Dengan menandatangani ini, Anda menyatakan telah membaca dan menyetujui{' '}
                        <button
                          type="button"
                          className="text-brand/900 font-medium cursor-pointer"
                          onClick={() => setIsTermsModalOpen(true)}
                        >
                          <p className="text-sm-regular text-brand/700">Terms & Conditions</p>
                        </button>{' '}
                        yang berlaku.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </SimpleBar>
          </section>
          <footer className="shrink-0 flex items-center justify-end gap-4 border-t border-gray-200 px-4 py-4 bg-white">
            {import.meta.env.VITE_MODE === 'DEVELOPMENT' && currentStep === 1 && !deleted_at && (
              <MyButton
                disabled={isSubmitting}
                type="button"
                color="secondary"
                variant="outlined"
                size="md"
                onClick={fillDummyData}
              >
                <p className="text-sm-semibold">Fill Dummy</p>
              </MyButton>
            )}

            {currentStep > 1 && !deleted_at && (
              <MyButton
                disabled={isSubmitting}
                type="button"
                color="secondary"
                variant="outlined"
                size="md"
                onClick={() => setCurrentStep(currentStep - 1)}
              >
                <p className="text-sm-semibold">Previous</p>
              </MyButton>
            )}

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
                disabled={isSubmitting || (currentStep === 4 && currentSlider?.id && !isChanged)}
                onClick={async () => {
                  if (currentStep === 1) {
                    console.log('jalan 1')

                    setValue('isDraft', false, { shouldDirty: false })
                    const isValid = await trigger(
                      [
                        'name',
                        'email',
                        'nik',
                        'jenis_kelamin',
                        'telepon',
                        'tempat_lahir',
                        'tanggal_lahir',
                        'kode_pos',
                        'kota',
                        'kecamatan',
                        'kelurahan',
                        'alamat',
                        'nama_ibu',
                        'agreement',
                        'tujuan_permintaan',
                        'penjelasan',
                      ],
                      { shouldFocus: true }
                    )

                    if (isValid) {
                      setCurrentStep(2)
                    }
                  } else if (currentStep === 2) {
                    console.log('jalan 2')
                    setValue('isDraft', false, { shouldDirty: false })
                    const isPhotoValid = await trigger(['photo'], { shouldFocus: true })
                    if (isPhotoValid) {
                      setCurrentStep(3)
                    }
                  } else if (currentStep === 3) {
                    console.log('jalan 3')
                    setValue('isDraft', false, { shouldDirty: false })
                    const isSelfieValid = await trigger(['photo_selfie'], { shouldFocus: true })
                    if (isSelfieValid) {
                      setCurrentStep(4)
                    }
                  } else {
                    console.log('jalan 4')

                    setValue('isDraft', false, { shouldDirty: false })
                    setConfirmModalOpen(true)
                  }
                }}
                color="primary"
                variant="filled"
                size="md"
              >
                <p className="text-sm-semibold">{currentStep < 4 ? 'Next' : 'Submit'}</p>
              </MyButton>
            )}
          </footer>
        </form>
      </div>
    </>
  )
}

export default Formslider
