import { createContext, useCallback, useContext, useMemo, useState } from 'react'

const CompanyContext = createContext()

const INITIAL_COMPANY = [
  {
    id: 1,
    name: 'PT Everest Maju Sejahtera',
    companyId: 'ID-00192',
    memberStatus: 'Waiting CLIK approval',
    quotaLeft: '0',
    avatar: null
  },
  {
    id: 2,
    name: 'CV Everest Sentosa',
    companyId: 'ID-00193',
    memberStatus: 'Document submission',
    quotaLeft: '23.407',
    avatar: null
  },
  {
    id: 3,
    name: 'PT Every Estoore',
    companyId: 'ID-00194',
    memberStatus: 'Active',
    quotaLeft: '23.407',
    avatar: null
  },
  {
    id: 4,
    name: 'CV Everest Logistic',
    companyId: 'ID-00194',
    memberStatus: 'Rejected',
    quotaLeft: '23.407',
    avatar: null
  },
]

function CompanyProvider({ children }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [companies, setCompanies] = useState(INITIAL_COMPANY)
  const [sortField, setSortField] = useState(null)
  const [sortOrder, setSortOrder] = useState(null)
  const [selectedStatus, setSelectedStatus] = useState('All status')

  const handleSort = useCallback(
    ({ sort, order }) => {
      setSortField(sort)
      setSortOrder(order)

      if (!sort || !order) {
        setCompanies(INITIAL_COMPANY)
        return
      }

      const sortedData = [...companies].sort((a, b) => {
        const valA = a[sort] || ''
        const valB = b[sort] || ''

        if (valA < valB) return order === 'asc' ? -1 : 1
        if (valA > valB) return order === 'asc' ? 1 : -1
        return 0
      })

      setCompanies(sortedData)
    },
    [companies]
  )

  const handleSelectionChange = useCallback((updated) => {
    setCompanies(updated.data)
  }, [])

  const filteredCompanies = useMemo(() => {
    let result = companies
    if (selectedStatus !== 'All status') {
      result = result.filter(c => c.memberStatus === selectedStatus)
    }
    if (searchTerm) {
      result = result.filter(c => 
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        c.companyId.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    return result
  }, [companies, selectedStatus, searchTerm])

  const contextValue = useMemo(
    () => ({
      searchTerm,
      setSearchTerm,
      companies: filteredCompanies,
      handleSort,
      handleSelectionChange,
      sortField,
      sortOrder,
      selectedStatus,
      setSelectedStatus,
    }),
    [
      searchTerm,
      filteredCompanies,
      handleSort,
      handleSelectionChange,
      sortField,
      sortOrder,
      selectedStatus,
    ]
  )

  return <CompanyContext.Provider value={contextValue}>{children}</CompanyContext.Provider>
}

const useCompany = () => {
  const context = useContext(CompanyContext)
  if (context === undefined) {
    throw new Error('useCompany must be used within a CompanyProvider')
  }
  return context
}

export { CompanyProvider, useCompany }
