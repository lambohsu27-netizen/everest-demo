import React from 'react'

import AuditTrailHeader from './components/AuditTrailHeader'
import AuditTrailTable from './components/AuditTrailTable'

function AuditTrail() {
  return (
    <div className="flex h-full w-full flex-col bg-gray-50/50">
      <div className="flex w-full flex-1 min-h-0 flex-col">
        <AuditTrailHeader />
        <AuditTrailTable />
      </div>
    </div>
  )
}

export default AuditTrail
