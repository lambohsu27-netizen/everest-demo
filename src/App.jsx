import './App.css'
import { useCookies } from 'react-cookie'
import { ToastContainer } from 'react-toastify'

import { AuthenticatedRoutes, UnauthenticatedRoutes } from './routes/AppRoutes'
import Navigation from './pages/Navigation/Navigation'
import { LoginProvider } from './pages/Login/Context'

export default function App() {
  const [cookies] = useCookies(['token-backoffice'])

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
      {cookies['token-backoffice'] || import.meta.env.VITE_APP_BYPASS_AUTH === 'true' ? (
        <div id="main-content" className="relative w-full overflow-x-hidden md:flex">
          <LoginProvider>
            <Navigation />
          </LoginProvider>

          <div className="w-full md:flex-1 h-[100dvh] md:h-[100vh] pt-16 md:pt-0 overflow-y-auto overflow-x-hidden box-border">
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
