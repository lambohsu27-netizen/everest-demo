import React from 'react'
import { MyChip, MyDoubleCard, MyTooltip } from '@interstellar-component'
import { HelpCircle } from '@untitled-ui/icons-react'
import { useWorkforce } from '../../../../../../Context'
import { useEmployeeDetailsSheet } from '../../../../Context'
import { levelToBadge } from '../../../../adapters/workforceDetailAdapter'

// Order + tooltips for the 7 indicators displayed in the sidebar table.
// `public_profile` (8th indicator returned by the AI) is intentionally
// omitted — it's not part of the existing visual table and the rationale
// duplicates the Footprint card on the right column.
const INDICATOR_DEFS = [
  {
    key: 'financial_responsibility',
    label: 'Financial Responsibility',
    tooltip:
      'Indicates how responsibly the individual manages financial obligations based on credit history, repayment behavior, and overall debt management.',
  },
  {
    key: 'debt_burden',
    label: 'Debt Burden',
    tooltip:
      'Evaluates the level of debt relative to the individual’s financial capacity. Lower debt burden suggests a healthier financial position.',
  },
  {
    key: 'payment_discipline',
    label: 'Payment Discipline',
    tooltip:
      'Measures consistency in making loan or credit payments on time. Frequent delays may indicate higher financial risk.',
  },
  {
    key: 'contract_reputation',
    label: 'Contract Reputation',
    tooltip:
      'Assesses the share of granted vs not-granted credit applications and the reliability signal that pattern carries.',
  },
  {
    key: 'employment_stability',
    label: 'Employment Stability',
    tooltip:
      'Reflects the consistency of employment history and job tenure, which may indicate income stability and financial reliability.',
  },
  {
    key: 'legal_exposure',
    label: 'Legal Exposure',
    tooltip:
      'Identifies potential legal records or court decisions that may indicate financial or legal risk associated with the individual.',
  },
  {
    key: 'overall_risk',
    label: 'Overall Risk',
    tooltip:
      'An aggregated risk evaluation derived from financial behavior, credit history, employment stability, and legal indicators.',
  },
]

export default function RiskAssessmentTable() {
  const context = useEmployeeDetailsSheet()
  const { workforceDetailReport } = useWorkforce()
  const apiIndicators = workforceDetailReport?.overview?.risk_assessment_indicators

  const allNull =
    !apiIndicators
    || INDICATOR_DEFS.every((def) => {
      const cell = apiIndicators[def.key]
      return !cell || (cell.level == null && !cell.rationale)
    })

  // DEMO DATA — risk_assessment_indicators wholly null (AI errored or skipped).
  // Falls back to the static 7-row mock from the sheet context so the table
  // always has visual content for demos.
  const indicators = allNull
    ? context.indicators
    : INDICATOR_DEFS.map((def) => {
      const cell = apiIndicators[def.key]
      const { badge, badgeColor } = levelToBadge(cell?.level)
      // Prefer the AI-written rationale when available; fall back to the
      // default tooltip copy so empty cells still explain the indicator.
      const tooltip = cell?.rationale || def.tooltip
      return { label: def.label, badge, badgeColor, tooltip }
    })

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
                  <div className="max-w-[220px] text-xs-medium text-white">{item.tooltip}</div>
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
