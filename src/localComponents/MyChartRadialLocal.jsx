import React, { useEffect, useMemo, useState } from 'react'
import ReactApexChart from 'react-apexcharts'

const MyChartRadialLocal = ({
  values = [],
  colors = [],
  labels = [],
  height = 300,
  totalLabel = 'Total',
  totalValue = 0,
  type = 'radialBar',
}) => {
  const [chartData, setChartData] = useState({
    total: 0,
    values: [],
    series: [],
  })

  useEffect(() => {
    if (Array.isArray(values) && values.length) {
      const _values = values.map((e) => parseInt(e, 10) || 0)
      const total = _values.reduce((a, b) => a + b, 0)
      const series =
        total > 0 ? _values.map((e) => (e / total) * 100) : []
      setChartData({ total, values: _values, series })
    } else {
      setChartData({ total: 0, values: [], series: [] })
    }
  }, [values])

  const options = useMemo(() => {
    return {
      stroke: { width: -20, lineCap: 'round' },
      chart: { offsetY: 0 },
      values: chartData.values,
      colors,
      labels,
      legend: {
        horizontalAlign: 'left',
        fontFamily: "'Inter', sans-serif",
        color: '#475467',
      },
      noData: {
        text: 'No data to display',
        align: 'center',
        verticalAlign: 'middle',
        style: {
          color: '#888888',
          fontSize: '14px',
          fontFamily: "'Inter', sans-serif",
        },
      },
      plotOptions: {
        radialBar: {
          startAngle: 0,
          endAngle: 360,
          track: {
            background: '#F2F4F7',
            opacity: 1,
            margin: 5,
          },
          dataLabels: {
            name: { offsetY: -15 },
            value: {
              fontSize: '36px',
              fontFamily: 'Inter',
              fontWeight: 600,
              color: '#101828',
              offsetY: 5,
              formatter: function (val, w) {
                var idx = (w.config.series ?? []).findIndex(
                  (e) => e.toString() === val.toString()
                )
                if (idx !== -1)
                  return w.config.values[idx].toLocaleString()
                return '-'
              },
            },
            total: {
              show: true,
              label: totalLabel,
              fontSize: '14px',
              fontFamily: 'Inter',
              fontWeight: 500,
              color: '#475467',
              formatter: () => totalValue.toLocaleString(),
            },
          },
        },
      },
      dataLabels: { enabled: true },
    }
  }, [chartData.values, colors, labels, totalLabel, totalValue])

  if (chartData.total === 0) {
    return (
      <div
        style={{ height }}
        className="flex items-center justify-center text-gray-500"
      >
        No data to display
      </div>
    )
  }

  return (
    <ReactApexChart
      type={type}
      height={height}
      width="100%"
      options={options}
      series={chartData.series}
    />
  )
}

export default MyChartRadialLocal
