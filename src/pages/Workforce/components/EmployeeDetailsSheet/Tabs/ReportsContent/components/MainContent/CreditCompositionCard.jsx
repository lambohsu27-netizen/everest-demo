import React from 'react'
import ReactApexChart from 'react-apexcharts'
import ReportSummaryCard from './ReportSummaryCard'
import { useWorkforce } from '../../../../../../Context'

const PALETTE = ['#7f56d9', '#9e77ed', '#b692f6', '#d6bbfb', '#e9eaeb', '#c4b5fd', '#a78bfa']

export default function CreditCompositionCard() {
  const { handleCurrentSlider, workforceDetailReport } = useWorkforce()
  const composition = workforceDetailReport?.credit_overview?.credit_composition ?? []
  // The new shape always emits 5 rows (consumer/working/credit_card/installment/other).
  // Empty buckets ship total=0 — the donut would render a single grey ring; we
  // suppress those rows so the legend only shows buckets the user has activity in.
  const SERIES_DATA = composition
    .map((c, i) => ({
      label: c.category,
      color: PALETTE[i % PALETTE.length],
      value: Number(c.total) || 0,
    }))
    .filter((s) => s.value > 0)

  const options = {
    chart: {
      type: 'donut',
      sparkline: { enabled: true },
    },
    colors: SERIES_DATA.map((s) => s.color),
    labels: SERIES_DATA.map((s) => s.label),
    dataLabels: { enabled: false },
    legend: { show: false },
    stroke: {
      width: 0, // no gap between slices
    },
    plotOptions: {
      pie: {
        donut: {
          size: '50%', // Figma: Hole=50%
        },
        expandOnClick: false,
      },
    },
    states: {
      hover: { filter: { type: 'none' } },
      active: { filter: { type: 'none' } },
    },
    tooltip: {
      y: { formatter: (val) => `${val}` },
    },
  }

  const series = SERIES_DATA.map((s) => s.value)

  return (
    <ReportSummaryCard
      title="Credit Composition"
      description="Breakdown of credit types associated with the individual."
      onViewReport={() => handleCurrentSlider({ current: 'credit-composition' })}
    >
      {/* Figma: horizontal layout, itemSpacing=24, chart 200×200 + legend 132×116 */}
      <div className="flex items-start gap-6 py-4">
        {/* Donut chart — 200×200 */}
        <div className="flex-shrink-0 w-[200px] h-[200px]">
          <ReactApexChart options={options} series={series} type="donut" width={200} height={200} />
        </div>

        {/* Legend — vertical, itemSpacing=4 */}
        <div className="flex flex-col gap-1">
          {SERIES_DATA.map((item) => (
            <div key={item.label} className="flex items-center gap-2 h-5">
              {/* Dot: 8×8 circle, paddingTop=6 on wrapper = vertically offset */}
              <span
                className="flex-shrink-0 w-2 h-2 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              {/* Label: Inter Regular 14px / 20px, color #535862 */}
              <span
                className="text-[14px] leading-[20px] font-normal whitespace-nowrap"
                style={{ color: '#535862', fontFamily: 'Inter, sans-serif' }}
              >
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </ReportSummaryCard>
  )
}
