import React from 'react'
import { MyChip, MyDoubleCard } from '@interstellar-component'
import { HelpCircle } from '@untitled-ui/icons-react'
import { useEmployeeDetailsSheet } from '../../../../Context'

export default function RiskAssessmentTable() {
  const { indicators } = useEmployeeDetailsSheet()

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
              <HelpCircle className="h-4 w-4 text-gray-400" />
            </div>
            <div className="flex items-center">
              {item.value && <span className="text-md-semibold text-gray-900">{item.value}</span>}
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
          </div>
        ))}
      </div>
    </MyDoubleCard>
  )
}
