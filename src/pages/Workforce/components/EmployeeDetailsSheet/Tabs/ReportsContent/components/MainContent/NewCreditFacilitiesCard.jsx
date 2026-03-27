import React from 'react'
import ReportSummaryCard from './ReportSummaryCard'

export default function NewCreditFacilitiesCard() {
  return (
    <ReportSummaryCard
      title="New Credit Facilities"
      description="Newly issued credit facilities over time, indicating borrowing activity and credit demand behavior."
    >
      <div className="h-56 w-full bg-gray-50 rounded-lg flex items-center justify-center border border-dashed border-gray-200">
        <span className="text-sm text-gray-400 font-medium">[ Bar Chart Placeholder ]</span>
      </div>
    </ReportSummaryCard>
  )
}

