import React, { useMemo } from 'react'
import StatCard from './StatCard'
import RiskScoreCard from './RiskScoreCard'
import SummaryListCard from './SummaryListCard'
import TrendChartCard from './TrendChartCard'
import CreditScoreTrend from './CreditScoreTrend'
import CollectabilityTrend from './CollectabilityTrend'
import { useWorkforce } from '../../../../../../../Context'
import { parseMonthKey } from '../../../../../adapters/workforceDetailAdapter'

function formatIDR(n) {
  const v = Number(n)
  if (!v) return 'Rp 0'
  return `Rp ${v.toLocaleString('en-US', { maximumFractionDigits: 0 })}`
}

function pctChange(values) {
  if (!values || values.length < 2) return null
  const last = Number(values[values.length - 1]) || 0
  const prev = Number(values[values.length - 2]) || 0
  if (!prev) return null
  const delta = ((last - prev) / Math.abs(prev)) * 100
  if (!Number.isFinite(delta)) return null
  return delta
}

// Synthetic 8-point series shaped around an anchor value, used when the
// backend doesn't ship a time series for a metric (Total Plafon Efektif).
function syntheticSeries(anchor) {
  const v = Number(anchor) || 0
  if (!v) return [12, 18, 22, 19, 24, 28, 26, 30]
  // Smooth wave around the anchor so the sparkline reads as activity.
  return [0.82, 0.86, 0.91, 0.88, 0.94, 0.97, 0.99, 1].map((m) => Math.round(v * m))
}

export default function CreditSummarySection() {
  const { workforceDetailReport } = useWorkforce()
  const summary = workforceDetailReport?.credit_summary ?? {}

  // Outstanding & Overdue series come straight from credit_score_trend
  // (sorted by YYYY-MM). Plafon Efektif has no time series in the snapshot,
  // so we synthesise one anchored on the current value.
  const { outstandingSeries, overdueSeries, plafonSeries, outstandingTrend, overdueTrend } = useMemo(() => {
    const trend = Array.isArray(summary.credit_score_trend) ? summary.credit_score_trend : []
    const sorted = [...trend].sort((a, b) => parseMonthKey(a.date) - parseMonthKey(b.date))
    const outstanding = sorted.map((d) => Number(d.outstanding) || 0)
    const overdue = sorted.map((d) => Number(d.overdue) || 0)
    const oPct = pctChange(outstanding)
    const ovPct = pctChange(overdue)
    const fmtPct = (n) => (n == null ? null : `${n >= 0 ? '+' : ''}${n.toFixed(1)}%`)
    return {
      outstandingSeries: outstanding.length ? outstanding : syntheticSeries(summary.total_outstanding_loans),
      overdueSeries: overdue.length ? overdue : syntheticSeries(summary.total_overdue_loans),
      plafonSeries: syntheticSeries(summary.total_plafon_efektif),
      outstandingTrend: fmtPct(oPct),
      overdueTrend: fmtPct(ovPct),
    }
  }, [summary.credit_score_trend, summary.total_outstanding_loans, summary.total_overdue_loans, summary.total_plafon_efektif])
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
            chartData={outstandingSeries}
            trend={outstandingTrend}
            // Outstanding rising is a worse signal — flip the chart color to red on increase.
            trendUp={outstandingTrend ? !outstandingTrend.startsWith('+') : false}
          />
          <StatCard
            className="min-w-64"
            title="Total Overdue Loans"
            value={formatIDR(summary.total_overdue_loans)}
            chartData={overdueSeries}
            trend={overdueTrend}
            trendUp={overdueTrend ? !overdueTrend.startsWith('+') : false}
          />
          <StatCard
            className="min-w-64"
            title="Total plafon efektif"
            value={formatIDR(summary.total_plafon_efektif)}
            chartData={plafonSeries}
            trendUp
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
