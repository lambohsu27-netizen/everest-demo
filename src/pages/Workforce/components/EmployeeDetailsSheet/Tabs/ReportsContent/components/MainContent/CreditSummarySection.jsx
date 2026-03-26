import React from 'react'
import { TrendDown01, TrendUp01 } from '@untitled-ui/icons-react'

function StatCard({ title, value, trend, trendUp }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm flex flex-col gap-3 relative overflow-hidden">
      <h4 className="text-sm font-medium text-gray-600">{title}</h4>
      <div className="text-2xl font-bold text-gray-900">{value}</div>
      <div className="flex items-center gap-1.5 text-sm">
        {trendUp ? (
          <TrendUp01 className="h-4 w-4 text-green-600" />
        ) : (
          <TrendDown01 className="h-4 w-4 text-red-600" />
        )}
        <span className={`font-semibold ${trendUp ? 'text-green-600' : 'text-red-600'}`}>
          {trend}
        </span>
        <span className="text-gray-500">last mth</span>
      </div>
      {/* Decorative background chart placeholder */}
      <div className="absolute -bottom-2 -right-2 h-16 w-3/4 opacity-10 bg-gradient-to-t from-gray-400 to-transparent" />
    </div>
  )
}

export default function CreditSummarySection() {
  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex flex-col gap-1 pb-4 border-b border-gray-200">
        <h3 className="text-xl font-bold text-gray-900">Credit Summary</h3>
        <p className="text-sm text-gray-500">
          Overview of the individual&apos;s credit profile based on the latest available report.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        {/* Row 1: Status & Info */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm flex flex-col justify-between">
              <h4 className="text-sm font-medium text-gray-600 mb-2">Collectability Status</h4>
              <div className="text-3xl font-bold text-red-600 mb-3">KOL 5</div>
              <div className="flex h-2 w-full rounded-full overflow-hidden bg-gray-100">
                <div className="w-full bg-red-600" />
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm flex flex-col justify-between">
              <h4 className="text-sm font-medium text-gray-600 mb-2">Credit Score</h4>
              <div className="text-3xl font-bold text-gray-900 mb-3">212</div>
              <div className="flex h-2 w-full rounded-full overflow-hidden bg-gray-100">
                <div className="w-1/4 bg-red-600" />
              </div>
              <div className="text-sm font-semibold text-red-600 mt-2">High risk</div>
            </div>
          </div>

          <div className="bg-[#fdfdfd] rounded-xl border border-gray-200 p-5 shadow-sm">
            <h4 className="text-sm font-bold text-gray-900 mb-5">Lorem ipsum</h4>
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center text-sm border-b border-gray-100 pb-2">
                <span className="text-gray-500">Estimasi cicilan/bulan</span>
                <span className="font-semibold text-gray-900">Rp 20,801,000</span>
              </div>
              <div className="flex justify-between items-center text-sm border-b border-gray-100 pb-2">
                <span className="text-gray-500">Fasilitas paling awal</span>
                <span className="font-semibold text-gray-900">18 Feb 2011</span>
              </div>
              <div className="flex justify-between items-center text-sm pb-1">
                <span className="text-gray-500">Fasilitas terbaru</span>
                <span className="font-semibold text-gray-900">28 Juli 2024</span>
              </div>
            </div>
          </div>
        </div>

        {/* Row 2: Loan Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard title="Total Outstanding Loans" value="Rp 384,500,000" trend="15%" trendUp />
          <StatCard title="Total Overdue Loans" value="Rp 11,500,000" trend="15%" trendUp={false} />
          <StatCard
            title="Total plafon efektif"
            value="Rp 930,280,161"
            trend="15%"
            trendUp={false}
          />
        </div>

        {/* Charts */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <h4 className="text-base font-semibold text-gray-900">Credit Score Trend</h4>
            <span className="text-sm text-gray-500">
              Historical view of the individual&apos;s credit score over time
            </span>
          </div>
          <div className="h-64 w-full bg-gray-50 rounded-lg flex items-center justify-center border border-dashed border-gray-200">
            <span className="text-sm text-gray-400 font-medium">[ Line Chart Placeholder ]</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <h4 className="text-base font-semibold text-gray-900">Collectability Trend</h4>
            <span className="text-sm text-gray-500">
              Distribution of non-collectability status over time based on credit records.
            </span>
          </div>
          <div className="h-64 w-full bg-gray-50 rounded-lg flex items-center justify-center border border-dashed border-gray-200">
            <span className="text-sm text-gray-400 font-medium">
              [ Multi-line Chart Placeholder ]
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
