import React, { useState } from 'react'
import ReactApexChart from 'react-apexcharts'
import ReportSummaryCard from './ReportSummaryCard'
import CreditUtilizationModal from './CreditUtilizationModal'
import { useWorkforce } from '../../../../../../Context'

// DEMO DATA — used only when both `level` and `headline` are missing on the
// API payload (older snapshot or AI step skipped). Mirrors the previous
// pre-AI heuristic so the card still reads naturally in demos.
function fallbackCopy(pct) {
  if (pct >= 90) return { headline: "You've almost reached your limit", level: 'high' }
  if (pct >= 70) return { headline: 'High utilization level', level: 'high' }
  if (pct >= 30) return { headline: 'Moderate utilization level', level: 'medium' }
  return { headline: 'Low utilization level', level: 'low' }
}

function toneFromLevel(level) {
  switch (String(level || '').toLowerCase()) {
    case 'critical':
    case 'high':
      return 'high'
    case 'medium':
      return 'medium'
    case 'none':
    case 'low':
    default:
      return 'low'
  }
}

export default function CreditUtilizationCard() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { workforceDetailReport } = useWorkforce()
  const util = workforceDetailReport?.credit_overview?.credit_utilization ?? {}
  const percentage = Number(util.percentage) || 0

  const apiHeadline = util.headline
  const apiLevel = util.level
  const apiRationale = util.rationale
  const fb = fallbackCopy(percentage)
  const headline = apiHeadline || fb.headline
  const tone = toneFromLevel(apiLevel || fb.level)
  // DEMO DATA — when the AI rationale isn't shipped yet, fall back to the
  // simple "Used X% of available credit limit" sentence so the card looks
  // complete in demos.
  const rationale = apiRationale || `Used ${percentage}% of the available credit limit (${tone} utilization).`

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
        <h5 className="text-base font-medium text-gray-900">{headline}</h5>
        <p className="text-sm text-gray-500">{rationale}</p>
      </div>
      <CreditUtilizationModal open={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </ReportSummaryCard>
  )
}
