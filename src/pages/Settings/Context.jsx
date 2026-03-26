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

const INITIAL_ROLES = [
  { id: 1, name: 'Super admin' },
  { id: 2, name: 'Area manager' },
  { id: 3, name: 'Warehouse manager' },
  { id: 4, name: 'Team leader' },
  { id: 5, name: 'Field Technician' },
  { id: 6, name: 'Help Desk' },
  { id: 7, name: 'Warehouse staff' },
]

function SettingsProvider({ children }) {
  // General Settings State
  const [sessionTimeout, setSessionTimeout] = useState('30')
  const [verificationThreshold, setVerificationThreshold] = useState('85')

  // User Role Access State
  const [users, setUsers] = useState(INITIAL_USERS)
  const [roles, setRoles] = useState(INITIAL_ROLES)
  const [searchTerm, setSearchTerm] = useState('')
  const [roleSearchTerm, setRoleSearchTerm] = useState('')
  const [sortField, setSortField] = useState(null)
  const [sortOrder, setSortOrder] = useState(null)
  const [roleSortField, setRoleSortField] = useState(null)
  const [roleSortOrder, setRoleSortOrder] = useState(null)
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

  const handleRoleSort = useCallback(({ sort, order }) => {
    setRoleSortField(sort)
    setRoleSortOrder(order)
    
    if (!sort || !order) {
      setRoles(INITIAL_ROLES)
      return
    }

    const sortedData = [...roles].sort((a, b) => {
      const valA = a[sort] || ''
      const valB = b[sort] || ''

      if (valA < valB) return order === 'asc' ? -1 : 1
      if (valA > valB) return order === 'asc' ? 1 : -1
      return 0
    })

    setRoles(sortedData)
  }, [roles])

  const handleSelectionChange = useCallback((updated) => {
    setUsers(updated.data)
  }, [])

  const handleRoleSelectionChange = useCallback((updated) => {
    setRoles(updated.data)
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

  const filteredRoles = useMemo(() => {
    let result = roles
    if (roleSearchTerm) {
      const lowerSearch = roleSearchTerm.toLowerCase()
      result = result.filter(r => r.name.toLowerCase().includes(lowerSearch))
    }
    return result
  }, [roles, roleSearchTerm])

  const contextValue = useMemo(() => ({
    // General Settings
    sessionTimeout,
    setSessionTimeout,
    verificationThreshold,
    setVerificationThreshold,

    // User Role Access
    users: filteredUsers,
    roles: filteredRoles,
    searchTerm,
    setSearchTerm,
    roleSearchTerm,
    setRoleSearchTerm,
    sortField,
    sortOrder,
    handleSort,
    roleSortField,
    roleSortOrder,
    handleRoleSort,
    handleSelectionChange,
    handleRoleSelectionChange,
    selectedStatus,
    setSelectedStatus,
    activeSubTab,
    setActiveSubTab,
  }), [
    sessionTimeout,
    verificationThreshold,
    filteredUsers,
    filteredRoles,
    searchTerm,
    roleSearchTerm,
    sortField,
    sortOrder,
    handleSort,
    roleSortField,
    roleSortOrder,
    handleRoleSort,
    handleSelectionChange,
    handleRoleSelectionChange,
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
