import React from 'react'

export default function TrendChartCard({ title, subtitle, children }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h4 className="text-base font-semibold text-gray-900">{title}</h4>
        <span className="text-sm text-gray-500">{subtitle}</span>
      </div>
      <div className="w-full">
        {children}
      </div>
    </div>
  )
}
