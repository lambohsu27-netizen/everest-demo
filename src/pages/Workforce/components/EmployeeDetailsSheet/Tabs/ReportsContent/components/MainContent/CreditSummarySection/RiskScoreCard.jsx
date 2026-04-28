import React from 'react'
import { useWorkforce } from '../../../../../../../Context'

const KOL_COLOR = {
  1: '#12b76a',
  2: '#fdb022',
  3: '#ff692e',
  4: '#f04438',
  5: '#912018',
}

// DERIVED LOCALLY — backend dropped credit_score.risk_level / risk_grade.
// We band the numeric score (CLIK 250–900 range) into success/warning/error
// so the existing visual coloring still works.
function colorForScore(score) {
  if (!score) return '#667085'
  if (score >= 750) return '#12b76a'
  if (score >= 600) return '#fdb022'
  return '#b42318'
}

// Pick the most useful copy under the score bar:
//   range  → CLIK textual band (e.g. "Excellent")
//   message → human reason from CLIK
//   exclusion → why the score is missing (e.g. "Only Contracts too new to be rate - High Risk")
function scoreSubtitle(creditScore) {
  if (!creditScore) return '—'
  return creditScore.range || creditScore.message || creditScore.exclusion || '—'
}

// FE-derived fallback when CLIK doesn't ship a numeric credit_score.score.
// Maps the worst-KOL band onto a representative score + textual range so the
// card still has a number to render. Source: collectibility_status.kol from
// the snapshot (1=current → 5=180d+ past due).
const KOL_TO_SCORE = {
  1: { score: 780, range: 'Excellent' },
  2: { score: 660, range: 'Good' },
  3: { score: 560, range: 'Fair' },
  4: { score: 460, range: 'Poor' },
  5: { score: 360, range: 'Very Poor' },
}

export default function RiskScoreCard() {
  const { workforceDetailReport } = useWorkforce()
  const summary = workforceDetailReport?.credit_summary ?? {}
  const collectibility = summary.collectibility_status ?? summary.collectability_status
  const kol = Number(collectibility?.kol) || 0
  const kolColor = KOL_COLOR[kol] ?? '#667085'
  const pointerLeft = kol > 0 ? `${(kol - 0.5) * 20}%` : '10%'

  const creditScore = summary.credit_score
  const apiScore = Number(creditScore?.score) || 0

  // Use the BE score when present; otherwise derive a synthetic score from
  // KOL so the card always has visual content. The KOL-derived range
  // doubles as the subtitle when CLIK didn't ship one.
  const fallback = KOL_TO_SCORE[kol] ?? null
  const score = apiScore || fallback?.score || 0
  const apiSubtitle = scoreSubtitle(creditScore)
  const subtitle = !apiScore && fallback ? fallback.range : apiSubtitle
  const scoreColor = colorForScore(score)
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
          <div style={{ width: `${scorePct}%`, backgroundColor: scoreColor }} />
        </div>
        <div className="text-md-semibold" style={{ color: scoreColor }}>
          {subtitle}
        </div>
      </div>
    </div>
  )
}
