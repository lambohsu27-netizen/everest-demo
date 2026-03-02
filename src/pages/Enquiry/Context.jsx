import { createContext, useState, useEffect, useCallback, useMemo, useContext, useRef } from 'react'
import { myToaster } from '@interstellar-component'
import Service from './service'
import { useApp } from '../../AppContext'

const EnquiryContext = createContext()

function EnquiryProvider({ children }) {
  const { setSlider, getSession } = useApp()
  const [createdPassword, setCreatedPassword] = useState(null)
  const [enquiry, setEnquiry] = useState({
    data: [],
    meta: [],
    filter: [],
  })
  const [params, setParams] = useState({
    page: 1,
    filter: [],
    archive: 0,
    active: true,
    sort: null,
    order: null,
    status: 'view all',
  })
  const [check, setCheck] = useState([])
  const [isChanged, setIsChanged] = useState(false)

  const [currentSlider, setCurrentSlider] = useState({
    status: false,
    current: null,
  })
  const [currentModal, setCurrentModal] = useState({
    status: false,
    current: null,
  })
  const [currentTabs, setCurrentTabs] = useState({
    type: 'general',
    search: '',
    page: 1,
    filter: [],
  })

  const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false)
  const signatureModalHandlerRef = useRef(null)

  useEffect(() => {
    setSlider(currentSlider.status)
  }, [currentSlider, setSlider])

  const handleCurrentSlider = useCallback((slider, id) => {
    if (slider && slider.current) setCurrentSlider({ status: true, current: slider.current, id })
    else {
      setCurrentSlider((value) => ({ ...value, current: null }))
      setCurrentTabs((value) => ({
        ...value,
        type: 'general',
      }))
      setTimeout(() => {
        setCurrentSlider({ current: null })
      }, 200)
    }
  }, [])

  const handleCurrentModal = useCallback((modal) => {
    if (modal && modal.current) {
      setCurrentModal({
        status: true,
        current: modal.current,
        parent_id: modal.parent_id,
      })
    } else {
      setCurrentModal((e) => ({ ...e, current: null }))
      setTimeout(() => {
        setCurrentModal({ current: null })
      }, 200)
    }
  }, [])

  const handleChangeTabs = useCallback((value) => {
    setCurrentTabs(value)
  }, [])

  /* -------------------------------------------------------------------------- */

  const getEnquiry = useCallback(
    () =>
      Service.getEnquiry(params)
        .then((res) => {
          setEnquiry({ data: res.data, filter: res.filter, meta: res.meta })
        })
        .catch(myToaster),
    [params]
  )

  const showEnquiry = useCallback(
    (id) =>
      Service.showEnquiry(id)
        .then((res) => res.data)
        .catch(myToaster),
    []
  )

  // Details-Slider
  const getEnquiryDetail = useCallback(
    async (id) =>
      await Service.getEnquiryDetail(id, params)
        .then((res) => res)
        .catch(myToaster),
    [params]
  )

  const createEnquiry = useCallback(
    async (body) => {
      // Log body (non-file fields) for debugging
      const bodyLog = {
        name: body.name,
        nik: body.nik,
        email: body.email,
        alamat: body.alamat,
        telepon: body.telepon,
        tanggal_lahir: body.tanggal_lahir,
        jenis_kelamin: body.jenis_kelamin,
        tempat_lahir: body.tempat_lahir,
        kode_pos: body.kode_pos,
        kelurahan: body.kelurahan,
        kota: body.kota,
        kecamatan: body.kecamatan,
        nama_ibu: body.nama_ibu,
        agreement: body.agreement,
        tnc: body.tnc,
        tujuan_permintaan: body.tujuan_permintaan,
        penjelasan: body.penjelasan,
        isDraft: body.isDraft,
      }
      console.log('[Enquiry] createEnquiry body:', bodyLog)

      const formData = new FormData()
      formData.append('name', body.name || '')
      formData.append('nik', body.nik || '')

      // Format birthDate to YYYY-MM-DD
      if (body.tanggal_lahir) {
        const d = new Date(body.tanggal_lahir)
        const [birthDate] = d.toISOString().split('T')
        formData.append('birthDate', birthDate)
      }

      // Map gender: Pria → L, Wanita → P
      if (body.jenis_kelamin) {
        formData.append('gender', body.jenis_kelamin === 'Pria' ? 'L' : 'P')
      }

      formData.append('address', body.alamat || '')
      formData.append('phone', body.telepon || '')
      formData.append('email', body.email || '')
      if (body.tempat_lahir) formData.append('tempat_lahir', body.tempat_lahir)
      if (body.kode_pos) formData.append('kode_pos', body.kode_pos)
      if (body.kelurahan) {
        formData.append('kelurahan_id', body.kelurahan.id)
        formData.append('kelurahan_name', body.kelurahan.name)
      }
      if (body.kota) {
        formData.append('kota_id', body.kota.id)
        formData.append('kota_name', body.kota.name)
      }
      if (body.kecamatan) {
        formData.append('kecamatan_id', body.kecamatan.id)
        formData.append('kecamatan_name', body.kecamatan.name)
      }
      if (body.nama_ibu) formData.append('nama_ibu', body.nama_ibu)
      formData.append('agreement', body.agreement || false)
      if (body.tnc !== undefined && body.tnc !== null) {
        formData.append('agreement_tnc', body.tnc)
      }
      if (body.tujuan_permintaan) {
        formData.append('tujuan_permintaan', body.tujuan_permintaan.value)
      }
      formData.append('penjelasan', body.penjelasan || '')
      if (body.photo && body.photo instanceof File) {
        formData.append('photo', body.photo)
      }
      if (body.photo_selfie && body.photo_selfie instanceof File) {
        formData.append('photo_selfie', body.photo_selfie)
      }
      if (body.signature && body.signature instanceof File) {
        formData.append('signature', body.signature)
      }

      const serviceCall = body.isDraft
        ? Service.saveDraft(formData)
        : Service.createEnquiry(formData)

      await serviceCall
        .then(myToaster)
        .then(() => handleCurrentSlider({ status: false, current: null }))
        .then(getEnquiry)
        .catch(myToaster)
    },
    [getEnquiry, handleCurrentSlider]
  )

  const updateEnquiry = useCallback(
    async (body) => {
      console.log('body update: ', body)
      const formData = new FormData()
      formData.append('name', body.name)
      formData.append('nik', body.nik)

      // Format birthDate to YYYY-MM-DD
      if (body.tanggal_lahir) {
        const d = new Date(body.tanggal_lahir)
        const [birthDate] = d.toISOString().split('T')
        formData.append('birthDate', birthDate)
      }

      // Map gender: Pria → L, Wanita → P
      formData.append('gender', body.jenis_kelamin === 'Pria' ? 'L' : 'P')

      formData.append('address', body.alamat)
      formData.append('phone', body.telepon)
      formData.append('email', body.email)
      formData.append('tempat_lahir', body.tempat_lahir)
      formData.append('kode_pos', body.kode_pos)
      if (body.kelurahan) {
        formData.append('kelurahan_id', body.kelurahan.id)
        formData.append('kelurahan_name', body.kelurahan.name)
      }
      if (body.kota) {
        formData.append('kota_id', body.kota.id)
        formData.append('kota_name', body.kota.name)
      }
      if (body.kecamatan) {
        formData.append('kecamatan_id', body.kecamatan.id)
        formData.append('kecamatan_name', body.kecamatan.name)
      }
      formData.append('nama_ibu', body.nama_ibu)
      formData.append('agreement', body.agreement)
      if (body.tnc !== undefined && body.tnc !== null) {
        formData.append('agreement_tnc', body.tnc)
      }
      if (body.tujuan_permintaan) {
        formData.append('tujuan_permintaan', body.tujuan_permintaan.value)
      }
      formData.append('penjelasan', body.penjelasan || '')
      if (body.photo && body.photo instanceof File) {
        formData.append('photo', body.photo)
      }
      if (body.photo_selfie && body.photo_selfie instanceof File) {
        formData.append('photo_selfie', body.photo_selfie)
      }
      if (body.signature && body.signature instanceof File) {
        formData.append('signature', body.signature)
      }

      await Service.updateEnquiry(currentSlider?.id, formData)
        .then(myToaster)
        .then(() => handleCurrentSlider({ status: false, current: null }))
        .then(getEnquiry)
        .then(getSession)
        .catch(myToaster)
    },
    [currentSlider?.id, getSession, getEnquiry, handleCurrentSlider]
  )

  const restoreEnquiry = useCallback(
    async (data) => {
      await Service.restoreEnquiry({ ids: data })
        .then(myToaster)
        .then(getEnquiry)
        .then(setCheck(null))
        .catch(myToaster)
    },
    [getEnquiry]
  )

  const deleteEnquiry = useCallback(
    async (data) => {
      await Service.deleteEnquiry({ ids: data })
        .then(myToaster)
        .then(getEnquiry)
        .then(() => setCheck([]))
        .catch(myToaster)
    },
    [getEnquiry]
  )

  const bulkSubmitEnquiry = useCallback(
    async (ids) => {
      if (!ids?.length) {
        myToaster({ message: 'No draft enquiries to submit' })
        return
      }
      await Service.bulkSubmitEnquiry({ ids })
        .then(myToaster)
        .then(getEnquiry)
        .then(() => setCheck([]))
        .catch(myToaster)
    },
    [getEnquiry]
  )

  const enableEnquiry = useCallback(
    async (id) => {
      await Service.enableEnquiry(id)
        .then(myToaster)
        .then(getEnquiry)
        .catch(myToaster)
        .finally(() => {
          handleCurrentModal(null)
          handleCurrentSlider({ status: false, current: null })
        })
    },
    [getEnquiry]
  )

  const importEnquiry = useCallback((values, config) => {
    const formData = new FormData()
    formData.append('enquiry', values.enquiry)
    return Service.importEnquiry(formData, config)
  }, [])

  const downloadTemplateImport = useCallback(() => {
    const url = Service.downloadTemplateImport()
    window.open(url, '_blank').focus()
  }, [])

  const downloadExport = useCallback(() => {
    const url = Service.downloadExport(params)
    window.open(url, '_blank').focus()
  }, [params])

  const searchEauth = useCallback(
    (searchParams) => Service.searchEauth(searchParams).catch(myToaster),
    []
  )

  const searchInstitution = useCallback(
    (searchParams) => Service.searchInstitution(searchParams).catch(myToaster),
    []
  )
  const searchBranch = useCallback(
    (searchParams) => Service.searchBranch(searchParams).catch(myToaster),
    []
  )
  const searchRole = useCallback(
    (searchParams) => Service.searchRole(searchParams).catch(myToaster),
    []
  )

  useEffect(() => {
    getEnquiry()
    // setCheck([])
  }, [getEnquiry])

  const contextValue = useMemo(
    () => ({
      currentSlider,
      setCurrentSlider,
      handleCurrentSlider,
      params,
      setParams,
      enquiry,
      setEnquiry,
      searchEauth,
      getEnquiry,
      showEnquiry,
      getEnquiryDetail,
      createEnquiry,
      updateEnquiry,
      deleteEnquiry,
      bulkSubmitEnquiry,
      restoreEnquiry,
      importEnquiry,
      downloadTemplateImport,
      downloadExport,
      currentModal,
      setCurrentModal,
      handleCurrentModal,
      handleChangeTabs,
      currentTabs,
      searchInstitution,
      searchBranch,
      searchRole,
      createdPassword,
      setCheck,
      check,
      setIsChanged,
      isChanged,
      enableEnquiry,
      isSignatureModalOpen,
      setIsSignatureModalOpen,
      signatureModalHandlerRef,
    }),
    [
      createEnquiry,
      currentSlider,
      deleteEnquiry,
      bulkSubmitEnquiry,
      downloadExport,
      downloadTemplateImport,
      getEnquiryDetail,
      getEnquiry,
      handleCurrentSlider,
      importEnquiry,
      params,
      restoreEnquiry,
      searchEauth,
      showEnquiry,
      enquiry,
      updateEnquiry,
      currentModal,
      setCurrentModal,
      handleCurrentModal,
      handleChangeTabs,
      currentTabs,
      searchInstitution,
      searchBranch,
      searchRole,
      setCheck,
      check,
      setIsChanged,
      isChanged,
      enableEnquiry,
      isSignatureModalOpen,
    ]
  )

  return <EnquiryContext.Provider value={contextValue}>{children}</EnquiryContext.Provider>
}

const useEnquiry = () => {
  const context = useContext(EnquiryContext)
  if (!context) throw new Error('useEnquiry must be used within EnquiryProvider')
  return context
}

export { EnquiryProvider, useEnquiry }
