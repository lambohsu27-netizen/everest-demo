import { MyLayeredBarChart } from '@interstellar-component'

import { useDashboard } from '../Context'

const CHART_COLORS = ['#6941C6', '#9E77ED', '#EAEBEE']
const CHART_LABELS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
]

function ChartCard({ title, subtitle, series }) {
  return (
    <div className="flex-1 min-w-0 rounded-xl border border-gray-light/200 bg-white p-6 shadow-sm flex flex-col gap-6">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          <p className="text-sm text-gray-600">{subtitle}</p>
        </div>
      </div>

      {/* Custom Legend because MyChartBar legend is false */}
      <div className="flex items-center justify-end gap-4 text-xs font-medium text-gray-500">
        {series.map((s, i) => (
          <div key={s.name} className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: CHART_COLORS[i] }} />
            {s.name}
          </div>
        ))}
      </div>

      <div className="h-[240px] w-full">
        <MyLayeredBarChart
          series={series}
          colors={CHART_COLORS}
          labels={CHART_LABELS}
          height={240}
        />
      </div>
    </div>
  )
}

function KolektibilitasSection() {
  const { employeeSeries, candidateSeries } = useDashboard()

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
          series={employeeSeries || []}
        />
        <ChartCard
          title="Candidate interview"
          subtitle="Track how your rating compares to your industry average."
          series={candidateSeries || []}
        />
      </div>
    </div>
  )
}

export default KolektibilitasSection
