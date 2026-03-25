import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { myToaster } from '@interstellar-component'
import { DashboardService } from './service'

const DashboardContext = createContext()

function DashboardProvider({ children }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [metrics, setMetrics] = useState(null)
  const [employees, setEmployees] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

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
      fetchMetrics,
      employees,
      fetchEmployees,
      isLoading,
    }),
    [searchTerm, fetchMetrics, fetchEmployees, metrics, employees, isLoading]
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
