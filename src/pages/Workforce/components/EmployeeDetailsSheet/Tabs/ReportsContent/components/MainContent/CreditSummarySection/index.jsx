import React from 'react'
import StatCard from './StatCard'
import RiskScoreCard from './RiskScoreCard'
import SummaryListCard from './SummaryListCard'
import TrendChartCard from './TrendChartCard'
import CreditScoreTrend from './CreditScoreTrend'
import CollectabilityTrend from './CollectabilityTrend'
import { useWorkforce } from '../../../../../../../Context'

function formatIDR(n) {
  const v = Number(n)
  if (!v) return 'Rp 0'
  return `Rp ${v.toLocaleString('en-US', { maximumFractionDigits: 0 })}`
}

export default function CreditSummarySection() {
  const { workforceDetail } = useWorkforce()
  const summary = workforceDetail?.credit_report?.credit_summary ?? {}
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
        <div className="flex flex-wrap gap-6">
          <StatCard
            className="min-w-64"
            title="Total Outstanding Loans"
            value={formatIDR(summary.total_outstanding_loans)}
          />
          <StatCard
            className="min-w-64"
            title="Total Overdue Loans"
            value={formatIDR(summary.total_overdue_loans)}
          />
          <StatCard
            className="min-w-64"
            title="Total plafon efektif"
            value={formatIDR(summary.total_plafon_efektif)}
          />
        </div>

        {/* Charts */}
        <TrendChartCard
          title="Outstanding & Overdue Trend"
          subtitle="Historical view of outstanding balances and overdue amounts over time."
        >
          <CreditScoreTrend />
        </TrendChartCard>

        <TrendChartCard
          title="Collectability Trend"
          subtitle="Distribution of loan collectability status over time based on credit records."
        >
          <CollectabilityTrend />
        </TrendChartCard>
      </div>
    </div>
  )
}
