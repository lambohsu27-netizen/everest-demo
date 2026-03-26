import React from 'react'
import { TrendDown01, TrendUp01 } from '@untitled-ui/icons-react'

export default function StatCard({ title, value, trend, trendUp }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm flex flex-col gap-3 relative overflow-hidden">
      <h4 className="text-sm font-medium text-gray-600">{title}</h4>
      <div className="text-2xl font-bold text-gray-900">{value}</div>
      <div className="flex items-center gap-1.5 text-sm">
        {trendUp ? (
          <TrendUp01 className="h-4 w-4 text-green-600" />
        ) : (
          <TrendDown01 className="h-4 w-4 text-red-600" />
        )}
        <span className={`font-semibold ${trendUp ? 'text-green-600' : 'text-red-600'}`}>
          {trend}
        </span>
        <span className="text-gray-500">last mth</span>
      </div>
      {/* Decorative background chart placeholder */}
      <div className="absolute -bottom-2 -right-2 h-16 w-3/4 opacity-10 bg-gradient-to-t from-gray-400 to-transparent" />
    </div>
  )
}
