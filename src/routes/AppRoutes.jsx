import { Navigate, Route, Routes } from 'react-router-dom'
import VersionPage from '@src/pages/VersionPage'
import WelcomePageBoilerPlate from '@src/pages/WelcomePageBoilerPlate'
import ComponentReview from '@src/pages/component-review'
import UITemplate from '@src/pages/ui-template'
import HomePage from '@src/pages/HomePage'
import { useEffect, useState } from 'react'
import NotFound from '@src/pages/NotFound'
import { useApp } from '@src/AppContext'
import { Access } from '@src/services/Helper'
import Enquiry from '@src/pages/Enquiry'
import { EnquiryProvider } from '@src/pages/Enquiry/Context'
import Login from '@src/pages/Login'
import { LoginProvider } from '@src/pages/Login/Context'
import Register from '@src/pages/Register'
import { RegisterProvider } from '@src/pages/Register/Context'
import MobileSignature from '@src/pages/MobileSignature'
import Profile from '@src/pages/Profile'
import { ProfileProvider } from '@src/pages/Profile/context'
import ForgetPassword from '@src/pages/Forget-password'
import { ForgetPasswordProvider } from '@src/pages/Forget-password/context'

export function AuthenticatedRoutes() {
  // const { accesses } = useApp()
  const [isLoading, setIsLoading] = useState(true)
  const accesses = [
    {
      name: Access?.USER,
      view: true,
    },
  ]

  useEffect(() => {
    if (Access && accesses.length > 0) {
      setIsLoading(false)
    }
  }, [Access, accesses])

  const isAccessAllowed = (accessName) => {
    const filteredAccess = accesses.filter((acc) => acc.view === true)
    const access = filteredAccess.find((acces) => acces.name === accessName)
    if (access) {
      return access
    }
    return false
  }

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<Navigate to="/" replace />} />
      <Route
        path="/profile"
        element={
          <ProfileProvider>
            {isLoading ? null : isAccessAllowed(Access?.USER) ? <Profile /> : <NotFound />}
          </ProfileProvider>
        }
      />
      <Route
        path="/enquiry"
        element={
          <EnquiryProvider>
            {isLoading ? null : isAccessAllowed(Access?.ENQUIRY) ? <Enquiry /> : <NotFound />}
          </EnquiryProvider>
        }
      />

      <Route path="/404" element={<NotFound />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  )
}

export function UnauthenticatedRoutes() {
  // const { accesses } = useApp()
  // make this accessess dummy data
  const accesses = [
    {
      name: Access?.USER,
      view: true,
    },
  ]
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (Access && accesses.length > 0) {
      setIsLoading(false)
    }
  }, [Access, accesses])

  const isAccessAllowed = (accessName) => {
    const filteredAccess = accesses.filter((acc) => acc.view === true)
    const access = filteredAccess.find((acces) => acces.name === accessName)
    if (access) {
      return access
    }
    return null
  }

  return (
    <Routes>
      <Route path="*" element={<Navigate to="/login" replace />} />
      <Route
        path="/login"
        element={
          <LoginProvider>
            <Login />
          </LoginProvider>
        }
      />
      <Route
        path="/register"
        element={
          <RegisterProvider>
            <Register />
          </RegisterProvider>
        }
      />
      <Route
        path="/forget-password"
        element={
          <ForgetPasswordProvider>
            <ForgetPassword />
          </ForgetPasswordProvider>
        }
      />
      <Route path="/welcome" element={<WelcomePageBoilerPlate />} />
      <Route path="/version" element={<VersionPage />} />
      <Route path="/component-review" element={<ComponentReview />} />
      <Route path="/ui-template" element={<UITemplate />} />
      <Route path="/mobile-signature/:roomId" element={<MobileSignature />} />
    </Routes>
  )
}
