import { createContext, useCallback, useContext, useMemo, useState } from 'react'

const SettingsContext = createContext()

const INITIAL_USERS = [
  {
    id: 1,
    name: 'Drew Cano',
    role: 'Field Technician',
    status: 'Active',
    email: 'drew.cano@everest.io',
    phone: '+62 817 8817 3723',
    company: 'Everest',
    avatar: 'https://i.pravatar.cc/150?u=1'
  },
  {
    id: 2,
    name: 'Natali Craig',
    role: 'Help Desk',
    status: 'Active',
    email: 'natali.craig@everest.io',
    phone: '+62 817 8817 3723',
    company: 'Everest',
    avatar: 'https://i.pravatar.cc/150?u=2'
  },
  {
    id: 3,
    name: 'Ammar Foley',
    role: 'Field Technician',
    status: 'Inactive',
    email: 'ammar.foley@everest.io',
    phone: '+62 817 8817 3723',
    company: 'Everest',
    avatar: 'https://i.pravatar.cc/150?u=3'
  },
  {
    id: 4,
    name: 'Loki Bright',
    role: 'Field Technician',
    status: 'Inactive',
    email: 'loki.bright@everest.io',
    phone: '+62 817 8817 3723',
    company: 'Everest',
    avatar: 'https://i.pravatar.cc/150?u=4'
  },
  {
    id: 5,
    name: 'Julius Vaughan',
    role: 'Field Technician',
    status: 'Inactive',
    email: 'julius.vaughan@everest.io',
    phone: '+62 817 8817 3723',
    company: 'Everest',
    avatar: 'https://i.pravatar.cc/150?u=5'
  },
  {
    id: 6,
    name: 'Mathilde Lewis',
    role: 'Help Desk',
    status: 'Inactive',
    email: 'mathilder.lewis@everest.io',
    phone: '+62 817 8817 3723',
    company: 'Everest',
    avatar: 'https://i.pravatar.cc/150?u=6'
  }
]

function SettingsProvider({ children }) {
  // General Settings State
  const [sessionTimeout, setSessionTimeout] = useState('30')
  const [verificationThreshold, setVerificationThreshold] = useState('85')

  // User Role Access State
  const [users, setUsers] = useState(INITIAL_USERS)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortField, setSortField] = useState(null)
  const [sortOrder, setSortOrder] = useState(null)
  const [selectedStatus, setSelectedStatus] = useState('Active')
  const [activeSubTab, setActiveSubTab] = useState('user')

  const handleSort = useCallback(({ sort, order }) => {
    setSortField(sort)
    setSortOrder(order)
    
    if (!sort || !order) {
      setUsers(INITIAL_USERS)
      return
    }

    const sortedData = [...users].sort((a, b) => {
      const valA = a[sort] || ''
      const valB = b[sort] || ''

      if (valA < valB) return order === 'asc' ? -1 : 1
      if (valA > valB) return order === 'asc' ? 1 : -1
      return 0
    })

    setUsers(sortedData)
  }, [users])

  const handleSelectionChange = useCallback((updated) => {
    // Note: The Workforce pattern seems to update the data in context when selection changes
    // which might include the 'checked' state if handled by MyDataTable
    setUsers(updated.data)
  }, [])

  const filteredUsers = useMemo(() => {
    let result = users
    if (selectedStatus) {
      result = result.filter(u => u.status === selectedStatus)
    }
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase()
      result = result.filter(u => 
        u.name.toLowerCase().includes(lowerSearch) || 
        u.email.toLowerCase().includes(lowerSearch) ||
        u.role.toLowerCase().includes(lowerSearch)
      )
    }
    return result
  }, [users, selectedStatus, searchTerm])

  const contextValue = useMemo(() => ({
    // General Settings
    sessionTimeout,
    setSessionTimeout,
    verificationThreshold,
    setVerificationThreshold,

    // User Role Access
    users: filteredUsers,
    searchTerm,
    setSearchTerm,
    sortField,
    sortOrder,
    handleSort,
    handleSelectionChange,
    selectedStatus,
    setSelectedStatus,
    activeSubTab,
    setActiveSubTab,
  }), [
    sessionTimeout,
    verificationThreshold,
    filteredUsers,
    searchTerm,
    sortField,
    sortOrder,
    handleSort,
    handleSelectionChange,
    selectedStatus,
    activeSubTab,
  ])

  return <SettingsContext.Provider value={contextValue}>{children}</SettingsContext.Provider>
}

const useSettings = () => {
  const context = useContext(SettingsContext)
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider')
  }
  return context
}

export { SettingsProvider, useSettings }
