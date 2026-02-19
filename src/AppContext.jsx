import {
  useEffect,
  React,
  useCallback,
  createContext,
  useContext,
  useState,
  useMemo,
  useRef,
} from 'react'
import { useLocation } from 'react-router-dom'
import { useCookies } from 'react-cookie'
import { myToaster } from '@interstellar-component'
import { get, post } from './services/NetworkUtils'

const AppService = {
  getSession: async () => await get('/v1/auth/session'),
  logout: async (data) => await post('/v1/auth/logout', data),
}

const AppContext = createContext()

function AppProvider({ children }) {
  const [slider, setSlider] = useState(false)
  const [cookies, , removeCookie] = useCookies(['token-backoffice'])
  const [user, setUser] = useState(null)
  //   const [accesses, setAccesses] = useState([])
  //   const [shouldChangePassword, setShouldChangePassword] = useState(false)
  const location = useLocation()
  const timerRef = useRef(null)

  //   const getSession = useCallback(
  //     () =>
  //       AppService.getSession()
  //         .then((res) => {
  //           setUser({
  //             ...res?.data,
  //             photo_url: `${res.data.photo_url}?time=${new Date().getTime()}`,
  //           })
  //           setShouldChangePassword(!!res?.data?.should_change_password)
  //         })
  //         .catch((err) => {
  //           if (location.pathname !== '/login') {
  //             myToaster(err)
  //           }
  //         }),
  //     [location.pathname]
  //   )

  //   const logoutFunction = useCallback((user_id) => {
  //     const formData = new FormData()

  //     formData.append('user_id', user_id)
  //     AppService.logout(formData)
  //       .then((res) => {})
  //       .catch((err) => {
  //         console.warn(err)
  //       })
  //   }, [])

  //   const getAccess = useCallback(
  //     (accesName) => accesses?.find((acc) => acc.name === accesName),
  //     [accesses]
  //   )

  //   const logout = useCallback(() => {
  //     const user_id = localStorage.getItem('RrwF57&aRMoR5Eq23#Mi')
  //     logoutFunction(user_id)
  //     localStorage.removeItem('user_id')
  //     localStorage.removeItem('RrwF57&aRMoR5Eq23#Mi') // user_id
  //     localStorage.removeItem('email_forget_password')
  //     localStorage.removeItem('countdown_to_new_otp')
  //     removeCookie('token-backoffice', {
  //       path: '/',
  //     })
  //   }, [removeCookie])

  //   useEffect(() => {
  //     if (location.pathname !== '/login' && cookies['token-backoffice']) {
  //       getSession()
  //     }
  //   }, [cookies, getSession, location.pathname])

  //   useEffect(() => {
  //     const ttl = user?.general?.settings?.logout_timer
  //     if (!ttl) return // no user or no timer → nothing to do

  //     const startTimer = () => {
  //       clearTimeout(timerRef.current)
  //       timerRef.current = setTimeout(logout, ttl * 1000) // seconds → ms
  //     }

  //     // Kick‑off once right now
  //     startTimer()

  //     // Events that reset the timer
  //     const events = ['mousemove', 'keydown', 'click', 'touchstart']
  //     events.forEach((evt) => window.addEventListener(evt, startTimer))

  //     // Cleanup on unmount OR when user/ttl changes
  //     return () => {
  //       clearTimeout(timerRef.current)
  //       events.forEach((evt) => window.removeEventListener(evt, startTimer))
  //     }
  //   }, [user, logout])

  const contextValue = useMemo(
    () => ({
      user,
      slider,
      setSlider,
      //   setAccesses,
      //   accesses,
      //   getAccess,
      //   getSession,
      //   logout,
      //   shouldChangePassword,
      //   setShouldChangePassword,
    }),
    [
      user,
      slider,
      //   accesses, getAccess, getSession, logout, shouldChangePassword
    ]
  )

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
}

const useApp = () => {
  const context = useContext(AppContext)
  if (!context) throw new Error('useApp must be used within a AppProvider')
  return context
}

export { AppProvider, useApp }
