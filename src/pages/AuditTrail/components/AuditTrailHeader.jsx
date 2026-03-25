import React from 'react'
import { ChevronRight, Home01 } from '@untitled-ui/icons-react'

function AuditTrailHeader() {
  return (
    <div className="flex flex-col gap-5 w-full p-8 pb-4">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
        <Home01 className="h-4 w-4 text-gray-400" />
        <ChevronRight className="h-4 w-4 text-gray-400" />
        <button className="hover:text-gray-700">Settings</button>
        <ChevronRight className="h-4 w-4 text-gray-400" />
        <span className="text-gray-500">...</span>
        <ChevronRight className="h-4 w-4 text-gray-400" />
        <button className="hover:text-gray-700 font-semibold bg-gray-50 px-2 py-1 rounded-md text-gray-700">Team</button>
      </div>

      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-semibold text-gray-900">
          Audit Trail
        </h1>
        <p className="text-[16px] text-gray-500">
          List of record for all system activities and events.
        </p>
      </div>
    </div>
  )
}

export default AuditTrailHeader
