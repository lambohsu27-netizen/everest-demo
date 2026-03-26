import React from 'react'
import StatCard from './StatCard'
import RiskScoreCard from './RiskScoreCard'
import SummaryListCard from './SummaryListCard'
import TrendChartCard from './TrendChartCard'

export default function CreditSummarySection() {
  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex flex-col gap-1 pb-4 border-b border-gray-200">
        <h3 className="text-xl font-bold text-gray-900">Credit Summary</h3>
        <p className="text-sm text-gray-500">
          Overview of the individual&apos;s credit profile based on the latest available report.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        {/* Row 1: Status & Info */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <RiskScoreCard />
          <SummaryListCard />
        </div>

        {/* Row 2: Loan Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          <StatCard title="Total Outstanding Loans" value="Rp 384,500,000" trend="15%" trendUp />
          <StatCard title="Total Overdue Loans" value="Rp 11,500,000" trend="15%" trendUp={false} />
          <StatCard
            title="Total plafon efektif"
            value="Rp 930,280,161"
            trend="15%"
            trendUp={false}
          />
        </div>

        {/* Charts */}
        <TrendChartCard
          title="Credit Score Trend"
          subtitle="Historical view of the individual's credit score over time"
          placeholderText="[ Line Chart Placeholder ]"
        />

        <TrendChartCard
          title="Collectability Trend"
          subtitle="Distribution of non-collectability status over time based on credit records."
          placeholderText="[ Multi-line Chart Placeholder ]"
        />
      </div>
    </div>
  )
}
