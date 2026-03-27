import React from 'react'

export default function SummaryListCard() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col h-full">
      <h4 className="text-md-bold text-gray-900 px-6 py-5 border-b border-gray-200">
        Lorem ipsum
      </h4>
      <div className="p-6 flex flex-col h-full justify-center">
        <div className="flex flex-col gap-6">
          <div className="flex flex-wrap justify-between items-center gap-2 text-md-regular border-b border-gray-100 pb-6">
            <span className="text-gray-600 min-w-[120px]">Estimasi cicilan/bulan</span>
            <span className="font-bold text-gray-900 whitespace-nowrap">Rp 20,801,000</span>
          </div>
          <div className="flex flex-wrap justify-between items-center gap-2 text-md-regular border-b border-gray-100 pb-6">
            <span className="text-gray-600 min-w-[120px]">Fasilitas paling awal</span>
            <span className="font-bold text-gray-900 whitespace-nowrap">18 Feb 2011</span>
          </div>
          <div className="flex flex-wrap justify-between items-center gap-2 text-md-regular">
            <span className="text-gray-600 min-w-[120px]">Fasilitas terbaru</span>
            <span className="font-bold text-gray-900 whitespace-nowrap">28 Juli 2024</span>
          </div>
        </div>
      </div>
    </div>
  )
}
