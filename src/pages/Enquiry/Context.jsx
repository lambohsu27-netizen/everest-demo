import { createContext, useState, useEffect, useCallback, useMemo, useContext } from 'react'
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
      // console.log('body create: ', body)
      const formData = new FormData()
      formData.append('name', body.name)
      formData.append('email', body.email)
      formData.append('nip', body.nip)
      formData.append('whatsapp', body.whatsapp)
      formData.append('role_id', body.role.id)
      formData.append('branch_id', body.branch.id)
      formData.append('password', body.password)
      if (body.photo) {
        formData.append('photo', body.photo)
      }

      await Service.createEnquiry(formData)
        .then(myToaster)
        .then(() => handleCurrentSlider({ status: false, current: null }))
        .then(getEnquiry)
        .catch(myToaster)
    },
    [getEnquiry, handleCurrentSlider]
  )

  const updateEnquiry = useCallback(
    async (body) => {
      // console.log('edit body: ', body)
      const formData = new FormData()
      formData.append('name', body.name)
      formData.append('email', body.email)
      formData.append('nip', body.nip)
      formData.append('whatsapp', body.whatsapp)
      formData.append('role_id', body.role.id)
      formData.append('branch_id', body.branch.id)
      if (body.password) {
        formData.append('password', body.password)
      } // make password not sent when body.password is empty
      if (!body?.delete_photo) {
        formData.append('delete_photo', false)
      }
      if (body.photo) formData.append('photo', body.photo)
      formData.append('delete_photo', body.delete_photo)

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
        .then(setCheck(null))
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

  // useEffect(() => {
  //   getEnquiry(params)
  //   setCheck([])
  // }, [getEnquiry, params])

  // Utils
  const generatePassword = useCallback((setValueCallback) => {
    const length = 8
    let password = ''

    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    const lowercase = 'abcdefghijklmnopqrstuvwxyz'
    const numbers = '0123456789'
    const specialCharacters = '!@#$%^&*+=-'

    const allCharacters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxy0123456789!@#$%^&*+=-'

    password += uppercase.charAt(Math.floor(Math.random() * uppercase.length))
    password += lowercase.charAt(Math.floor(Math.random() * lowercase.length))
    password += numbers.charAt(Math.floor(Math.random() * numbers.length))
    password += specialCharacters.charAt(Math.floor(Math.random() * specialCharacters.length))

    // Generate the rest of the password
    for (let i = 4; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * allCharacters.length)
      password += allCharacters.charAt(randomIndex)
    }

    setCreatedPassword(password)
    if (setValueCallback) {
      setValueCallback('password', password)
    }
  }, [])

  const copyToClipboard = (text) => {
    const textarea = document.createElement('textarea')
    textarea.value = text
    textarea.setAttribute('readonly', '')
    textarea.style.position = 'absolute'
    textarea.style.left = '-9999px'
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand('copy')
    document.body.removeChild(textarea)
  }

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
      generatePassword,
      setCheck,
      check,
      copyToClipboard,
      setIsChanged,
      isChanged,
      enableEnquiry,
    }),
    [
      createEnquiry,
      currentSlider,
      deleteEnquiry,
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
      createdPassword,
      generatePassword,
      setCheck,
      check,
      setIsChanged,
      isChanged,
      enableEnquiry,
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
