import React from 'react'
import ReportSummaryCard from './ReportSummaryCard'

export default function CreditCompositionCard() {
  const chartLabels = [
    'Consumer Loans',
    'Working Capital',
    'Credit Card',
    'Installment Loans',
    'Other Facilities',
  ]

  return (
    <ReportSummaryCard
      title="Credit Composition"
      description="Breakdown of credit types associated with the individual."
      onViewReport={() => {}} // TODO: Define action
    >
      <div className="flex flex-1 items-center justify-center gap-6 py-6">
        {/* Fake Pie Chart */}
        <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-purple-400 via-purple-500 to-purple-200 flex-shrink-0" />
        
        <div className="flex flex-col gap-2">
          {chartLabels.map((label, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-purple-500" />
              <span className="text-sm text-gray-600">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </ReportSummaryCard>
  )
}

