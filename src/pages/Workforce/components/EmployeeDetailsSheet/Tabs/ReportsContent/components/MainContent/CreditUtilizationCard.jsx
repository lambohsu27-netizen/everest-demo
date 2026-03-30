import React, { useState } from 'react'
import ReactApexChart from 'react-apexcharts'
import ReportSummaryCard from './ReportSummaryCard'
import CreditUtilizationModal from './CreditUtilizationModal'

export default function CreditUtilizationCard() {
  const [isModalOpen, setIsModalOpen] = useState(false)
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
          size: '68%',
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
      onViewReport={() => setIsModalOpen(true)}
    >
      <div className="flex flex-col items-start justify-center">
        {/*
          Figma: outer frame 200×110, ring frame 180×180.
          We render the full 180px ring (height=180) and clip to the top half (h-[90px]).
          An extra wrapper shifts the chart up so the flat edge sits at the clip boundary.
        */}
        <div className="relative w-[200px] h-[110px] overflow-hidden">
          {/* Chart is 180px tall; we show only the top 90px (the arc half) */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[200px]">
            <ReactApexChart options={options} series={series} type="radialBar" height={180} />
          </div>
          {/* Percentage label sits at the bottom of the 110px container */}
          <div className="absolute bottom-0 inset-x-0 flex items-center justify-center">
            <span className="text-[30px] font-semibold leading-[48px]" style={{ color: '#181d27' }}>
              {percentage}%
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-1 mt-2">
        <h5 className="text-base font-medium text-gray-900">
          You&apos;ve almost reached your limit
        </h5>
        <p className="text-sm text-gray-500">
          Used {percentage}% of your available credit limit, indicating a relatively high
          utilization level.
        </p>
      </div>
      <CreditUtilizationModal open={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </ReportSummaryCard>
  )
}
