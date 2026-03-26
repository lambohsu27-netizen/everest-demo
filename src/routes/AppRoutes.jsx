import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import VersionPage from '@src/pages/VersionPage'
import WelcomePageBoilerPlate from '@src/pages/WelcomePageBoilerPlate'
import ComponentReview from '@src/pages/component-review'
import UITemplate from '@src/pages/ui-template'
import Dashboard from '@src/pages/Dashboard'
import { DashboardProvider } from '@src/pages/Dashboard/Context'
import ReportEnquiry from '@src/pages/ReportEnquiry'
import { ReportEnquiryProvider } from '@src/pages/ReportEnquiry/Context'
import Workforce from '@src/pages/Workforce'
import { WorkforceProvider } from '@src/pages/Workforce/Context'
import Company from '@src/pages/Company'
import { CompanyProvider } from '@src/pages/Company/Context'
import AuditTrail from '@src/pages/AuditTrail'
import { AuditTrailProvider } from '@src/pages/AuditTrail/Context'
import Legal from '@src/pages/Legal'
import ContactUs from '@src/pages/ContactUs'
import { useEffect, useState, useRef } from 'react'
import NotFound from '@src/pages/NotFound'
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
import RegisterCompanyInfo from '@src/pages/RegisterCompanyInfo'
import { RegisterCompanyInfoProvider } from '@src/pages/RegisterCompanyInfo/Context'

import Settings from '@src/pages/Settings'
import GeneralSettings from '@src/pages/Settings/components/GeneralSettings'
import UserRoleAccess from '@src/pages/Settings/components/UserRoleAccess'
import EmploymentLevel from '@src/pages/Settings/components/EmploymentLevel'
import ConsentEditor from '@src/pages/Settings/components/ConsentEditor'


export function AuthenticatedRoutes() {
  // const { accesses } = useApp()
  const [isLoading, setIsLoading] = useState(true)
  const location = useLocation()
  const previousLocationRaw = useRef(location)
  const [backgroundLocation, setBackgroundLocation] = useState(null)

  const isStackedRoute = (path) => path.startsWith('/settings')

  useEffect(() => {
    if (isStackedRoute(location.pathname)) {
      if (!isStackedRoute(previousLocationRaw.current.pathname)) {
        setBackgroundLocation(previousLocationRaw.current)
      }
    } else {
      setBackgroundLocation(null)
    }
    previousLocationRaw.current = location
  }, [location])

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
    <>
      <Routes location={backgroundLocation || location}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route
        path="/dashboard"
        element={
          <DashboardProvider>
            <Dashboard />
          </DashboardProvider>
        }
      />
      <Route
        path="/report-enquiry"
        element={
          <ReportEnquiryProvider>
            <ReportEnquiry />
          </ReportEnquiryProvider>
        }
      />
      <Route
        path="/workforce"
        element={
          <WorkforceProvider>
            <Workforce />
          </WorkforceProvider>
        }
      />
      <Route
        path="/company"
        element={
          <CompanyProvider>
            <Company />
          </CompanyProvider>
        }
      />
      <Route
        path="/audit-trail"
        element={
          <AuditTrailProvider>
            <AuditTrail />
          </AuditTrailProvider>
        }
      />
      <Route
        path="/legal"
        element={<Legal />}
      />
      <Route
        path="/contact-us"
        element={<ContactUs />}
      />
      <Route path="/settings" element={<Settings />}>
        <Route index element={<Navigate to="general" replace />} />
        <Route path="general" element={<GeneralSettings />} />
        <Route path="user-role-access" element={<UserRoleAccess />} />
        <Route path="employment-level" element={<EmploymentLevel />} />
        <Route path="consent-editor" element={<ConsentEditor />} />
      </Route>
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

      <Route
        path="/register-company-info"
        element={
          <RegisterCompanyInfoProvider>
            <RegisterCompanyInfo />
          </RegisterCompanyInfoProvider>
        }
      />

      <Route path="/404" element={<NotFound />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>

      {backgroundLocation && isStackedRoute(location.pathname) && (
        <Routes location={location}>
          <Route path="/settings" element={<Settings />}>
            <Route index element={<Navigate to="general" replace />} />
            <Route path="general" element={<GeneralSettings />} />
            <Route path="user-role-access" element={<UserRoleAccess />} />
            <Route path="employment-level" element={<EmploymentLevel />} />
            <Route path="consent-editor" element={<ConsentEditor />} />
          </Route>
        </Routes>
      )}
    </>
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
