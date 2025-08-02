import { Navigate, Route, Routes } from 'react-router-dom'
import WelcomePageBoilerPlate from '../pages/WelcomePageBoilerPlate'

// eslint-disable-next-line import/prefer-default-export
export function UnauthenticatedRoutes() {
  return (
    <Routes>
      <Route path="*" element={<Navigate to="/welcome" replace />} />
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
    </Routes>
  )
}
