import { Stars01 } from '@untitled-ui/icons-react'
import { MyDoubleCard } from '@interstellar-component'
import RiskAssessmentTable from './RiskAssessmentTable'

export default function OverviewSection() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          Overview
          <Stars01 className="h-5 w-5 text-brand/600" />
        </h3>
        <p className="text-sm text-gray-500">Key insights from credit and background data.</p>
      </div>

      <div className="flex flex-col gap-5">
        <MyDoubleCard heading="Key takeaway">
          <p className="text-md-regular text-gray-900 leading-relaxed">
            The individual shows high financial risk indicators.
            <br />
            Credit records indicate severely delinquent obligations (KOL 5) with significant overdue
            balances.
            <br />
            Multiple negative financial events and unstable repayment behavior suggest elevated
            credit and reliability risk.
          </p>
        </MyDoubleCard>

        <RiskAssessmentTable />
      </div>
    </div>
  )
}
