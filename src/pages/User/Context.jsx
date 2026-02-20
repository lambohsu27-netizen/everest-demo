import { createContext, useState, useEffect, useCallback, useMemo, useContext } from 'react'
import { myToaster } from '@interstellar-component'
import Service from './service'
import { useApp } from '../../AppContext'

const UserContext = createContext()

function UserProvider({ children }) {
  const { setSlider, getSession } = useApp()
  const [createdPassword, setCreatedPassword] = useState(null)
  const [user, setUser] = useState({
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

  const getUser = useCallback(
    () =>
      Service.getUser(params)
        .then((res) => {
          setUser({ data: res.data, filter: res.filter, meta: res.meta })
        })
        .catch(myToaster),
    [params]
  )

  const showUser = useCallback(
    (id) =>
      Service.showUser(id)
        .then((res) => res.data)
        .catch(myToaster),
    []
  )

  // Details-Slider
  const getUserDetail = useCallback(
    async (id) =>
      await Service.getUserDetail(id, params)
        .then((res) => res)
        .catch(myToaster),
    [params]
  )

  const createUser = useCallback(
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

      await Service.createUser(formData)
        .then(myToaster)
        .then(() => handleCurrentSlider({ status: false, current: null }))
        .then(getUser)
        .catch(myToaster)
    },
    [getUser, handleCurrentSlider]
  )

  const updateUser = useCallback(
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

      await Service.updateUser(currentSlider?.id, formData)
        .then(myToaster)
        .then(() => handleCurrentSlider({ status: false, current: null }))
        .then(getUser)
        .then(getSession)
        .catch(myToaster)
    },
    [currentSlider?.id, getSession, getUser, handleCurrentSlider]
  )

  const restoreUser = useCallback(
    async (data) => {
      await Service.restoreUser({ ids: data })
        .then(myToaster)
        .then(getUser)
        .then(setCheck(null))
        .catch(myToaster)
    },
    [getUser]
  )

  const deleteUser = useCallback(
    async (data) => {
      await Service.deleteUser({ ids: data })
        .then(myToaster)
        .then(getUser)
        .then(setCheck(null))
        .catch(myToaster)
    },
    [getUser]
  )

  const enableUser = useCallback(
    async (id) => {
      await Service.enableUser(id)
        .then(myToaster)
        .then(getUser)
        .catch(myToaster)
        .finally(() => {
          handleCurrentModal(null)
          handleCurrentSlider({ status: false, current: null })
        })
    },
    [getUser]
  )

  const importUser = useCallback((values, config) => {
    const formData = new FormData()
    formData.append('user', values.user)
    return Service.importUser(formData, config)
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
  //   getUser(params)
  //   setCheck([])
  // }, [getUser, params])

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
      user,
      setUser,
      searchEauth,
      getUser,
      showUser,
      getUserDetail,
      createUser,
      updateUser,
      deleteUser,
      restoreUser,
      importUser,
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
      enableUser,
    }),
    [
      createUser,
      currentSlider,
      deleteUser,
      downloadExport,
      downloadTemplateImport,
      getUserDetail,
      getUser,
      handleCurrentSlider,
      importUser,
      params,
      restoreUser,
      searchEauth,
      showUser,
      user,
      updateUser,
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
      enableUser,
    ]
  )

  return <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
}

const useUser = () => {
  const context = useContext(UserContext)
  if (!context) throw new Error('useUser must be used within UserProvider')
  return context
}

export { UserProvider, useUser }
