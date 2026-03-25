import React from 'react'
import { MyMetricCard } from '@interstellar-component'
import { useReportEnquiry } from '../Context'

function ReportEnquiryMetrics() {
  const { metrics, handleMetricClick } = useReportEnquiry()

  return (
    <div className="px-8 pb-6">
      <div className="flex flex-wrap gap-4">
        {metrics?.map((m) => (
          <MyMetricCard
            key={m.label}
            label={m.label}
            value={m.value}
            active={m.active}
            onClick={() => handleMetricClick(m.label)}
            className="w-full md:w-auto"
          />
        ))}
      </div>
    </div>
  )
}

export default ReportEnquiryMetrics
