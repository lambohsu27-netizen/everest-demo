import React, { useMemo } from 'react'
import ReactApexChart from 'react-apexcharts'
import ReportSummaryCard from './ReportSummaryCard'
import { useWorkforce } from '../../../../../../Context'

const AXIS_LABEL_STYLE = {
  colors: '#535862',
  fontSize: '12px',
  fontFamily: 'Inter, sans-serif',
  fontWeight: 400,
}

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export default function NewCreditFacilitiesCard() {
  const { workforceDetail } = useWorkforce()
  const facilities = workforceDetail?.credit_report?.major_credit_facilities ?? []

  const { categories, data } = useMemo(() => {
    // Bucket by YYYY-MM using start_date, last 12 months window (from newest seen)
    const buckets = new Map()
    facilities.forEach((f) => {
      if (!f.start_date) return
      const d = new Date(String(f.start_date).replace(/\//g, '-'))
      if (Number.isNaN(d.getTime())) return
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
      buckets.set(key, (buckets.get(key) || 0) + 1)
    })
    const sortedKeys = Array.from(buckets.keys()).sort()
    const last12 = sortedKeys.slice(-12)
    return {
      categories: last12.map((k) => {
        const [, m] = k.split('-')
        return MONTH_LABELS[Number(m) - 1]
      }),
      data: last12.map((k) => buckets.get(k) || 0),
    }
  }, [facilities])

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

  const series = [{ name: 'New facilities', data }]

  return (
    <ReportSummaryCard
      title="New Credit Facilities"
      description="Newly issued credit facilities over time, indicating borrowing activity and credit demand behavior."
      onViewReport={() => {}} // TODO: Define action
    >
      <div className="w-full pt-2 pb-2">
        <ReactApexChart options={options} series={series} type="bar" height={251} />
      </div>
    </ReportSummaryCard>
  )
}
