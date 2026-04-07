import React from 'react'

import CompanyHeader from './components/CompanyHeader'
import CompanyTable from './components/CompanyTable'

function Company() {
  return (
    <div className="flex h-full w-full flex-col overflow-y-auto bg-gray-50/50">
      <div className="w-full">
        <CompanyHeader />
        <CompanyTable />
      </div>
    </div>
  )
}

export default Company
