import React, { useRef, useState, useEffect } from 'react'
import MyButton from '../Button/MyButton'

function MyHorizontalTabV2({ value, onChange = () => {}, tabs, fitContent = false }) {
  const [indicatorStyle, setIndicatorStyle] = useState({})
  const containerRef = useRef(null)

  useEffect(() => {
    // Update the indicator's position and size when the value changes
    const container = containerRef.current
    if (container) {
      const buttons = Array.from(container.children)
      const activeButton = buttons.find((button) => button.getAttribute('data-value') === value)
      if (activeButton) {
        const { offsetLeft, offsetWidth, offsetHeight } = activeButton
        setIndicatorStyle({
          left: `${offsetLeft}px`,
          width: `${offsetWidth}px`,
          height: `${offsetHeight}px`,
        })
      }
    }
  }, [value])

  return (
    <div
      ref={containerRef}
      className={`relative flex overflow-hidden rounded-lg border border-gray-light/300 bg-gray-light/50 shadow-shadows/shadow-xs ${
        fitContent ? 'w-fit' : 'w-full'
      }`}
    >
      {/* Sliding background */}
      <div
        className="absolute top-0 h-full rounded-md bg-white outline outline-1 outline-gray-300 transition-all duration-300 ease-in-out"
        style={indicatorStyle}
      />

      {tabs.map((tab) => (
        <div
          key={tab.value}
          data-value={tab.value}
          onClick={() => {
            onChange(tab.value)
          }}
          className={`relative flex items-center justify-center px-4 py-2 text-center cursor-pointer ${
            fitContent ? 'w-auto' : 'flex-1'
          }`}
        >
          <MyButton color="secondary" variant="text">
            <p className="text-sm-semibold whitespace-nowrap">{tab.label}</p>
          </MyButton>
        </div>
      ))}
    </div>
  )
}

export default MyHorizontalTabV2
