import React, { useMemo } from 'react'
import ReactApexChart from 'react-apexcharts'
import { useWorkforce } from '../../../../../../../Context'
import { formatMonthLabel, parseMonthKey } from '../../../../../adapters/workforceDetailAdapter'

export default function CollectabilityTrend() {
  const { workforceDetailReport } = useWorkforce()
  const trend = workforceDetailReport?.credit_summary?.collectability_trend ?? []

  const { categories, dpd, kol } = useMemo(() => {
    const sorted = [...trend].sort((a, b) => parseMonthKey(a.date) - parseMonthKey(b.date))
    return {
      categories: sorted.map((d) => formatMonthLabel(d.date)),
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
