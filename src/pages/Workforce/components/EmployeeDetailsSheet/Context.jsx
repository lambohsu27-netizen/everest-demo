import { createContext, useState, useMemo, useContext } from 'react'

const EmployeeDetailsSheetContext = createContext()

function EmployeeDetailsSheetProvider({ children }) {
  const [currentTabs, setCurrentTabs] = useState({
    type: 'report', // 'report' or 'personal_information'
  })

  const indicators = useMemo(
    () => [
      {
        label: 'Financial Responsibility',
        value: '3 / 10',
        tooltip:
          'Indicates how responsibly the individual manages financial obligations based on credit history, repayment behavior, and overall debt management.',
      },
      {
        label: 'Debt Burden',
        badge: 'High',
        badgeColor: 'error',
        tooltip:
          'Evaluates the level of debt relative to the individual’s financial capacity. Lower debt burden suggests a healthier financial position.',
      },
      {
        label: 'Payment Discipline',
        value: '2 / 10',
        tooltip:
          'Measures consistency in making loan or credit payments on time. Frequent delays may indicate higher financial risk.',
      },
      {
        label: 'Contact Reputation',
        value: '5 / 10',
        tooltip:
          'Assesses the reliability and stability of contact information associated with the individual, including phone number patterns and usage history.',
      },
      {
        label: 'Employment Stability',
        value: '4 / 10',
        tooltip:
          'Reflects the consistency of employment history and job tenure, which may indicate income stability and financial reliability.',
      },
      {
        label: 'Legal Exposure',
        value: '7 / 10',
        tooltip:
          'Identifies potential legal records or court decisions that may indicate financial or legal risk associated with the individual.',
      },
      {
        label: 'Overall Risk',
        badge: 'High',
        badgeColor: 'error',
        tooltip:
          'An aggregated risk evaluation derived from financial behavior, credit history, employment stability, and legal indicators.',
      },
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
