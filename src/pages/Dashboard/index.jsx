import React from 'react'

import DashboardHeader from './components/DashboardHeader'
import KolektibilitasSection from './components/KolektibilitasSection'
import EmployeeDashboardSection from './components/EmployeeDashboardSection'
import EmployeeTable from './components/EmployeeTable'
import { useDashboard } from './Context'

function Dashboard() {
  const { searchTerm, setSearchTerm } = useDashboard()

  return (
    <div className="flex h-full w-full flex-col overflow-y-auto bg-gray-50/50">
      <div className="w-full">
        <DashboardHeader />
        <KolektibilitasSection />
        <EmployeeDashboardSection searchTerm={searchTerm} onSearchTermChange={setSearchTerm} />
        <EmployeeTable />
      </div>
    </div>
  )
}

export default Dashboard
