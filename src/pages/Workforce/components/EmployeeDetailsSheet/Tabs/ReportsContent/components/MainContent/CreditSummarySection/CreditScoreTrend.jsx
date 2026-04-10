import React from 'react'
import ReactApexChart from 'react-apexcharts'

export default function CreditScoreTrend() {
  const series = [
    {
      name: 'Credit Score',
      data: [620, 650, 640, 645, 648, 655, 640, 660, 650, 665, 655, 680, 690, 685, 710, 720, 722, 730, 725, 710, 705, 720, 715, 712, 725, 740, 750, 745, 770],
    },
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
    colors: ['#42307D'],
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
      categories: [
        'Jan',
        '',
        '',
        'Feb',
        '',
        '',
        'Mar',
        '',
        '',
        'Apr',
        '',
        '',
        'May',
        '',
        '',
        'Jun',
        '',
        '',
        'Jul',
        '',
        '',
        'Aug',
        '',
        '',
        'Sep',
        '',
        'Oct',
        '',
        'Nov',
        '',
        'Dec',
      ],
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
      max: 1000,
      tickAmount: 5,
      labels: {
        style: {
          colors: '#667085',
          fontSize: '12px',
          fontFamily: 'Inter',
          fontWeight: 400,
        },
        formatter: (val) => val.toLocaleString(),
      },
    },
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
        Historical score
      </div>
      <div className="pl-4">
        <ReactApexChart options={options} series={series} type="area" height={250} />
      </div>
      <div className="w-full text-center text-xs font-medium text-gray-500 mt-2">Month</div>
    </div>
  )
}
