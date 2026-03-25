import React from 'react'
import MyLayeredBarChart from '../../../interstellar-component/components/Chart/MyLayeredBarChart'

const CHART_COLORS = ['#6941C6', '#9E77ED', '#EAEBEE']
const CHART_LABELS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]

const mockSeries1 = [
  { name: 'KOL 1', data: [15, 20, 10, 15, 10, 20, 15, 20, 15, 20, 25, 15] },
  { name: 'KOL 2', data: [20, 30, 15, 25, 15, 30, 25, 30, 25, 35, 40, 25] },
  { name: 'KOL 3', data: [30, 40, 20, 35, 20, 40, 30, 40, 30, 45, 50, 35] },
]

const mockSeries2 = [
  { name: 'KOL 1', data: [12, 18, 8, 13, 8, 18, 13, 18, 13, 18, 23, 13] },
  { name: 'KOL 2', data: [18, 28, 13, 23, 13, 28, 23, 28, 23, 33, 38, 23] },
  { name: 'KOL 3', data: [28, 38, 18, 33, 18, 38, 28, 38, 28, 43, 48, 33] },
]

function ChartCard({ title, subtitle, series }) {
  return (
    <div className="flex-1 min-w-0 rounded-xl border border-gray-light/200 bg-white p-6 shadow-sm flex flex-col gap-6">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          <p className="text-sm text-gray-600">{subtitle}</p>
        </div>
        {/* Custom Legend because MyChartBar legend is false */}
        <div className="flex items-center gap-4 text-xs font-medium text-gray-500">
          {series.map((s, i) => (
            <div key={s.name} className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: CHART_COLORS[i] }} />
              {s.name}
            </div>
          ))}
        </div>
      </div>

      <div className="h-[240px] w-full">
        <MyLayeredBarChart series={series} colors={CHART_COLORS} labels={CHART_LABELS} height={240} />
      </div>
    </div>
  )
}

function KolektibilitasSection() {
  return (
    <div className="flex w-full flex-col gap-6 p-8 pb-0">
      <div className="flex flex-col gap-1">
        <h2 className="text-[18px] font-semibold text-gray-900">Kolektibilitas</h2>
        <p className="text-[14px] text-gray-600">
          Manage your team members and their account permissions here.
        </p>
      </div>

      <div className="flex flex-col gap-6 md:flex-row">
        <ChartCard
          title="Employee"
          subtitle="Track how your rating compares to your industry average."
          series={mockSeries1}
        />
        <ChartCard
          title="Candidate interview"
          subtitle="Track how your rating compares to your industry average."
          series={mockSeries2}
        />
      </div>
    </div>
  )
}

export default KolektibilitasSection
