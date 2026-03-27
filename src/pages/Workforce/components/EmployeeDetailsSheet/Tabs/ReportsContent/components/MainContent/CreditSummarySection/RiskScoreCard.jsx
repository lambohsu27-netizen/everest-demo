import React from 'react'

export default function RiskScoreCard() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col p-6 h-full">
      {/* Collectability Status Section */}
      <div className="flex flex-col gap-4 pb-6 border-b border-gray-100">
        <h4 className="text-md-medium text-gray-600">Collectability Status</h4>
        <div className="text-[40px] leading-[48px] font-bold text-[#b42318]">KOL 5</div>
        <div className="relative pt-3 pb-1">
          {/* Pointer */}
          <div className="absolute top-0 left-[10%] -translate-x-1/2">
            <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-gray-400" />
          </div>
          {/* Segmented Bar */}
          <div className="flex gap-1 h-2.5 w-full">
            <div className="flex-1 bg-[#912018] rounded-l-full" />
            <div className="flex-1 bg-[#f04438]" />
            <div className="flex-1 bg-[#ff692e]" />
            <div className="flex-1 bg-[#fdb022]" />
            <div className="flex-1 bg-[#12b76a] rounded-r-full" />
          </div>
        </div>
      </div>

      {/* Credit Score Section */}
      <div className="flex flex-col gap-4 pt-6">
        <h4 className="text-md-medium text-gray-600">Credit Score</h4>
        <div className="text-[40px] leading-[48px] font-bold text-gray-700">212</div>
        <div className="flex h-2.5 w-full rounded-full overflow-hidden bg-gray-100">
          <div className="w-[40%] bg-[#b42318]" />
        </div>
        <div className="text-md-semibold text-[#b42318]">High risk</div>
      </div>
    </div>
  )
}
