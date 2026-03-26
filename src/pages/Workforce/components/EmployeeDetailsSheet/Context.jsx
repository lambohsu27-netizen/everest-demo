import { createContext, useState, useMemo, useContext } from 'react'

const EmployeeDetailsSheetContext = createContext()

function EmployeeDetailsSheetProvider({ children }) {
  const [currentTabs, setCurrentTabs] = useState({
    type: 'report', // 'report' or 'personal_information'
  })

  // Add more state/logic as needed, following EnquiryContext pattern
  const contextValue = useMemo(
    () => ({
      currentTabs,
      setCurrentTabs,
    }),
    [currentTabs]
  )

  return (
    <EmployeeDetailsSheetContext.Provider value={contextValue}>
      {children}
    </EmployeeDetailsSheetContext.Provider>
  )
}

const useEmployeeDetailsSheet = () => {
  const context = useContext(EmployeeDetailsSheetContext)
  if (!context) {
    throw new Error(
      'useEmployeeDetailsSheet must be used within EmployeeDetailsSheetProvider'
    )
  }
  return context
}

export { EmployeeDetailsSheetProvider, useEmployeeDetailsSheet }
