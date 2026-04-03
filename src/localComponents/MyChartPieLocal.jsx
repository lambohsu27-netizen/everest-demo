import React, { useEffect, useMemo, useState } from 'react'
import ReactApexChart from 'react-apexcharts'

export default function MyChartPieLocal({
  values = [],
  colors = [],
  labels = [],
  height = 300,
  type = 'pie',
  params = {},
}) {
  const [series, setSeries] = useState([])
  const [toolTip, setToolTip] = useState([])

  useEffect(() => {
    const raw = values.map((e) => parseInt(e, 10) || 0)
    setToolTip(values)
    const total = raw.reduce((a, b) => a + b, 0)
    setSeries(total > 0 ? raw.map((v) => (v / total) * 100) : [])
  }, [values, params?.filter])

  const options = useMemo(
    () => ({
      chart: {
        animations: {
          enabled: true,
          dynamicAnimation: { speed: 800 },
          animateGradually: { delay: 150 },
        },
        toolbar: { show: false },
      },
      colors,
      labels,
      dataLabels: { enabled: false },
      stroke: { width: 0 },
      tooltip: {
        y: {
          formatter: (value, { seriesIndex }) => {
            return (toolTip[seriesIndex] || 0).toLocaleString()
          },
        },
      },
    }),
    [colors, labels, values, toolTip]
  )

  if (!series.length) {
    return (
      <div
        style={{ height: height - 255 }}
        className="flex items-center justify-center text-gray-500"
      >
        No data to display
      </div>
    )
  }

  return (
    <ReactApexChart
      options={options}
      series={series}
      type={type}
      height={height}
      width="100%"
      redraw
    />
  )
}
