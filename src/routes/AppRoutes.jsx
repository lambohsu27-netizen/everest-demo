import { Navigate, Route, Routes } from 'react-router-dom'
import VersionPage from '@src/pages/VersionPage'
import WelcomePageBoilerPlate from '@src/pages/WelcomePageBoilerPlate'
import ComponentReview from '@src/pages/component-review'
import UITemplate from '@src/pages/ui-template'
import HomePage from '@src/pages/HomePage'

// eslint-disable-next-line import/prefer-default-export
export function UnauthenticatedRoutes() {
  return (
    <Routes>
      {/* <Route path="*" element={<Navigate to="/welcome" replace />} /> */}
      <Route path="/" element={<HomePage />} />
      {/* <Route
        path="/login"
        element={
          <LoginProvider>
            <Login />
          </LoginProvider>
        }
      /> */}
      {/* <Route
        path="/forget-password"
        element={
          <ForgetPasswordProvider>
            <ForgetPassword />
          </ForgetPasswordProvider>
        }
      /> */}
      <Route path="/welcome" element={<WelcomePageBoilerPlate />} />
      <Route path="/version" element={<VersionPage />} />
      <Route path="/component-review" element={<ComponentReview />} />
      <Route path="/ui-template" element={<UITemplate />} />
    </Routes>
  )
}
