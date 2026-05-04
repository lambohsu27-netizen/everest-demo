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
import { get, post, getCookie } from './services/NetworkUtils'

const AppService = {
  getSession: async () => await get('/v1/auth/session'),
  logout: async (data) => await post('/v1/auth/logout', data),
}

const AppContext = createContext()

function AppProvider({ children }) {
  const [slider, setSlider] = useState(false)
  const [cookies, , removeCookie] = useCookies(['token-backoffice'])
  const [user, setUser] = useState(null)
  const [permissions, setPermissions] = useState([])
  const [permissionsLoaded, setPermissionsLoaded] = useState(false)
  const location = useLocation()
  const timerRef = useRef(null)
  // Read pathname via ref so getSession's identity is stable across navigations.
  // Previously [location.pathname] was a useCallback dep, which made getSession a
  // brand-new function on every nav and re-fired the mounting effect each click.
  const pathnameRef = useRef(location.pathname)
  pathnameRef.current = location.pathname

  const getSession = useCallback(
    () =>
      AppService.getSession()
        .then((res) => {
          const userData = res?.data?.user
          setUser({
            ...userData,
            photo_url: userData?.avatar_url
              ? `${userData.avatar_url}?time=${new Date().getTime()}`
              : null,
          })
          setPermissions(res?.data?.permissions ?? [])
          setPermissionsLoaded(true)
        })
        .catch((err) => {
          setPermissionsLoaded(true)
          if (pathnameRef.current !== '/login') {
            myToaster(err)
          }
        }),
    []
  )

  const hasPermission = useCallback(
    (moduleKey, subPermission = null) => {
      const perm = permissions.find((p) => p.module_key === moduleKey)
      if (!perm) return false
      if (subPermission === null) return true
      return perm.sub_permissions.includes(subPermission)
    },
    [permissions]
  )

  const logoutFunction = useCallback((refreshToken) => {
    AppService.logout({ refresh_token: refreshToken })
      .then(() => {})
      .catch((err) => {
        console.warn(err)
      })
  }, [])

  //   const getAccess = useCallback(
  //     (accesName) => accesses?.find((acc) => acc.name === accesName),
  //     [accesses]
  //   )

  const logout = useCallback(() => {
    const refreshToken = getCookie('refresh-token-backoffice')
    logoutFunction(refreshToken)
    localStorage.removeItem('user_id')
    localStorage.removeItem('RrwF57&aRMoR5Eq23#Mi') // user_id
    localStorage.removeItem('email_forget_password')
    localStorage.removeItem('countdown_to_new_otp')
    removeCookie('token-backoffice', { path: '/' })
    removeCookie('refresh-token-backoffice', { path: '/' })
  }, [logoutFunction, removeCookie])

  useEffect(() => {
    if (location.pathname !== '/login' && cookies['token-backoffice']) {
      getSession()
    }
    // getSession is stable (deps: []); we only want to refetch when the auth cookie
    // appears/disappears or the route enters/leaves /login — not on every tab click.
  }, [cookies, location.pathname, getSession])

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
      permissions,
      permissionsLoaded,
      hasPermission,
      slider,
      setSlider,
      getSession,
      logout,
    }),
    [user, permissions, permissionsLoaded, hasPermission, slider, getSession, logout]
  )

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
}

const useApp = () => {
  const context = useContext(AppContext)
  if (!context) throw new Error('useApp must be used within a AppProvider')
  return context
}

export { AppProvider, useApp }
