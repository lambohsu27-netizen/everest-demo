import './App.css'
import { useEffect, useRef } from 'react'
import { useCookies } from 'react-cookie'
import { ToastContainer, toast } from 'react-toastify'
import { useLocation } from 'react-router-dom'

import { AuthenticatedRoutes, UnauthenticatedRoutes } from './routes/AppRoutes'
import Navigation from './pages/Navigation/Navigation'
import { LoginProvider } from './pages/Login/Context'

const ROUTES_WITHOUT_NAV = ['/register-company-info']

export default function App() {
  const [cookies] = useCookies(['token-backoffice'])
  const location = useLocation()

  const isBypassAuth = import.meta.env.VITE_APP_BYPASS_AUTH === 'true'
  const isAuthenticated = cookies['token-backoffice'] || isBypassAuth
  const showNavigation = !ROUTES_WITHOUT_NAV.includes(location.pathname)

  // Dismiss any leftover toasts the moment the auth cookie appears (i.e. the user
  // just logged in). Without this, the "Login successful." toast lingers for the
  // full autoClose window — and because pauseOnHover/pauseOnFocusLoss can extend
  // that window indefinitely, the user sees it bouncing around as the App tree
  // re-renders during the auth transition and tab navigation, perceived as the
  // toast firing "over and over again".
  const prevAuthRef = useRef(isAuthenticated)
  useEffect(() => {
    if (!prevAuthRef.current && isAuthenticated) {
      // Slight delay so the success toast has a chance to render first; then
      // we let it dismiss on the next animation frame the user sees the auth tree.
      const t = setTimeout(() => toast.dismiss(), 1500)
      return () => clearTimeout(t)
    }
    prevAuthRef.current = isAuthenticated
  }, [isAuthenticated])

  return (
    <>
      <ToastContainer
        containerId="default"
        autoClose={5000}
        closeButton={false}
        enableMultiContainer
        hideProgressBar
        newestOnTop
        pauseOnFocusLoss
        draggable
        pauseOnHover
        closeOnClick
      />
      {isAuthenticated ? (
        <div id="main-content" className="relative w-full overflow-hidden md:flex">
          {showNavigation && (
            <LoginProvider>
              <Navigation />
            </LoginProvider>
          )}

          <div
            className={`${
              showNavigation ? 'md:flex-1 pt-16 md:pt-0' : 'w-full'
            } relative w-full h-[100dvh] md:h-[100vh] overflow-hidden box-border`}
          >
            <AuthenticatedRoutes />
          </div>
        </div>
      ) : (
        <LoginProvider>
          <UnauthenticatedRoutes />
        </LoginProvider>
      )}
    </>
  )
}
