import React from 'react'
import { TrendDown01, TrendUp01 } from '@untitled-ui/icons-react'

import ReactApexChart from 'react-apexcharts'

export default function StatCard({ title, value, trend, trendUp, chartData, className = '' }) {
  const chartOptions = {
    chart: {
      type: 'area',
      height: 72,
      sparkline: {
        enabled: true,
      },
      animations: {
        enabled: false,
      },
    },
    stroke: {
      curve: 'smooth',
      width: 2,
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.45,
        opacityTo: 0.05,
        stops: [20, 100],
      },
    },
    colors: [trendUp ? '#12b76a' : '#f04438'],
    tooltip: {
      enabled: false,
    },
  }

  const series = [
    {
      name: title,
      data: chartData || (trendUp ? [10, 40, 30, 45, 35, 55, 45, 60] : [60, 45, 55, 35, 45, 30, 40, 10]),
    },
  ]

  return (
    <div
      className={`bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col relative overflow-hidden min-h-[190px] flex-1 min-w-[300px] ${className}`}
    >
      <div className="p-5 flex flex-col gap-2 relative z-10 flex-grow">
        <h4 className="text-sm font-medium text-gray-600">{title}</h4>
        <div className="text-2xl font-bold text-gray-900">{value}</div>
        {trend && (
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
        )}
      </div>

      {/* Mini Trend Chart */}
      {chartData && chartData.length > 0 && (
        <div className="w-full relative -bottom-1 overflow-hidden pointer-events-none mt-auto h-[64px]">
          <ReactApexChart
            options={chartOptions}
            series={series}
            type="area"
            height={64}
            width="100%"
          />
        </div>
      )}
    </div>
  )
}
