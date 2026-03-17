import { createContext, useContext, useMemo, useState } from 'react'

const RegisterCompanyInfoContext = createContext()

function RegisterCompanyInfoProvider({ children }) {
  const [companyData, setCompanyData] = useState({})

  const contextValue = useMemo(
    () => ({
      companyData,
      setCompanyData,
    }),
    [companyData]
  )

  return (
    <RegisterCompanyInfoContext.Provider value={contextValue}>
      {children}
    </RegisterCompanyInfoContext.Provider>
  )
}

const useRegisterCompanyInfo = () => {
  const context = useContext(RegisterCompanyInfoContext)
  if (context === undefined) {
    throw new Error('useRegisterCompanyInfo must be used within a RegisterCompanyInfoProvider')
  }
  return context
}

export { RegisterCompanyInfoProvider, useRegisterCompanyInfo }
