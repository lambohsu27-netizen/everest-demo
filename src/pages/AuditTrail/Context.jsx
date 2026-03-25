import { createContext, useCallback, useContext, useMemo, useState } from 'react'

const AuditTrailContext = createContext()

const INITIAL_AUDIT_TRAIL = [
  {
    id: 1,
    timestamp: '28 May 2023 • 11:41am',
    event: 'Login',
    module: 'Authentication',
    user: 'Hermawan',
    userEmail: 'hermawan@verify.com',
    remarks: 'User "Olivia Rhye" logged in to the system',
  },
  {
    id: 2,
    timestamp: '28 May 2023 • 11:23am',
    event: 'Create Request',
    module: 'Application Enquiry',
    user: 'Bella Aditya',
    userEmail: 'bella@verify.com',
    remarks: 'User "Olivia Rhye" created a new credit enquiry request',
  },
  {
    id: 3,
    timestamp: '28 May 2023 • 11:22am',
    event: 'Send Form Link',
    module: 'Application Enquiry',
    user: 'Fitri Lestari',
    userEmail: 'fitri@verify.com',
    remarks: 'System sent form link to employee via WhatsApp',
  },
  {
    id: 4,
    timestamp: '28 May 2023 • 11:10am',
    event: 'Submit Form',
    module: 'Employee Form',
    user: 'Dian Kurnia',
    userEmail: 'kurnia@verify.com',
    remarks: 'Employee completed and submitted the form',
  },
  {
    id: 5,
    timestamp: '28 May 2023 • 11:06am',
    event: 'Liveness Verified',
    module: 'Identity Verification',
    user: 'Bintang Jaya',
    userEmail: 'bintang@verify.com',
    remarks: 'System successfully verified liveness detection',
  },
  {
    id: 6,
    timestamp: '28 May 2023 • 11:02am',
    event: 'Face Match Passed',
    module: 'Identity Verification',
    user: 'Jundi Febrian',
    userEmail: 'jundi@verify.com',
    remarks: 'System completed face recognition successfully',
  },
  {
    id: 7,
    timestamp: '28 May 2023 • 10:59am',
    event: 'Upload E-KTP',
    module: 'Identity Verification',
    user: 'Adlian',
    userEmail: 'adlian@verify.com',
    remarks: 'Employee uploaded E-KTP photo',
  },
  {
    id: 8,
    timestamp: '28 May 2023 • 10:41am',
    event: 'Approve Identity',
    module: 'OCR Verification',
    user: 'HR',
    userEmail: 'HR Adminhr@company.com',
    remarks: 'User "HR Admin" approved identity verification',
  }
]

function AuditTrailProvider({ children }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [auditTrails, setAuditTrails] = useState(INITIAL_AUDIT_TRAIL)
  const [sortField, setSortField] = useState(null)
  const [sortOrder, setSortOrder] = useState(null)

  const handleSort = useCallback(
    ({ sort, order }) => {
      setSortField(sort)
      setSortOrder(order)

      if (!sort || !order) {
        setAuditTrails(INITIAL_AUDIT_TRAIL)
        return
      }

      const sortedData = [...auditTrails].sort((a, b) => {
        const valA = a[sort] || ''
        const valB = b[sort] || ''

        if (valA < valB) return order === 'asc' ? -1 : 1
        if (valA > valB) return order === 'asc' ? 1 : -1
        return 0
      })

      setAuditTrails(sortedData)
    },
    [auditTrails]
  )

  const filteredAuditTrails = useMemo(() => {
    let result = auditTrails
    
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase()
      result = result.filter(c => 
        c.event.toLowerCase().includes(lowerSearch) || 
        c.module.toLowerCase().includes(lowerSearch) ||
        c.user.toLowerCase().includes(lowerSearch) ||
        c.remarks.toLowerCase().includes(lowerSearch)
      )
    }
    return result
  }, [auditTrails, searchTerm])

  const contextValue = useMemo(
    () => ({
      searchTerm,
      setSearchTerm,
      auditTrails: filteredAuditTrails,
      handleSort,
      sortField,
      sortOrder,
    }),
    [
      searchTerm,
      filteredAuditTrails,
      handleSort,
      sortField,
      sortOrder,
    ]
  )

  return <AuditTrailContext.Provider value={contextValue}>{children}</AuditTrailContext.Provider>
}

const useAuditTrail = () => {
  const context = useContext(AuditTrailContext)
  if (context === undefined) {
    throw new Error('useAuditTrail must be used within an AuditTrailProvider')
  }
  return context
}

export { AuditTrailProvider, useAuditTrail }
