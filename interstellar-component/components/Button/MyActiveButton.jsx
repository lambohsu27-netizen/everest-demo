/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useRef, useState, useEffect } from 'react'
import MyButton from './MyButton'

function MyActiveButton({ value, onChange = () => {}, isUnavailable }) {
  const [indicatorStyle, setIndicatorStyle] = useState({})
  const containerRef = useRef(null)

  useEffect(() => {
    // Update the indicator's position and size when the value changes
    const container = containerRef.current
    if (container) {
      const buttons = Array.from(container.children)
      const activeIndex = value === 2 ? 0 : value === true ? 1 : 2 // Map value to index
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

      {isUnavailable && (
        <div
          key="allStatus"
          onClick={() => {
            onChange(2)
          }}
          className="relative px-4 py-2"
        >
          <MyButton color="secondary" variant="text">
            <p className="text-sm-semibold">Archived</p>
          </MyButton>
        </div>
      )}
      <div
        key="up"
        onClick={() => {
          onChange(true)
        }}
        className="relative px-4 py-2"
      >
        <MyButton color="secondary" variant="text">
          <p className="text-sm-semibold">Active</p>
        </MyButton>
      </div>

      <div
        key="down"
        onClick={() => {
          onChange(false)
        }}
        className="relative px-4 py-2"
      >
        <MyButton color="secondary" variant="text">
          <p className="text-sm-semibold">Inactive</p>
        </MyButton>
      </div>
    </div>
  )
}

export default MyActiveButton
