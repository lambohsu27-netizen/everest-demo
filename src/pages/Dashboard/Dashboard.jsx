import React, { useState } from 'react'

import DashboardHeader from './DashboardHeader'
import KolektibilitasSection from './KolektibilitasSection'
import EmployeeDashboardSection from './EmployeeDashboardSection'
import EmployeeTable from './EmployeeTable'

function Dashboard() {
  const [searchTerm, setSearchTerm] = useState('')

  return (
    <div className="flex h-full w-full flex-col overflow-y-auto bg-gray-50/50">
      <div className="mx-auto w-full max-w-[1372px]">
        <DashboardHeader />
        <KolektibilitasSection />
        <EmployeeDashboardSection
          searchTerm={searchTerm}
          onSearchTermChange={setSearchTerm}
        />
        <EmployeeTable />
      </div>
    </div>
  )
}

export default Dashboard
