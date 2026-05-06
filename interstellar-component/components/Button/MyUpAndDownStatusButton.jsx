/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useRef, useState, useEffect } from 'react'
import MyButton from './MyButton'

function MyUpAndDownStatusButton({ value, onChange = () => {}, isAllStatus }) {
  const [indicatorStyle, setIndicatorStyle] = useState({})
  const containerRef = useRef(null)

  useEffect(() => {
    // Update the indicator's position and size when the value changes
    const container = containerRef.current
    if (container) {
      const buttons = Array.from(container.children)
      const activeIndex = value === 'all' ? 1 : value === 'up' ? 2 : 3 // Map value to index
      const activeButton = buttons[activeIndex]
      if (activeButton) {
        const { offsetLeft, offsetWidth } = activeButton
        setIndicatorStyle({
          left: `${offsetLeft}px`,
          width: `${offsetWidth}px`,
        })
      }
    }
  }, [value])

  return (
    <div
      ref={containerRef}
      className="relative flex w-max overflow-hidden rounded-lg border border-gray-light/300 bg-gray-light/50 shadow-shadows/shadow-xs"
    >
      {/* Sliding background */}
      <div
        className="absolute top-0 h-full rounded-md bg-white outline outline-1 outline-gray-300 transition-all duration-300 ease-in-out"
        style={indicatorStyle}
      />

      {isAllStatus && (
        <div
          key="unavailable"
          onClick={() => {
            onChange('all')
          }}
          className="relative px-4 py-2"
        >
          <MyButton color="secondary" variant="text">
            <p className="text-sm-semibold">All status</p>
          </MyButton>
        </div>
      )}
      <div
        key="active"
        onClick={() => {
          onChange('up')
        }}
        className="relative px-4 py-2"
      >
        <MyButton color="secondary" variant="text">
          <p className="text-sm-semibold">Up</p>
        </MyButton>
      </div>

      <div
        key="archive"
        onClick={() => {
          onChange('down')
        }}
        className="relative px-4 py-2"
      >
        <MyButton color="secondary" variant="text">
          <p className="text-sm-semibold">Down</p>
        </MyButton>
      </div>
    </div>
  )
}

export default MyUpAndDownStatusButton
