import React from 'react'
import { MyChip } from '@interstellar-component'
import { HelpCircle } from '@untitled-ui/icons-react'

export default function RiskAssessmentTable() {
  const indicators = [
    { label: 'Financial responsibility', value: '3 / 10' },
    { label: 'Debt burden', badge: 'High', badgeColor: 'error' },
    { label: 'Payment Discipline', value: '2 / 10' },
    { label: 'Contact reputation', value: '5 / 10' },
    { label: 'Employment stability', value: '4 / 10' },
    { label: 'Legal exposure', value: '7 / 10' },
    { label: 'Overall risk', badge: 'High', badgeColor: 'error' },
  ]

  return (
    <div className="bg-[#fdfdfd] rounded-xl border border-gray-200 p-5 shadow-sm">
      <h4 className="text-sm font-semibold text-gray-900 mb-4">Risk Assessment Indicators</h4>
      <div className="flex flex-col gap-3">
        {indicators.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-sm text-gray-600">
              {item.label}
              <HelpCircle className="h-4 w-4 text-gray-400" />
            </div>
            {item.value && <span className="text-sm font-medium text-gray-900">{item.value}</span>}
            {item.badge && (
              <MyChip
                label={item.badge}
                color={item.badgeColor}
                variant="modern"
                size="sm"
                rounded="lg"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
