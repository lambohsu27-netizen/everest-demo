import React, { useState, useCallback, useMemo } from 'react'

function MyLayeredBarChart({ series = [], colors = [], labels = [], height = 300 }) {
  const [hoveredIndex, setHoveredIndex] = useState(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  // Find the absolute maximum value to scale the chart
  const maxValue = useMemo(
    () =>
      Math.max(
        ...(series.length > 0 ? series.map((s) => Math.max(...(s.data || [0]))) : [0]),
        1 // fallback to avoid division by 0
      ),
    [series]
  )

  // Number of horizontal grid lines to render
  const gridLines = [4, 3, 2, 1, 0] // 5 lines representing 100%, 75%, 50%, 25%, 0%

  const handleMouseMove = useCallback((e) => {
    setMousePos({ x: e.clientX, y: e.clientY })
  }, [])

  const handleMouseEnter = useCallback((idx) => {
    setHoveredIndex(idx)
  }, [])

  const handleMouseLeave = useCallback(() => {
    setHoveredIndex(null)
  }, [])

  // Calculate tooltip data for the currently hovered bar
  const activeTooltipData = useMemo(() => {
    if (hoveredIndex === null) return null
    return {
      label: labels[hoveredIndex],
      dataPoints: series.map((s, sIdx) => ({
        name: s.name,
        value: s.data[hoveredIndex] || 0,
        color: colors[sIdx] || '#000',
      })),
    }
  }, [hoveredIndex, labels, series, colors])

  return (
    <div
      className="relative w-full overflow-x-auto overflow-y-hidden"
      style={{ height: `${height}px` }}
      onMouseMove={handleMouseMove}
    >
      <div className="relative flex min-w-max w-full h-full flex-col font-sans">
        {/* Y-axis Grid Lines */}
        <div className="absolute inset-0 flex flex-col justify-between pb-6">
          {gridLines.map((i) => (
            <div key={i} className="h-px w-full bg-[#e9eaeb]" />
          ))}
        </div>

        {/* Bars Container */}
        <div className="relative z-10 flex h-full w-full items-end justify-between gap-4 px-2 pb-6 pt-2">
          {labels.map((label, idx) => {
            const dataPoints = series.map((s, sIdx) => ({
              name: s.name,
              value: s.data[idx] || 0,
              color: colors[sIdx] || '#000',
            }))

            // Sort descending so the tallest bar is rendered first (in the back)
            const sortedPoints = [...dataPoints].sort((a, b) => b.value - a.value)

            return (
              <div
                key={label}
                className="group relative flex h-full shrink-0 w-[24px] md:w-[32px] flex-col items-center justify-end"
                onMouseEnter={() => handleMouseEnter(idx)}
                onMouseLeave={handleMouseLeave}
              >
                {/* The overlapping bars */}
                <div className="relative flex h-full w-full items-end justify-center">
                  {sortedPoints.map((dp, dpIdx) => {
                    const barHeightPercent = (dp.value / maxValue) * 100
                    return (
                      <div
                        key={dpIdx}
                        className="absolute bottom-0 w-full rounded-t-[4px] transition-all duration-300 hover:brightness-90"
                        style={{
                          height: `${Math.max(barHeightPercent, 0)}%`,
                          backgroundColor: dp.color,
                          zIndex: dpIdx,
                        }}
                      />
                    )
                  })}
                </div>

                {/* X-axis Label */}
                <div className="absolute -bottom-6 w-max text-center text-[12px] text-[#667085]">
                  {label}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Floating Tooltip - Fixed position to escape overflow-y-hidden clipping */}
      {activeTooltipData && (
        <div
          className="pointer-events-none fixed z-[9999] flex w-max flex-col gap-1.5 rounded-lg bg-[#181d27] px-3 py-2 text-xs text-white shadow-lg transition-transform duration-75"
          style={{
            top: mousePos.y - 12,
            left: mousePos.x,
            transform: 'translate(-50%, -100%)',
          }}
        >
          <span className="font-semibold text-gray-100">{activeTooltipData.label}</span>
          {activeTooltipData.dataPoints.map((dp) => (
            <div key={dp.name} className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: dp.color }} />
              <span className="text-gray-300">{dp.name}:</span>
              <span className="ml-auto font-medium text-white">{dp.value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MyLayeredBarChart
