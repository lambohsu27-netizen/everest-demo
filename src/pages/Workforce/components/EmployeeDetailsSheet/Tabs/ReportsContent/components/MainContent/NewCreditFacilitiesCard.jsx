import React from 'react'
import ReactApexChart from 'react-apexcharts'
import ReportSummaryCard from './ReportSummaryCard'

// Figma: Line and bar chart, Chart style=Line (rendered as Bar), Legend=False, Axis labels=True
// X-axis: 12 months (Jan–Dec), Y-axis: 0–1000 (step 200), label: "First plafon (mn. IDR)"
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const SAMPLE_DATA = [800, 960, 640, 840, 640, 920, 800, 840, 800, 880, 960, 760]

const AXIS_LABEL_STYLE = {
  colors: '#535862',
  fontSize: '12px',
  fontFamily: 'Inter, sans-serif',
  fontWeight: 400,
}

export default function NewCreditFacilitiesCard() {
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
      categories: MONTHS,
      labels: {
        style: AXIS_LABEL_STYLE,
      },
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
      max: 1000,
      tickAmount: 5,
      labels: {
        style: AXIS_LABEL_STYLE,
        formatter: (val) => val.toLocaleString(),
      },
      title: {
        text: 'First plafon (mn. IDR)',
        style: {
          color: '#535862',
          fontSize: '12px',
          fontFamily: 'Inter, sans-serif',
          fontWeight: 500,
        },
      },
    },
    tooltip: {
      y: { formatter: (val) => `${val.toLocaleString()} mn. IDR` },
    },
  }

  const series = [{ name: 'First Plafon', data: SAMPLE_DATA }]

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
