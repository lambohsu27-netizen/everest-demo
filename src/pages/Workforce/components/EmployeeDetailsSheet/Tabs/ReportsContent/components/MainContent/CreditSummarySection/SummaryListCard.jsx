import React from 'react'
import { useWorkforce } from '../../../../../../../Context'

const DASH = '—'

function formatIDR(n) {
  const v = Number(n)
  if (!v) return 'Rp 0'
  return `Rp ${v.toLocaleString('en-US', { maximumFractionDigits: 0 })}`
}

function formatDate(value) {
  if (!value) return DASH
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return String(value)
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function SummaryListCard() {
  const { workforceDetailReport } = useWorkforce()
  const summary = workforceDetailReport?.credit_summary ?? {}
  // The new shape moved these three values into a single `lorem_ipsum` slot
  // (placeholder card name from Figma) on credit_summary.
  const li = summary.lorem_ipsum ?? {}

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col h-full">
      <h4 className="text-md-bold text-gray-900 px-6 py-5 border-b border-gray-200">
        Credit Facility Summary
      </h4>
      <div className="p-6 flex flex-col h-full justify-center">
        <div className="flex flex-col gap-6">
          <div className="flex flex-wrap justify-between items-center gap-2 text-md-regular border-b border-gray-100 pb-6">
            <span className="text-gray-600 min-w-[120px]">Estimasi cicilan/bulan</span>
            <span className="font-bold text-gray-900 whitespace-nowrap">
              {formatIDR(li.estimated_monthly_installment)}
            </span>
          </div>
          <div className="flex flex-wrap justify-between items-center gap-2 text-md-regular border-b border-gray-100 pb-6">
            <span className="text-gray-600 min-w-[120px]">Fasilitas paling awal</span>
            <span className="font-bold text-gray-900 whitespace-nowrap">
              {formatDate(li.earliest_facility)}
            </span>
          </div>
          <div className="flex flex-wrap justify-between items-center gap-2 text-md-regular">
            <span className="text-gray-600 min-w-[120px]">Fasilitas terbaru</span>
            <span className="font-bold text-gray-900 whitespace-nowrap">
              {formatDate(li.latest_facility)}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
