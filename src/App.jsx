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
      {cookies['token-backoffice'] ? (
        <div id="main-content" className="relative flex w-full">
          <LoginProvider>
            <Navigation />
          </LoginProvider>

          <div className="flex-1 h-[100vh] mt-16 md:mt-0 overflow-y-auto">
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
