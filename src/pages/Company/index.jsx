import React from 'react'

import { CompanyProvider } from './Context'
import CompanyHeader from './components/CompanyHeader'
import CompanyTable from './components/CompanyTable'

function Company() {
  return (
    <CompanyProvider>
      <div className="flex h-full w-full flex-col bg-gray-50/50">
        <div className="flex w-full flex-1 min-h-0 flex-col">
          <CompanyHeader />
          <CompanyTable />
        </div>
      </div>
    </CompanyProvider>
  )
}

export default Company
