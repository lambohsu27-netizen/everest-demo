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

export default function CreditScoreTrend() {
  const { workforceDetail } = useWorkforce()
  const trend = workforceDetail?.credit_report?.credit_score_trend ?? []

  const { categories, outstanding, overdue } = useMemo(() => {
    const sorted = [...trend].sort((a, b) => parseTrendDate(a.date) - parseTrendDate(b.date))
    return {
      categories: sorted.map((d) => d.date),
      outstanding: sorted.map((d) => Number(d.outstanding) || 0),
      overdue: sorted.map((d) => Number(d.overdue) || 0),
    }
  }, [trend])

  const series = [
    { name: 'Outstanding', data: outstanding },
    { name: 'Overdue', data: overdue },
  ]

  const options = {
    chart: {
      type: 'area',
      height: 250,
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
    },
    colors: ['#42307D', '#F04438'],
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: 'smooth',
      width: 2,
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.15,
        opacityTo: 0.02,
        stops: [0, 90, 100],
      },
    },
    grid: {
      borderColor: '#F2F4F7',
      strokeDashArray: 0,
      xaxis: {
        lines: {
          show: false,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
      padding: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 10,
      },
    },
    xaxis: {
      categories,
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
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
      labels: {
        style: {
          colors: '#667085',
          fontSize: '12px',
          fontFamily: 'Inter',
          fontWeight: 400,
        },
        formatter: (val) => `Rp ${Number(val).toLocaleString('en-US')}`,
      },
    },
    legend: { show: true, position: 'top', horizontalAlign: 'right' },
    tooltip: {
      theme: 'light',
      x: {
        show: false,
      },
    },
  }

  return (
    <div className="w-full relative">
      <div className="absolute left-[-45px] top-1/2 -translate-y-1/2 rotate-[-90deg] whitespace-nowrap text-xs font-medium text-gray-500">
        Amount (IDR)
      </div>
      <div className="pl-4">
        <ReactApexChart options={options} series={series} type="area" height={250} />
      </div>
      <div className="w-full text-center text-xs font-medium text-gray-500 mt-2">Month</div>
    </div>
  )
}
