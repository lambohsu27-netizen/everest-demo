import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { useCookies } from 'react-cookie'
import CryptoJS from 'crypto-js'

import { myToaster } from '@interstellar-component'

import { LoginService } from './service'
import { useApp } from '../../AppContext'

const LoginContext = createContext()

function LoginProvider({ children }) {
  const { getSession } = useApp()
  const [, setCookie] = useCookies(['token-backoffice'])
  const [User, setUser] = useState()
  const [isProfileSliderOpen, setIsProfileSliderOpen] = useState(false)
  const [currentModal, setCurrentModal] = useState({
    status: false,
    current: null,
    error: null,
  })

  const handleCurrentModal = useCallback((modal) => {
    if (modal && modal.current) {
      setCurrentModal({
        status: true,
        current: modal.current,
        parent_id: modal.parent_id,
        error: modal.error,
      })
    } else {
      setCurrentModal((e) => ({ ...e, current: null }))
      setTimeout(() => {
        setCurrentModal({ current: null })
      }, 200)
    }
  }, [])

  const login = useCallback(
    async (body) => {
      // console.log('body', body)

      const formData = new FormData()
      const encryptedPassword = CryptoJS.AES.encrypt(
        body.password,
        import.meta.env.VITE_APP_SECRET_KEY
      ).toString()
      formData.append('email', body.email)
      formData.append('password', encryptedPassword)

      return await LoginService.login(formData)
        .then(myToaster)
        .then((result) => {
          console.log('result', result)
          localStorage.setItem('RrwF57&aRMoR5Eq23#Mi', result?.user_id) // user_id

          setCookie('token-backoffice', result?.data?.token, {
            path: '/',
          })

          if (body?.remember_me === true) {
            const rememberMeData = {
              email: body.email,
              password: encryptedPassword,
            }
            localStorage.setItem(
              'rv5zzc9noTdU5AD2', // remember_me
              CryptoJS.AES.encrypt(
                JSON.stringify(rememberMeData),
                import.meta.env.VITE_APP_SECRET_KEY
              ).toString()
            )
          } else {
            localStorage.removeItem('rv5zzc9noTdU5AD2')
          }
        })
        .catch((e) => {
          if (e.code) {
            setCurrentModal({
              status: true,
              current: 'alert-modal',
              error: e,
            })
          } else {
            myToaster(e)
          }
        })
    },
    [setCookie]
  )

  const getUser = useCallback(
    async () =>
      await LoginService.detail()
        .then((res) => {
          setUser({ data: res.data })
        })
        .catch(myToaster),
    []
  )

  const changePassword = useCallback(async (body) => {
    console.log(body)
    const formData = new FormData()
    formData.append('old_password', body.old_password)
    formData.append('new_password', body.new_password)
    return await LoginService.changePassword(formData)
      .then((e) => {
        console.log('MASUK KE THEEN?')
        myToaster(e)
        setIsProfileSliderOpen(false)
        getSession()
      })
      .catch((e) => {
        myToaster(e)
        throw e
      })
  }, [])

  const updateProfile = useCallback(
    async (body, shouldChangePassword) => {
      // console.log(body);
      const formData = new FormData()
      formData.append('photo', body.photo)
      if (body.delete_photo) {
        formData.append('delete_photo', body.delete_photo)
      } else {
        formData.append('delete_photo', false)
      }
      formData.append('name', body.name)
      formData.append('username', body.username)
      formData.append('email', body.email)
      formData.append('whatsapp', body.whatsapp)
      return await LoginService.update(formData)
        .then(myToaster)
        .then(getUser)
        .then(getSession)
        .then(shouldChangePassword ? () => {} : setIsProfileSliderOpen(false))
        .catch(myToaster)
    },
    [getSession, getUser]
  )

  const contextValue = useMemo(
    () => ({
      login,
      getUser,
      User,
      updateProfile,
      changePassword,
      isProfileSliderOpen,
      setIsProfileSliderOpen,
      currentModal,
      handleCurrentModal,
    }),
    [
      login,
      getUser,
      updateProfile,
      User,
      changePassword,
      isProfileSliderOpen,
      setIsProfileSliderOpen,
      currentModal,
      handleCurrentModal,
    ]
  )

  return <LoginContext.Provider value={contextValue}>{children}</LoginContext.Provider>
}

const useLogin = () => {
  const context = useContext(LoginContext)
  if (context === undefined) {
    throw new Error('useLogin must be used within a LoginProvider')
  }
  return context
}

export { LoginProvider, useLogin }
