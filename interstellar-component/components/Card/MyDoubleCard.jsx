import React from 'react'

/**
 * MyDoubleCard Component
 *
 * A double-card layout: an outer container card with a heading section,
 * and an inner nested white card that holds the main content (children).
 *
 * Matches the Figma "Card" design pattern with:
 * - Outer card: #fdfdfd background, gray-200 border, 12px radius, subtle shadow
 * - Heading: flexible (can be string or any React component), placed outside/above the inner card
 * - Inner card: white background, gray-200 border, 12px radius, subtle shadow, 24px padding
 *
 * @param {string|ReactNode} heading   - The card heading label or component
 * @param {ReactNode}        children  - Content rendered inside the inner white card
 * @param {string}           className - Optional extra classes for the outer wrapper
 * @param {string}           innerClassName - Optional extra classes for the inner white card (default: p-6)
 */
function MyDoubleCard({ heading, children, className = '', innerClassName = 'p-6' }) {
  return (
    <div
      className={`rounded-xl border border-gray-200 bg-[#fdfdfd] shadow-[0_1px_2px_rgba(10,13,18,0.05)] overflow-hidden ${className}`}
    >
      {/* Heading wrapper */}
      {heading && (
        <div className="px-5 pt-3 pb-2">
          {typeof heading === 'string' ? (
            <span className="text-sm-semibold text-gray-900">{heading}</span>
          ) : (
            heading
          )}
        </div>
      )}

      {/* Inner nested white card */}
      <div
        className={`rounded-xl border border-gray-200 bg-white shadow-[0_1px_2px_rgba(10,13,18,0.05)] m-0 ${innerClassName}`}
      >
        {children}
      </div>
    </div>
  )
}

export default MyDoubleCard
