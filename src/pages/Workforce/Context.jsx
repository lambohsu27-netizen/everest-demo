import { createContext, useCallback, useContext, useMemo, useState } from 'react'

const WorkforceContext = createContext()

const INITIAL_WORKFORCE = [
  {
    id: 1,
    name: 'Ahmad Ghozali',
    employeeId: 'ID-00192',
    hasReport: true,
    level: 'Supervisor',
    category: 'Employee',
    company: 'PT Everest Maju Sejahtera',
    consentStatus: 'Active',
    consentExpiry: '23 Jan 2025',
    avatar: 'https://i.pravatar.cc/150?u=ID-00192',
    email: 'ahmad.ghozali@everest.com',
    phoneNumber: '+62 812 3456 7890',
    joinedDate: '12 Jan 2022',
    role: 'Operations Supervisor',
    department: 'Operations',
    employmentType: 'Full-time',
    address: 'Jl. Sudirman No. 123, Jakarta Selatan',
  },
  {
    id: 2,
    name: 'Diah Astuti',
    employeeId: 'ID-00193',
    hasReport: false,
    level: 'Staff',
    category: 'Employee',
    company: 'PT Annapurna Berdiri TInggi',
    consentStatus: 'Active',
    consentExpiry: '23 Jan 2025',
    avatar: 'https://i.pravatar.cc/150?u=ID-00193',
    email: 'diah.astuti@annapurna.com',
    phoneNumber: '+62 813 4567 8901',
    joinedDate: '05 Mar 2023',
    role: 'Administrative Staff',
    department: 'Administration',
    employmentType: 'Full-time',
    address: 'Jl. Thamrin No. 45, Jakarta Pusat',
  },
  {
    id: 3,
    name: 'Pandu Prakoso',
    employeeId: 'ID-00194',
    hasReport: true,
    level: 'Manager',
    category: 'Employee',
    company: 'PT Annapurna Berdiri TInggi',
    consentStatus: 'Pending',
    consentExpiry: '23 Jan 2025',
    avatar: 'https://i.pravatar.cc/150?u=ID-00194',
    email: 'pandu.prakoso@annapurna.com',
    phoneNumber: '+62 814 5678 9012',
    joinedDate: '10 Nov 2021',
    role: 'Human Resources Manager',
    department: 'HR',
    employmentType: 'Full-time',
    address: 'Jl. Gatot Subroto No. 67, Jakarta Selatan',
  },
  {
    id: 4,
    name: 'Kartini Melviana',
    employeeId: 'ID-00195',
    hasReport: true,
    level: 'Director',
    category: 'Employee',
    company: 'PT Everest Maju Sejahtera',
    consentStatus: 'Expired',
    consentExpiry: '23 Jan 2025',
    avatar: 'https://i.pravatar.cc/150?u=ID-00195',
    email: 'kartini.m@everest.com',
    phoneNumber: '+62 815 6789 0123',
    joinedDate: '15 Aug 2020',
    role: 'Finance Director',
    department: 'Finance',
    employmentType: 'Full-time',
    address: 'Jl. Rasuna Said No. 89, Jakarta Selatan',
  },
  {
    id: 5,
    name: 'Liana Semesta',
    employeeId: 'ID-00196',
    hasReport: true,
    level: 'Director',
    category: 'Candidate',
    company: 'PT Annapurna Berdiri TInggi',
    consentStatus: 'Pending',
    consentExpiry: '23 Jan 2025',
    avatar: 'https://i.pravatar.cc/150?u=ID-00196',
    email: 'liana.semesta@candidate.com',
    phoneNumber: '+62 816 7890 1234',
    joinedDate: '-',
    role: 'Marketing Director Candidate',
    department: 'Marketing',
    employmentType: 'Contract',
    address: 'Jl. Kuningan No. 12, Jakarta Selatan',
  },
  {
    id: 6,
    name: 'Lola Chaniago',
    employeeId: 'ID-00197',
    hasReport: true,
    level: 'Manager',
    category: 'Candidate',
    company: 'PT Everest Maju Sejahtera',
    consentStatus: 'New',
    consentExpiry: '23 Jan 2025',
    avatar: 'https://i.pravatar.cc/150?u=ID-00197',
    email: 'lola.chaniago@candidate.com',
    phoneNumber: '+62 817 8901 2345',
    joinedDate: '-',
    role: 'Sales Manager Candidate',
    department: 'Sales',
    employmentType: 'Full-time',
    address: 'Jl. Kebon Jeruk No. 34, Jakarta Barat',
  },
  {
    id: 7,
    name: 'Satrio Pena',
    employeeId: 'ID-00198',
    hasReport: true,
    level: 'Intern',
    category: 'Candidate',
    company: 'PT Everest Maju Sejahtera',
    consentStatus: 'New',
    consentExpiry: '23 Jan 2025',
    avatar: null,
    email: 'satrio.pena@candidate.com',
    phoneNumber: '+62 818 9012 3456',
    joinedDate: '-',
    role: 'Graphic Designer Intern',
    department: 'Creative',
    employmentType: 'Internship',
    address: 'Jl. Palmerah No. 56, Jakarta Barat',
  },
]

export const LOAN_CATEGORIES = [
  {
    kolBadge: 'KOL 5',
    title: 'Credit card',
    accountCount: '3 account',
    amount: 'Rp 52,000,000',
    color: 'Error',
    icon: 'CreditCard02',
  },
  {
    kolBadge: 'KOL 4',
    title: 'Paylater',
    accountCount: '2 account',
    amount: 'Rp 6,400,000',
    color: 'Warning',
    icon: 'ShoppingBag03',
  },
  {
    kolBadge: 'KOL 5',
    title: 'KKB',
    accountCount: '1 account',
    amount: 'Rp 172,000,000',
    color: 'Orange',
    icon: 'Car01',
  },
  {
    kolBadge: 'KOL 5',
    title: 'KPR',
    accountCount: 'No active loan',
    amount: 'Rp 0',
    color: 'Blue',
    icon: 'Home03',
  },
  {
    kolBadge: 'KOL 5',
    title: 'KTA',
    accountCount: '2 account',
    amount: 'Rp 154,100,000',
    color: 'Success',
    icon: 'CoinsStacked03',
  },
  {
    kolBadge: 'KOL 5',
    title: 'Other',
    accountCount: 'No active loan',
    amount: 'Rp 0',
    color: 'Gray',
    icon: 'DotsVertical',
  },
]

export const LOAN_ACCOUNTS = {
  'Credit card': [
    { id: 1, bank: 'BCA', name: 'BCA Master Card', kol: 'Kol 2', label: 'Jumlah pinjaman', amount: 'Rp 1,523,000', isActive: false },
    { id: 2, bank: 'BCA', name: 'BCA Master Card', kol: 'Kol 2', label: 'Jumlah pinjaman', amount: 'Rp 5,000,000', isActive: true },
    { id: 3, bank: 'CIMB', name: 'CIMB Niaga Card', kol: 'Kol 5', label: 'Jumlah pinjaman', amount: 'Rp 45,477,000', isActive: false },
  ],
  'Paylater': [
    { id: 1, bank: 'SP', name: 'Shopee Paylater', kol: 'Kol 4', label: 'Jumlah pinjaman', amount: 'Rp 4,000,000', isActive: false },
    { id: 2, bank: 'TR', name: 'Traveloka Paylater', kol: 'Kol 2', label: 'Jumlah pinjaman', amount: 'Rp 2,400,000', isActive: true },
  ],
  'KKB': [
    { id: 1, bank: 'BCA', name: 'BCA Finance - Toyota Avanza', kol: 'Kol 5', label: 'Jumlah pinjaman', amount: 'Rp 172,000,000', isActive: true },
  ],
  'KPR': [],
  'KTA': [
    { id: 1, bank: 'MN', name: 'Mandiri KTA', kol: 'Kol 5', label: 'Jumlah pinjaman', amount: 'Rp 100,000,000', isActive: false },
    { id: 2, bank: 'BRI', name: 'BRI KTA', kol: 'Kol 2', label: 'Jumlah pinjaman', amount: 'Rp 54,100,000', isActive: true },
  ],
  'Other': [],
}

function WorkforceProvider({ children }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [workforce, setWorkforce] = useState(INITIAL_WORKFORCE)
  const [sortField, setSortField] = useState(null)
  const [sortOrder, setSortOrder] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState('All category')
  const [currentSlider, setCurrentSlider] = useState(null)

  const handleCurrentSlider = useCallback((value) => {
    setCurrentSlider(value)
  }, [])

  const getEmployeeById = useCallback(
    (id) => INITIAL_WORKFORCE.find((emp) => emp.id === parseInt(id, 10)),
    []
  )

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
      result = result.filter((w) => w.category === selectedCategory)
    }
    if (searchTerm) {
      result = result.filter(
        (w) =>
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
      getEmployeeById,
      currentSlider,
      handleCurrentSlider,
      loanCategories: LOAN_CATEGORIES,
      loanAccounts: LOAN_ACCOUNTS,
    }),
    [
      searchTerm,
      filteredWorkforce,
      handleSort,
      handleSelectionChange,
      sortField,
      sortOrder,
      selectedCategory,
      getEmployeeById,
      currentSlider,
      handleCurrentSlider,
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
