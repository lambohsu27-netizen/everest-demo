import React from 'react'

import AuditTrailHeader from './components/AuditTrailHeader'
import AuditTrailTable from './components/AuditTrailTable'

function AuditTrail() {
  return (
    <div className="flex h-full w-full flex-col overflow-y-auto bg-gray-50/50">
      <div className="mx-auto w-full max-w-[1372px]">
        <AuditTrailHeader />
        <AuditTrailTable />
      </div>
    </div>
  )
}

export default AuditTrail
