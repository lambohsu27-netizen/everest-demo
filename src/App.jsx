import './App.css'
import { useCookies } from 'react-cookie'
import { ToastContainer } from 'react-toastify'
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
