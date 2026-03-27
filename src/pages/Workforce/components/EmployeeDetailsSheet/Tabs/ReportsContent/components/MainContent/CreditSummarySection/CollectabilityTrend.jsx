import React, { useState } from 'react'
import ReactApexChart from 'react-apexcharts'
import { MyHorizontalTabV2 } from '@interstellar-component'

const TABS = [
  { label: 'Contract', value: 'Contract' },
  { label: 'Value', value: 'Value' },
]

const contractData = {
  kol1: [68, 68, 67, 69, 70, 68, 70, 72, 71, 73, 74, 76, 78, 79, 80, 81, 80, 82, 83, 82, 84, 85, 86, 87, 88, 88, 89, 90, 91],
  kol2: [50, 51, 50, 52, 51, 53, 52, 54, 55, 54, 56, 57, 58, 57, 59, 58, 60, 61, 60, 62, 63, 62, 63, 64, 65, 64, 65, 65, 66],
  kol3: [39, 40, 41, 42, 40, 41, 43, 42, 44, 43, 45, 44, 45, 46, 45, 47, 46, 48, 47, 49, 48, 50, 49, 51, 50, 52, 51, 53, 52],
}

const valueData = {
  kol1: [72, 74, 73, 75, 74, 76, 75, 77, 76, 78, 77, 79, 80, 81, 82, 83, 82, 84, 85, 86, 87, 88, 89, 90, 91, 90, 91, 92, 93],
  kol2: [54, 55, 56, 57, 56, 58, 57, 59, 60, 61, 60, 62, 63, 64, 65, 64, 66, 65, 67, 66, 68, 67, 69, 68, 70, 69, 70, 71, 72],
  kol3: [42, 43, 44, 45, 44, 46, 45, 47, 46, 48, 47, 49, 48, 50, 51, 50, 52, 51, 53, 52, 54, 53, 55, 54, 56, 55, 57, 56, 58],
}

const LABELS = [
  'Jan', '', '', 'Feb', '', '', 'Mar', '', '', 'Apr', '', '', 'May', '', '',
  'Jun', '', '', 'Jul', '', '', 'Aug', '', '', 'Sep', '', 'Oct', '', 'Nov', '', 'Dec',
]

export default function CollectabilityTrend() {
  const [activeTab, setActiveTab] = useState('Contract')

  const data = activeTab === 'Contract' ? contractData : valueData

  const series = [
    { name: 'Kol 1', data: data.kol1 },
    { name: 'Kol 2', data: data.kol2 },
    { name: 'Kol 3', data: data.kol3 },
  ]

  const options = {
    chart: {
      type: 'line',
      height: 220,
      toolbar: { show: false },
      zoom: { enabled: false },
    },
    colors: ['#7F56D9', '#C4B5FD', '#1E1B7B'],
    dataLabels: { enabled: false },
    stroke: {
      curve: 'smooth',
      width: 2,
    },
    legend: {
      show: true,
      position: 'top',
      horizontalAlign: 'right',
      markers: {
        radius: 12,
      },
      labels: {
        colors: '#344054',
      },
      fontFamily: 'Inter',
      fontSize: '13px',
      fontWeight: 500,
      itemMargin: {
        horizontal: 12,
      },
    },
    grid: {
      borderColor: '#F2F4F7',
      xaxis: { lines: { show: true } },
      yaxis: { lines: { show: true } },
      padding: { top: 0, right: 0, bottom: 0, left: 10 },
    },
    xaxis: {
      categories: LABELS,
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: {
        rotate: 0,
        hideOverlappingLabels: true,
        style: {
          colors: '#667085',
          fontSize: '12px',
          fontFamily: 'Inter',
          fontWeight: 400,
        },
      },
    },
    yaxis: {
      min: 0,
      max: 100,
      tickAmount: 5,
      labels: {
        style: {
          colors: '#667085',
          fontSize: '12px',
          fontFamily: 'Inter',
          fontWeight: 400,
        },
      },
    },
    tooltip: { theme: 'light' },
  }

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Tab switcher */}
      <MyHorizontalTabV2 value={activeTab} onChange={setActiveTab} tabs={TABS} fitContent />

      {/* Chart */}
      <div className="w-full relative">
        <div className="absolute left-[-35px] top-1/2 -translate-y-1/2 rotate-[-90deg] whitespace-nowrap text-xs font-medium text-gray-500">
          # of contract
        </div>
        <div className="pl-0">
          <ReactApexChart options={options} series={series} type="line" height={220} />
        </div>
      </div>
    </div>
  )
}
