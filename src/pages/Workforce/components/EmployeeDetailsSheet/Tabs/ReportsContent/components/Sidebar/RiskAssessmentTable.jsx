import React from 'react'
import { MyChip, MyDoubleCard, MyTooltip } from '@interstellar-component'
import { HelpCircle } from '@untitled-ui/icons-react'
import { useWorkforce } from '../../../../../../Context'
import { useEmployeeDetailsSheet } from '../../../../Context'

function burdenFromUtil(pct) {
  if (pct == null) return null
  if (pct >= 90) return { badge: 'Very High', badgeColor: 'error' }
  if (pct >= 70) return { badge: 'High', badgeColor: 'error' }
  if (pct >= 30) return { badge: 'Medium', badgeColor: 'warning' }
  return { badge: 'Low', badgeColor: 'success' }
}

function scoreToBadge(ratio) {
  // ratio: 0 = worst, 1 = best
  if (ratio >= 0.8) return { badge: 'Excellent', badgeColor: 'success' }
  if (ratio >= 0.6) return { badge: 'Good', badgeColor: 'success' }
  if (ratio >= 0.4) return { badge: 'Fair', badgeColor: 'warning' }
  if (ratio >= 0.2) return { badge: 'Poor', badgeColor: 'error' }
  return { badge: 'Very Poor', badgeColor: 'error' }
}

function countToBadge(count, good = 0, bad = 20) {
  if (count == null) return null
  const ratio = 1 - Math.max(0, Math.min(1, (count - good) / (bad - good)))
  return scoreToBadge(ratio)
}

function kolToBadge(kol) {
  if (kol == null) return null
  return scoreToBadge(Math.max(0, (5 - kol) / 4))
}

function gradeToBadge(grade) {
  if (!grade) return null
  const g = String(grade).toUpperCase()
  if (g === 'A') return { badge: 'Excellent', badgeColor: 'success' }
  if (g === 'B') return { badge: 'Good', badgeColor: 'success' }
  if (g === 'C') return { badge: 'Fair', badgeColor: 'warning' }
  if (g === 'D') return { badge: 'Poor', badgeColor: 'error' }
  return { badge: 'Very Poor', badgeColor: 'error' }
}

function riskLevelBadge(level) {
  if (!level) return null
  const l = String(level).toLowerCase()
  if (l.includes('very high')) return { badge: 'Very High', badgeColor: 'error' }
  if (l.includes('high')) return { badge: 'High', badgeColor: 'error' }
  if (l.includes('medium')) return { badge: 'Medium', badgeColor: 'warning' }
  if (l.includes('low')) return { badge: 'Low', badgeColor: 'success' }
  return { badge: level, badgeColor: 'modern' }
}

function deriveIndicators(credit) {
  const summary = credit?.credit_summary ?? {}
  const signals = credit?.risk_signals ?? {}
  const util = credit?.credit_overview?.utilization?.percentage
  const kol = summary.collectability_status?.kol
  const burden = burdenFromUtil(util)
  const overall = riskLevelBadge(summary.credit_score?.risk_level)
  const financial = gradeToBadge(summary.credit_score?.risk_grade)
  const payment = kolToBadge(kol)
  const contact = countToBadge(signals.contact_count, 1, 15)
  const employment = countToBadge(signals.employment_count, 1, 10)
  const legal = countToBadge(signals.negative_event_count, 0, 5)

  return [
    financial && {
      label: 'Financial Responsibility',
      ...financial,
      tooltip: 'Indicates how responsibly the individual manages financial obligations based on credit history, repayment behavior, and overall debt management.',
    },
    burden && {
      label: 'Debt Burden',
      ...burden,
      tooltip: 'Evaluates the level of debt relative to the individual’s financial capacity. Lower debt burden suggests a healthier financial position.',
    },
    payment && {
      label: 'Payment Discipline',
      ...payment,
      tooltip: 'Measures consistency in making loan or credit payments on time. Frequent delays may indicate higher financial risk.',
    },
    contact && {
      label: 'Contact Reputation',
      ...contact,
      tooltip: 'Assesses the reliability and stability of contact information associated with the individual, including phone number patterns and usage history.',
    },
    employment && {
      label: 'Employment Stability',
      ...employment,
      tooltip: 'Reflects the consistency of employment history and job tenure, which may indicate income stability and financial reliability.',
    },
    legal && {
      label: 'Legal Exposure',
      ...legal,
      tooltip: 'Identifies potential legal records or court decisions that may indicate financial or legal risk associated with the individual.',
    },
    overall && {
      label: 'Overall Risk',
      ...overall,
      tooltip: 'An aggregated risk evaluation derived from financial behavior, credit history, employment stability, and legal indicators.',
    },
  ].filter(Boolean)
}

export default function RiskAssessmentTable({ data }) {
  const context = useEmployeeDetailsSheet()
  const { workforceDetail } = useWorkforce()
  const derived = deriveIndicators(workforceDetail?.credit_report)
  const indicators = data || (derived.length > 0 ? derived : context.indicators)

  return (
    <MyDoubleCard heading="Risk Assessment Indicators" innerClassName="p-0">
      <div className="flex flex-col">
        {indicators.map((item, index) => (
          <div
            key={index}
            className={`flex items-center justify-between px-6 py-[22px] min-h-[72px] ${
              index !== indicators.length - 1 ? 'border-b border-gray-200' : ''
            }`}
          >
            <div className="flex items-center gap-1.5 text-md-regular text-gray-700">
              {item.label}
              {item.tooltip && (
                <MyTooltip
                  target={
                    <span>
                      <HelpCircle className="h-4 w-4 text-gray-400 cursor-pointer" />
                    </span>
                  }
                  placement="top"
                >
                  <div className="max-w-[180px] text-xs-medium text-white">{item.tooltip}</div>
                </MyTooltip>
              )}
            </div>
            <div className="flex items-center">
              {item.value && <span className="text-md-semibold text-gray-900">{item.value}</span>}
              {item.badge && (
                <MyChip
                  label={item.badge}
                  color={item.badgeColor}
                  variant="filled"
                  size="sm"
                  rounded="full"
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </MyDoubleCard>
  )
}
