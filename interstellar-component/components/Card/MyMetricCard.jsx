import React from 'react'

/**
 * MyMetricCard Component
 * A reusable metric card component that displays a label and a value.
 * Supports an active state and a custom onClick handler.
 */
function MyMetricCard({ label, value, active, onClick, className }) {
  const handleKeyDown = (event) => {
    if (onClick && (event.key === 'Enter' || event.key === ' ')) {
      onClick()
    }
  }

  const baseClasses = `flex flex-col gap-2 rounded-xl border p-4 shadow-sm w-[160px] md:flex-1 text-left transition-all duration-200 ${
    onClick
      ? 'cursor-pointer hover:shadow-md outline-none focus-visible:ring-2 focus-visible:ring-brand/500'
      : 'cursor-default'
  } ${
    active
      ? 'border-brand/500 bg-white ring-1 ring-brand/100'
      : 'border-gray-200 bg-white hover:border-gray-300'
  }`

  if (onClick) {
    return (
      <button type="button" onClick={onClick} onKeyDown={handleKeyDown} className={baseClasses}>
        <span className="text-sm font-medium text-gray-500">{label}</span>
        <span className="text-3xl font-semibold text-gray-900">{value}</span>
      </button>
    )
  }

  return (
    <div className={`${baseClasses} ${className}`}>
      <span className="text-sm font-medium text-gray-500">{label}</span>
      <span className="text-3xl font-semibold text-gray-900">{value}</span>
    </div>
  )
}

export default MyMetricCard
