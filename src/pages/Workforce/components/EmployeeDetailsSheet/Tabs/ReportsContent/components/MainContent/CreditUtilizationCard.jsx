import React from 'react'
import ReactApexChart from 'react-apexcharts'
import ReportSummaryCard from './ReportSummaryCard'

export default function CreditUtilizationCard() {
  const percentage = 73

  const options = {
    chart: {
      type: 'radialBar',
      sparkline: {
        enabled: true,
      },
    },
    plotOptions: {
      radialBar: {
        startAngle: -90,
        endAngle: 90,
        hollow: {
          margin: 0,
          size: '65%',
        },
        track: {
          background: '#e9eaeb',
          strokeWidth: '100%',
          margin: 0,
        },
        dataLabels: {
          show: false,
        },
      },
    },
    fill: {
      colors: ['#7f56d9'],
    },
    stroke: {
      lineCap: 'round',
    },
    labels: ['Utilization'],
  }

  const series = [percentage]

  return (
    <ReportSummaryCard
      title="Credit Utilization"
      description="Percentage of total available credit currently in use."
      onViewReport={() => {}} // TODO: Define action
    >
      <div className="flex flex-col items-center justify-center pt-2 pb-6">
        <div className="relative w-[240px] h-[120px] flex items-center justify-center overflow-hidden">
          <div className="w-full mt-8">
            <ReactApexChart options={options} series={series} type="radialBar" height={240} />
          </div>
          {/* Centered Percentage Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-end pb-2">
            <span className="text-[30px] font-semibold text-gray-900 leading-none">
              {percentage}%
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-1 mt-2">
        <h5 className="text-base font-medium text-gray-900">You&apos;ve almost reached your limit</h5>
        <p className="text-sm text-gray-500">
          Used {percentage}% of your available credit limit, indicating a relatively high
          utilization level.
        </p>
      </div>
    </ReportSummaryCard>
  )
}



