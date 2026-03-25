import { createContext, useCallback, useContext, useMemo, useState } from 'react'

const WorkforceContext = createContext()

const INITIAL_WORKFORCE = [
  {
    id: 1,
    name: 'Ahmad Ghozali',
    employeeId: 'ID-00192',
    level: 'Supervisor',
    category: 'Employee',
    company: 'PT Everest Maju Sejahtera',
    consentStatus: 'Active',
    consentExpiry: '23 Jan 2025',
    avatar: 'https://i.pravatar.cc/150?u=ID-00192'
  },
  {
    id: 2,
    name: 'Diah Astuti',
    employeeId: 'ID-00193',
    level: 'Staff',
    category: 'Employee',
    company: 'PT Annapurna Berdiri TInggi',
    consentStatus: 'Active',
    consentExpiry: '23 Jan 2025',
    avatar: 'https://i.pravatar.cc/150?u=ID-00193'
  },
  {
    id: 3,
    name: 'Pandu Prakoso',
    employeeId: 'ID-00194',
    level: 'Manager',
    category: 'Employee',
    company: 'PT Annapurna Berdiri TInggi',
    consentStatus: 'Pending',
    consentExpiry: '23 Jan 2025',
    avatar: 'https://i.pravatar.cc/150?u=ID-00194'
  },
  {
    id: 4,
    name: 'Kartini Melviana',
    employeeId: 'ID-00195',
    level: 'Director',
    category: 'Employee',
    company: 'PT Everest Maju Sejahtera',
    consentStatus: 'Expired',
    consentExpiry: '23 Jan 2025',
    avatar: 'https://i.pravatar.cc/150?u=ID-00195'
  },
  {
    id: 5,
    name: 'Liana Semesta',
    employeeId: 'ID-00196',
    level: 'Director',
    category: 'Candidate',
    company: 'PT Annapurna Berdiri TInggi',
    consentStatus: 'Pending',
    consentExpiry: '23 Jan 2025',
    avatar: 'https://i.pravatar.cc/150?u=ID-00196'
  },
  {
    id: 6,
    name: 'Lola Chaniago',
    employeeId: 'ID-00197',
    level: 'Manager',
    category: 'Candidate',
    company: 'PT Everest Maju Sejahtera',
    consentStatus: 'New',
    consentExpiry: '23 Jan 2025',
    avatar: 'https://i.pravatar.cc/150?u=ID-00197'
  },
  {
    id: 7,
    name: 'Satrio Pena',
    employeeId: 'ID-00198',
    level: 'Intern',
    category: 'Candidate',
    company: 'PT Everest Maju Sejahtera',
    consentStatus: 'New',
    consentExpiry: '23 Jan 2025',
    avatar: null
  },
]

function WorkforceProvider({ children }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [workforce, setWorkforce] = useState(INITIAL_WORKFORCE)
  const [sortField, setSortField] = useState(null)
  const [sortOrder, setSortOrder] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState('All category')

  const handleSort = useCallback(
    ({ sort, order }) => {
      setSortField(sort)
      setSortOrder(order)

      if (!sort || !order) {
        setWorkforce(INITIAL_WORKFORCE)
        return
      }

      const sortedData = [...workforce].sort((a, b) => {
        const valA = a[sort] || ''
        const valB = b[sort] || ''

        if (valA < valB) return order === 'asc' ? -1 : 1
        if (valA > valB) return order === 'asc' ? 1 : -1
        return 0
      })

      setWorkforce(sortedData)
    },
    [workforce]
  )

  const handleSelectionChange = useCallback((updated) => {
    setWorkforce(updated.data)
  }, [])

  const filteredWorkforce = useMemo(() => {
    let result = workforce
    if (selectedCategory !== 'All category') {
      result = result.filter(w => w.category === selectedCategory)
    }
    if (searchTerm) {
      result = result.filter(w => 
        w.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        w.employeeId.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    return result
  }, [workforce, selectedCategory, searchTerm])

  const contextValue = useMemo(
    () => ({
      searchTerm,
      setSearchTerm,
      workforce: filteredWorkforce,
      handleSort,
      handleSelectionChange,
      sortField,
      sortOrder,
      selectedCategory,
      setSelectedCategory,
    }),
    [
      searchTerm,
      filteredWorkforce,
      handleSort,
      handleSelectionChange,
      sortField,
      sortOrder,
      selectedCategory,
    ]
  )

  return <WorkforceContext.Provider value={contextValue}>{children}</WorkforceContext.Provider>
}

const useWorkforce = () => {
  const context = useContext(WorkforceContext)
  if (context === undefined) {
    throw new Error('useWorkforce must be used within a WorkforceProvider')
  }
  return context
}

export { WorkforceProvider, useWorkforce }
