import { Stars01 } from '@untitled-ui/icons-react'
import { MyDoubleCard } from '@interstellar-component'
import { useWorkforce } from '../../../../../../Context'
import RiskAssessmentTable from './RiskAssessmentTable'

function formatIDR(n) {
  const v = Number(n) || 0
  return `Rp ${v.toLocaleString('en-US', { maximumFractionDigits: 0 })}`
}

function buildTakeaway(credit) {
  if (!credit) return 'No credit report available yet.'
  const summary = credit.credit_summary ?? {}
  const kol = summary.collectability_status?.kol
  const riskLevel = summary.credit_score?.risk_level
  const overdue = summary.total_overdue_loans
  const outstanding = summary.total_outstanding_loans
  const negCount = credit.risk_signals?.negative_event_count
  const lines = []
  if (riskLevel) lines.push(`Overall credit risk is assessed as ${riskLevel}.`)
  if (kol != null)
    lines.push(
      `Latest collectability status is KOL ${kol}${
        summary.collectability_status?.worst_dpd ? ` (worst DPD ${summary.collectability_status.worst_dpd})` : ''
      }.`
    )
  if (outstanding != null) lines.push(`Outstanding balance totals ${formatIDR(outstanding)} with overdue of ${formatIDR(overdue)}.`)
  if (negCount != null && negCount > 0)
    lines.push(`${negCount} negative event(s) recorded in the file.`)
  if (lines.length === 0) return 'No significant credit signals detected.'
  return lines.join(' ')
}

export default function OverviewSection() {
  const { workforceDetail } = useWorkforce()
  const takeaway = buildTakeaway(workforceDetail?.credit_report)
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          Overview
          <Stars01 className="h-5 w-5 text-brand/900" />
        </h3>
        <p className="text-sm text-gray-500">Key insights from credit and background data.</p>
      </div>

      <div className="flex flex-col gap-5">
        <MyDoubleCard heading="Key takeaway">
          <p className="text-md-regular text-gray-900 leading-relaxed">{takeaway}</p>
        </MyDoubleCard>

        <RiskAssessmentTable />
      </div>
    </div>
  )
}
