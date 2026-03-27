import React from 'react'
import MyButton from '@interstellar-component/components/Button/MyButton'

export default function ReportSummaryCard({ title, description, children, onViewReport }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
      <div className="p-6 flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <h4 className="text-base font-semibold text-gray-900">{title}</h4>
          <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
        </div>
        
        {children}
      </div>
      
      {onViewReport && (
        <div className="border-t border-gray-200 p-4 flex justify-end">
          <MyButton 
            color="primary" 
            variant="text" 
            size="sm" 
            onClick={onViewReport}
            customClassname="font-semibold"
          >
            View full report
          </MyButton>
        </div>
      )}
    </div>
  )
}

