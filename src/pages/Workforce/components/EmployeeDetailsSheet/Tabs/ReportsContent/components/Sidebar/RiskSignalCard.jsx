import React from 'react'
import PropTypes from 'prop-types'

export default function RiskSignalCard({ icon: Icon, title, count, description, highlightText }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm flex flex-col gap-4">
      <div className="flex items-center gap-3 text-sm font-semibold">
        <div className="p-2 bg-gray-50 rounded-lg">
          <Icon className="h-5 w-5 text-purple-600" />
        </div>
        <span className="text-purple-600">{title}</span> 
      </div>
      
      <div className="flex flex-col gap-2">
        <h4 className="text-xl font-bold text-gray-900">
          {count} <span className="text-gray-900 font-bold text-lg">{highlightText}</span>
        </h4>
        <p className="text-sm text-gray-600 leading-relaxed">
          {description}
        </p>
      </div>
      
      <div className="pt-3 border-t border-gray-100 flex justify-end">
        <button className="text-sm font-semibold text-purple-600 hover:text-purple-700 transition-colors">
          View details
        </button>
      </div>
    </div>
  )
}

RiskSignalCard.propTypes = {
  icon: PropTypes.elementType.isRequired,
  title: PropTypes.string.isRequired,
  count: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  description: PropTypes.string.isRequired,
  highlightText: PropTypes.string,
}
