import React, { useMemo } from 'react'
import ReactApexChart from 'react-apexcharts'
import { useWorkforce } from '../../../../../../../Context'

const MONTH_ORDER = {
  Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
}

function parseTrendDate(s) {
  if (!s) return 0
  const [year, mon] = String(s).split(' ')
  return Number(year) * 12 + (MONTH_ORDER[mon] ?? 0)
}

export default function CollectabilityTrend() {
  const { workforceDetail } = useWorkforce()
  const trend = workforceDetail?.credit_report?.collectability_trend ?? []

  const { categories, dpd, kol } = useMemo(() => {
    const sorted = [...trend].sort((a, b) => parseTrendDate(a.date) - parseTrendDate(b.date))
    return {
      categories: sorted.map((d) => d.date),
      dpd: sorted.map((d) => Number(d.dpd) || 0),
      kol: sorted.map((d) => Number(d.kol) || 0),
    }
  }, [trend])

  const series = [
    { name: 'DPD (days)', type: 'line', data: dpd },
    { name: 'KOL', type: 'line', data: kol },
  ]

  const options = {
    chart: {
      height: 220,
      toolbar: { show: false },
      zoom: { enabled: false },
    },
    colors: ['#42307D', '#F79009'],
    dataLabels: { enabled: false },
    stroke: { curve: 'smooth', width: 2 },
    legend: {
      show: true,
      position: 'top',
      horizontalAlign: 'right',
      markers: { radius: 12 },
      labels: { colors: '#344054' },
      fontFamily: 'Inter',
      fontSize: '13px',
      fontWeight: 500,
      itemMargin: { horizontal: 12 },
    },
    grid: {
      borderColor: '#F2F4F7',
      xaxis: { lines: { show: true } },
      yaxis: { lines: { show: true } },
      padding: { top: 0, right: 0, bottom: 0, left: 10 },
    },
    xaxis: {
      categories,
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
    yaxis: [
      {
        seriesName: 'DPD (days)',
        labels: {
          style: { colors: '#667085', fontSize: '12px', fontFamily: 'Inter' },
        },
        title: { text: 'DPD' },
      },
      {
        seriesName: 'KOL',
        opposite: true,
        min: 0,
        max: 5,
        tickAmount: 5,
        labels: {
          style: { colors: '#667085', fontSize: '12px', fontFamily: 'Inter' },
        },
        title: { text: 'KOL' },
      },
    ],
    tooltip: { theme: 'light' },
  }

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="w-full relative">
        <ReactApexChart options={options} series={series} type="line" height={220} />
      </div>
    </div>
  )
}
