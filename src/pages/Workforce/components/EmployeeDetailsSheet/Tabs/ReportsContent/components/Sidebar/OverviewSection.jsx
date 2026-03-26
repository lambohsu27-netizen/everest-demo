import React from 'react'
import RiskAssessmentTable from './RiskAssessmentTable'
import { MagicWand01 } from '@untitled-ui/icons-react'

export default function OverviewSection() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          Overview 
          <MagicWand01 className="h-5 w-5 text-gray-400" />
        </h3>
        <p className="text-sm text-gray-500">Key insights from credit and background data.</p>
      </div>
      
      <div className="flex flex-col gap-5">
        <div className="bg-[#fdfdfd] rounded-xl border border-gray-200 p-5 shadow-sm">
          <h4 className="text-sm font-semibold text-gray-900 mb-3">Key takeaway</h4>
          <p className="text-sm text-gray-600 leading-relaxed">
            The individual shows high financial risk indicators.
            <br />
            Credit records indicate severely delinquent obligations (KOL 5) with significant overdue balances.
            <br />
            Multiple negative financial events and unstable repayment behavior suggest elevated credit and reliability risk.
          </p>
        </div>
        
        <RiskAssessmentTable />
      </div>
    </div>
  )
}
