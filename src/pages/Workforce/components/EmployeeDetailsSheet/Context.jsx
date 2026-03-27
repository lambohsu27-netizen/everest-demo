import { createContext, useState, useMemo, useContext } from 'react'

const EmployeeDetailsSheetContext = createContext()

function EmployeeDetailsSheetProvider({ children }) {
  const [currentTabs, setCurrentTabs] = useState({
    type: 'report', // 'report' or 'personal_information'
  })

  const indicators = useMemo(
    () => [
      { label: 'Financial responsibility', value: '3 / 10' },
      { label: 'Debt burden', badge: 'High', badgeColor: 'error' },
      { label: 'Payment Discipline', value: '2 / 10' },
      { label: 'Contact reputation', value: '5 / 10' },
      { label: 'Employment stability', value: '4 / 10' },
      { label: 'Legal exposure', value: '7 / 10' },
      { label: 'Overall risk', badge: 'High', badgeColor: 'error' },
    ],
    []
  )

  // Add more state/logic as needed, following EnquiryContext pattern
  const contextValue = useMemo(
    () => ({
      currentTabs,
      setCurrentTabs,
      indicators,
    }),
    [currentTabs, indicators]
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
