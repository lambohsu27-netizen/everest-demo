import React, { useMemo } from 'react'
import ReactApexChart from 'react-apexcharts'
import ReportSummaryCard from './ReportSummaryCard'
import { useWorkforce } from '../../../../../../Context'
import { formatMonthLabel, parseMonthKey } from '../../../../adapters/workforceDetailAdapter'

const AXIS_LABEL_STYLE = {
  colors: '#535862',
  fontSize: '12px',
  fontFamily: 'Inter, sans-serif',
  fontWeight: 400,
}

// DEMO DATA — credit_overview.new_credit_facilities is an empty array for
// most snapshots in dev. We show a 12-month preview series so the bar chart
// always has something to render.
const DEMO_SERIES = [
  { date: '2025-05', count: 0, total_limit: 0 },
  { date: '2025-06', count: 1, total_limit: 5000000 },
  { date: '2025-07', count: 0, total_limit: 0 },
  { date: '2025-08', count: 2, total_limit: 18000000 },
  { date: '2025-09', count: 1, total_limit: 9500000 },
  { date: '2025-10', count: 0, total_limit: 0 },
  { date: '2025-11', count: 3, total_limit: 22000000 },
  { date: '2025-12', count: 1, total_limit: 7500000 },
  { date: '2026-01', count: 2, total_limit: 14000000 },
  { date: '2026-02', count: 0, total_limit: 0 },
  { date: '2026-03', count: 1, total_limit: 6000000 },
  { date: '2026-04', count: 1, total_limit: 8500000 },
]

export default function NewCreditFacilitiesCard() {
  const { workforceDetailReport } = useWorkforce()
  const apiSeries = workforceDetailReport?.credit_overview?.new_credit_facilities ?? []
  const series = apiSeries.length ? apiSeries : DEMO_SERIES

  const { categories, data } = useMemo(() => {
    const sorted = [...series].sort((a, b) => parseMonthKey(a.date) - parseMonthKey(b.date))
    return {
      categories: sorted.map((d) => formatMonthLabel(d.date)),
      data: sorted.map((d) => Number(d.count) || 0),
    }
  }, [series])

  const options = {
    chart: {
      type: 'bar',
      toolbar: { show: false },
      zoom: { enabled: false },
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        columnWidth: '55%',
      },
    },
    colors: ['#7f56d9'],
    dataLabels: { enabled: false },
    legend: { show: false },
    grid: {
      borderColor: '#e9eaeb',
      strokeDashArray: 0,
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true } },
      padding: { left: 0, right: 8 },
    },
    xaxis: {
      categories,
      labels: { style: AXIS_LABEL_STYLE },
      axisBorder: { show: false },
      axisTicks: { show: false },
      title: {
        text: 'Month',
        style: {
          color: '#535862',
          fontSize: '12px',
          fontFamily: 'Inter, sans-serif',
          fontWeight: 500,
        },
        offsetY: 4,
      },
    },
    yaxis: {
      min: 0,
      tickAmount: 5,
      labels: {
        style: AXIS_LABEL_STYLE,
        formatter: (val) => Math.round(val).toLocaleString(),
      },
      title: {
        text: '# of new facilities',
        style: {
          color: '#535862',
          fontSize: '12px',
          fontFamily: 'Inter, sans-serif',
          fontWeight: 500,
        },
      },
    },
    tooltip: {
      y: { formatter: (val) => `${val} facility/ies` },
    },
  }

  const seriesOpt = [{ name: 'New facilities', data }]

  return (
    <ReportSummaryCard
      title="New Credit Facilities"
      description="Newly issued credit facilities over time, indicating borrowing activity and credit demand behavior."
      onViewReport={false}
    >
      <div className="w-full pt-2 pb-2">
        <ReactApexChart options={options} series={seriesOpt} type="bar" height={251} />
      </div>
    </ReportSummaryCard>
  )
}
