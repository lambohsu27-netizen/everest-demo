import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { myToaster } from '@interstellar-component'
import { DashboardService } from './service'

const DashboardContext = createContext()

const INITIAL_METRICS = [
  { label: 'All KOL', value: '1,432', active: true },
  { label: 'KOL 1', value: '272', active: false },
  { label: 'KOL 2', value: '0', active: false },
  { label: 'KOL 3', value: '12', active: false },
  { label: 'KOL 4', value: '43', active: false },
  { label: 'KOL 5', value: '5', active: false },
]

const INITIAL_EMPLOYEES = [
  {
    id: 1,
    name: 'Lily-Rose Chedjou',
    role: 'ID-00192 • Product Design',
    level: 'Manager',
    kolektibilitas: 'KOL 1',
    creditScore: '720',
    footprint: '2',
    outstanding: 'Rp20.000.000',
    dataAs: 'Jan 16, 2025',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026024d',
  },
  {
    id: 2,
    name: 'Caitlyn King',
    role: 'ID-00192 • Product Design',
    level: 'Senior Manager',
    kolektibilitas: 'KOL 1',
    creditScore: '720',
    footprint: '4',
    outstanding: 'Rp20.000.000',
    dataAs: 'Jan 16, 2025',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
  },
  {
    id: 3,
    name: 'Fleur Cook',
    role: 'ID-00192 • Product Design',
    level: 'Senior Manager',
    kolektibilitas: 'KOL 2',
    creditScore: '720',
    footprint: '0',
    outstanding: 'Rp20.000.000',
    dataAs: 'Jan 15, 2025',
    avatar: 'https://i.pravatar.cc/150?u=a048581f4e29026701d',
  },
  {
    id: 4,
    name: 'Marco Kelly',
    role: 'ID-00192 • Product Design',
    level: 'Senior Manager',
    kolektibilitas: 'KOL 3',
    creditScore: '720',
    footprint: '0',
    outstanding: 'Rp20.000.000',
    dataAs: 'Jan 14, 2025',
    avatar: 'https://i.pravatar.cc/150?img=11',
  },
  {
    id: 5,
    name: 'Lulu Meyers',
    role: 'ID-00192 • Product Design',
    level: 'Manager',
    kolektibilitas: 'KOL 5',
    creditScore: '720',
    footprint: '2',
    outstanding: 'Rp20.000.000',
    dataAs: 'Jan 14, 2025',
    avatar: 'https://i.pravatar.cc/150?img=12',
  },
  {
    id: 6,
    name: 'Mikey Lawrence',
    role: 'ID-00192 • Product Design',
    level: 'Manager',
    kolektibilitas: 'KOL 5',
    creditScore: '720',
    footprint: '3',
    outstanding: 'Rp20.000.000',
    dataAs: 'Jan 14, 2025',
    avatar: 'https://i.pravatar.cc/150?img=13',
  },
  {
    id: 7,
    name: 'Freya Browning',
    role: 'ID-00192 • Product Design',
    level: 'Manager',
    kolektibilitas: 'KOL 1',
    creditScore: '720',
    footprint: '2',
    outstanding: 'Rp20.000.000',
    dataAs: 'Jan 14, 2025',
    avatar: 'https://i.pravatar.cc/150?img=14',
  },
]

const INITIAL_EMPLOYEE_SERIES = [
  { name: 'KOL 1', data: [15, 20, 10, 15, 10, 20, 15, 20, 15, 20, 25, 15] },
  { name: 'KOL 2', data: [20, 30, 15, 25, 15, 30, 25, 30, 25, 35, 40, 25] },
  { name: 'KOL 3', data: [30, 40, 20, 35, 20, 40, 30, 40, 30, 45, 50, 35] },
]

const INITIAL_CANDIDATE_SERIES = [
  { name: 'KOL 1', data: [12, 18, 8, 13, 8, 18, 13, 18, 13, 18, 23, 13] },
  { name: 'KOL 2', data: [18, 28, 13, 23, 13, 28, 23, 28, 23, 33, 38, 23] },
  { name: 'KOL 3', data: [28, 38, 18, 33, 18, 38, 28, 38, 28, 43, 48, 33] },
]

function DashboardProvider({ children }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [metrics, setMetrics] = useState(INITIAL_METRICS)
  const [employees, setEmployees] = useState(INITIAL_EMPLOYEES)
  const [employeeSeries, setEmployeeSeries] = useState(INITIAL_EMPLOYEE_SERIES)
  const [candidateSeries, setCandidateSeries] = useState(INITIAL_CANDIDATE_SERIES)
  const [sortField, setSortField] = useState(null)
  const [sortOrder, setSortOrder] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleMetricClick = useCallback((label) => {
    setMetrics((prev) =>
      prev.map((m) => ({
        ...m,
        active: m.label === label,
      }))
    )
  }, [])

  const fetchMetrics = useCallback(async () => {
    try {
      setIsLoading(true)
      const res = await DashboardService.getMetrics()
      setMetrics(res.data)
    } catch (e) {
      myToaster(e)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const handleSort = useCallback(
    ({ sort, order }) => {
      setSortField(sort)
      setSortOrder(order)

      if (!sort || !order) {
        setEmployees(INITIAL_EMPLOYEES)
        return
      }

      const sortedData = [...employees].sort((a, b) => {
        let valA = a[sort] || ''
        let valB = b[sort] || ''

        if (['creditScore', 'footprint'].includes(sort)) {
          valA = Number(valA)
          valB = Number(valB)
        }

        if (sort === 'outstanding') {
          valA = Number(valA.replace(/[^0-9.-]+/g, ''))
          valB = Number(valB.replace(/[^0-9.-]+/g, ''))
        }

        if (valA < valB) return order === 'asc' ? -1 : 1
        if (valA > valB) return order === 'asc' ? 1 : -1
        return 0
      })

      setEmployees(sortedData)
    },
    [employees]
  )

  const handleSelectionChange = useCallback((updated) => {
    setEmployees(updated.data)
  }, [])

  const fetchEmployees = useCallback(async (params) => {
    try {
      setIsLoading(true)
      const res = await DashboardService.getEmployees(params)
      setEmployees(res.data)
    } catch (e) {
      myToaster(e)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const contextValue = useMemo(
    () => ({
      searchTerm,
      setSearchTerm,
      metrics,
      handleMetricClick,
      fetchMetrics,
      employees,
      fetchEmployees,
      employeeSeries,
      candidateSeries,
      handleSort,
      handleSelectionChange,
      sortField,
      sortOrder,
      isLoading,
    }),
    [
      searchTerm,
      fetchMetrics,
      metrics,
      handleMetricClick,
      employees,
      fetchEmployees,
      employeeSeries,
      candidateSeries,
      handleSort,
      handleSelectionChange,
      sortField,
      sortOrder,
      isLoading,
    ]
  )

  return <DashboardContext.Provider value={contextValue}>{children}</DashboardContext.Provider>
}

const useDashboard = () => {
  const context = useContext(DashboardContext)
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider')
  }
  return context
}

export { DashboardProvider, useDashboard }
