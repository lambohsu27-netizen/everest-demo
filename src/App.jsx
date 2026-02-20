import './App.css'
import { useCookies } from 'react-cookie'
import { ToastContainer } from 'react-toastify'

import { UnauthenticatedRoutes } from './routes/AppRoutes'
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
      <LoginProvider>
        <Navigation />
      </LoginProvider>
      <UnauthenticatedRoutes />
    </>
  )
}
