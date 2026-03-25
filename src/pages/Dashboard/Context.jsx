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

function DashboardProvider({ children }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [metrics, setMetrics] = useState(INITIAL_METRICS)
  const [employees, setEmployees] = useState(null)
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

  const fetchEmployees = useCallback(async (params) => {
    try {
      setIsLoading(true)
      const res = await DashboardService.getEmployees(params)
      setEmployees(res)
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
      isLoading,
    }),
    [searchTerm, fetchMetrics, fetchEmployees, metrics, handleMetricClick, employees, isLoading]
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
