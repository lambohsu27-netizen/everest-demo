import React from 'react'

import WorkforceHeader from './components/WorkforceHeader'
import WorkforceTable from './components/WorkforceTable'

function Workforce() {
  return (
    <div className="flex h-full w-full flex-col overflow-y-auto bg-gray-50/50">
      <div className="mx-auto w-full max-w-[1372px]">
        <WorkforceHeader />
        <WorkforceTable />
      </div>
    </div>
  )
}

export default Workforce
