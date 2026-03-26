import React from 'react'

export default function CreditOverviewSection() {
  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex flex-col gap-1 pb-4 border-b border-gray-200">
        <h3 className="text-xl font-bold text-gray-900">Credit Overview</h3>
        <p className="text-sm text-gray-500">Summary of the individual&apos;s credit usage, composition, and recent borrowing activity.</p>
      </div>

      <div className="flex flex-col gap-6">
        {/* Top 2 Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
            <div className="p-6 flex flex-col gap-6">
              <div className="flex flex-col gap-1">
                <h4 className="text-base font-semibold text-gray-900">Credit Utilization</h4>
                <p className="text-sm text-gray-500 leading-relaxed">Percentage of total available credit currently in use.</p>
              </div>
              
              <div className="flex flex-col items-center justify-center py-6">
                {/* Fake Circular Progress */}
                <div className="relative flex items-center justify-center w-32 h-32 rounded-full border-8 border-purple-100">
                  <div className="absolute inset-0 border-8 border-purple-600 rounded-full border-t-transparent border-r-transparent transform -rotate-45" />
                  <span className="text-2xl font-bold text-gray-900">73%</span>
                </div>
              </div>
              
              <div className="flex flex-col gap-1">
                <h5 className="text-sm font-semibold text-gray-900">You&apos;ve almost reached your limit</h5>
                <p className="text-sm text-gray-500">Used 73% of your available credit limit, indicating a relatively high utilization level.</p>
              </div>
            </div>
            
            <div className="border-t border-gray-200 p-4 flex justify-end">
              <button className="text-sm font-semibold text-purple-600 hover:text-purple-700">View full report</button>
            </div>
          </div>
          
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
            <div className="p-6 flex flex-col gap-6">
              <div className="flex flex-col gap-1">
                <h4 className="text-base font-semibold text-gray-900">Credit Composition</h4>
                <p className="text-sm text-gray-500 leading-relaxed">Breakdown of credit types associated with the individual.</p>
              </div>
              
              <div className="flex flex-1 items-center justify-center gap-6 py-6">
                 {/* Fake Pie Chart */}
                 <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-purple-400 via-purple-500 to-purple-200 flex-shrink-0" />
                 
                 <div className="flex flex-col gap-2">
                   {['Consumer Loans', 'Working Capital', 'Credit Card', 'Installment Loans', 'Other Facilities'].map((label, idx) => (
                     <div key={idx} className="flex items-center gap-2">
                       <div className="w-2 h-2 rounded-full bg-purple-500" />
                       <span className="text-sm text-gray-600">{label}</span>
                     </div>
                   ))}
                 </div>
              </div>
            </div>
            
            <div className="border-t border-gray-200 p-4 flex justify-end">
              <button className="text-sm font-semibold text-purple-600 hover:text-purple-700">View full report</button>
            </div>
          </div>
        </div>

        {/* Bottom Chart */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm flex flex-col gap-6">
          <div className="flex flex-col gap-1">
            <h4 className="text-base font-semibold text-gray-900">New Credit Facilities</h4>
            <p className="text-sm text-gray-500">Newly issued credit facilities over time, indicating borrowing activity and credit demand behavior.</p>
          </div>
          <div className="h-56 w-full bg-gray-50 rounded-lg flex items-center justify-center border border-dashed border-gray-200">
            <span className="text-sm text-gray-400 font-medium">[ Bar Chart Placeholder ]</span>
          </div>
        </div>
      </div>
    </div>
  )
}
