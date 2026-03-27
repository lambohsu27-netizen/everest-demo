import React from 'react'
import ReportSummaryCard from './ReportSummaryCard'

export default function CreditUtilizationCard() {
  return (
    <ReportSummaryCard
      title="Credit Utilization"
      description="Percentage of total available credit currently in use."
      onViewReport={() => {}} // TODO: Define action
    >
      <div className="flex flex-col items-center justify-center py-6">
        {/* Fake Circular Progress */}
        <div className="relative flex items-center justify-center w-32 h-32 rounded-full border-8 border-purple-100">
          <div className="absolute inset-0 border-8 border-purple-600 rounded-full border-t-transparent border-r-transparent transform -rotate-45" />
          <span className="text-2xl font-bold text-gray-900">73%</span>
        </div>
      </div>
      
      <div className="flex flex-col gap-1">
        <h5 className="text-sm font-semibold text-gray-900">You&apos;ve almost reached your limit</h5>
        <p className="text-sm text-gray-500">Used 73% of your available credit limit, indicating a relatively high utilization level.</p>
      </div>
    </ReportSummaryCard>
  )
}

