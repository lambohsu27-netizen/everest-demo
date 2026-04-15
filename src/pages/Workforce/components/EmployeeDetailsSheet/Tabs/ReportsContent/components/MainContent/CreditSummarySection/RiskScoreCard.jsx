import React from 'react'
import { useWorkforce } from '../../../../../../../Context'

const KOL_COLOR = {
  1: '#12b76a',
  2: '#fdb022',
  3: '#ff692e',
  4: '#f04438',
  5: '#912018',
}

const RISK_COLOR = {
  low: '#12b76a',
  medium: '#fdb022',
  high: '#b42318',
  'very high': '#912018',
}

function getRiskColor(level) {
  if (!level) return '#667085'
  return RISK_COLOR[String(level).toLowerCase().replace(' risk', '').trim()] ?? '#667085'
}

export default function RiskScoreCard() {
  const { workforceDetail } = useWorkforce()
  const summary = workforceDetail?.credit_report?.credit_summary ?? {}
  const kol = Number(summary.collectability_status?.kol) || 0
  const kolColor = KOL_COLOR[kol] ?? '#667085'
  const pointerLeft = kol > 0 ? `${(kol - 0.5) * 20}%` : '10%'

  const score = Number(summary.credit_score?.score) || 0
  const riskLevel = summary.credit_score?.risk_level ?? '—'
  const riskColor = getRiskColor(riskLevel)
  const scorePct = Math.max(0, Math.min(100, (score / 850) * 100))

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col p-6 h-full">
      {/* Collectability Status Section */}
      <div className="flex flex-col gap-4 pb-6 border-b border-gray-100">
        <h4 className="text-md-medium text-gray-600">Collectability Status</h4>
        <div className="text-[40px] leading-[48px] font-bold" style={{ color: kolColor }}>
          {kol > 0 ? `KOL ${kol}` : '—'}
        </div>
        <div className="relative pt-3 pb-1">
          {/* Pointer */}
          {kol > 0 && (
            <div className="absolute top-0 -translate-x-1/2" style={{ left: pointerLeft }}>
              <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-gray-400" />
            </div>
          )}
          {/* Segmented Bar */}
          <div className="flex gap-1 h-2.5 w-full">
            <div className="flex-1 bg-[#12b76a] rounded-l-full" />
            <div className="flex-1 bg-[#fdb022]" />
            <div className="flex-1 bg-[#ff692e]" />
            <div className="flex-1 bg-[#f04438]" />
            <div className="flex-1 bg-[#912018] rounded-r-full" />
          </div>
        </div>
      </div>

      {/* Credit Score Section */}
      <div className="flex flex-col gap-4 pt-6">
        <h4 className="text-md-medium text-gray-600">Credit Score</h4>
        <div className="text-[40px] leading-[48px] font-bold text-gray-700">{score || '—'}</div>
        <div className="flex h-2.5 w-full rounded-full overflow-hidden bg-gray-100">
          <div style={{ width: `${scorePct}%`, backgroundColor: riskColor }} />
        </div>
        <div className="text-md-semibold" style={{ color: riskColor }}>
          {riskLevel}
        </div>
      </div>
    </div>
  )
}
