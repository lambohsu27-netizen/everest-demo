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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col h-full">
            <h4 className="text-md-bold text-gray-900 px-6 py-5 border-b border-gray-200">
              Lorem ipsum
            </h4>
            <div className="p-6 flex flex-col">
              <div className="flex flex-col gap-6">
                <div className="flex justify-between items-center text-md-regular border-b border-gray-100 pb-6">
                  <span className="text-gray-600">Estimasi cicilan/bulan</span>
                  <span className="font-bold text-gray-900">Rp 20,801,000</span>
                </div>
                <div className="flex justify-between items-center text-md-regular border-b border-gray-100 pb-6">
                  <span className="text-gray-600">Fasilitas paling awal</span>
                  <span className="font-bold text-gray-900">18 Feb 2011</span>
                </div>
                <div className="flex justify-between items-center text-md-regular">
                  <span className="text-gray-600">Fasilitas terbaru</span>
                  <span className="font-bold text-gray-900">28 Juli 2024</span>
                </div>
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
