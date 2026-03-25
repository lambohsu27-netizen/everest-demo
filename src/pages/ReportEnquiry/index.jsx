import React from 'react'

import ReportEnquiryHeader from './components/ReportEnquiryHeader'
import ReportEnquiryMetrics from './components/ReportEnquiryMetrics'
import ReportEnquiryTable from './components/ReportEnquiryTable'

function ReportEnquiry() {
  return (
    <div className="flex h-full w-full flex-col overflow-y-auto bg-gray-50/50">
      <div className="mx-auto w-full max-w-[1372px]">
        <ReportEnquiryHeader />
        <ReportEnquiryMetrics />
        <ReportEnquiryTable />
      </div>
    </div>
  )
}

export default ReportEnquiry
