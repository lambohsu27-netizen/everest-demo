import React from 'react'
import { MyChip } from '@interstellar-component'

function LoanCategoryCard({ kolBadge, title, accountCount, amount, iconColor }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <MyChip
          label={kolBadge}
          color={kolBadge === 'KOL 5' ? 'error' : kolBadge === 'KOL 4' ? 'warning' : 'primary'}
          variant="modern"
          size="sm"
          rounded="lg"
        />
        <div className={`w-8 h-8 rounded-full opacity-20 ${iconColor || 'bg-gray-300'}`} />
      </div>
      
      <div className="flex flex-col gap-1 mb-2">
        <h4 className="text-base font-semibold text-gray-900 line-clamp-1" title={title}>{title}</h4>
        <span className="text-sm text-gray-500">{accountCount}</span>
      </div>
      
      <div className="flex flex-col gap-4">
        <div className="text-lg font-bold text-gray-900">{amount}</div>
        <button className="text-sm font-semibold text-purple-600 hover:text-purple-700 w-full text-right transition-colors">
          View details
        </button>
      </div>
    </div>
  )
}

export default function LoanCategorySection() {
  const categories = [
    { kolBadge: 'KOL 5', title: 'Credit Card', accountCount: '3 account', amount: 'Rp 52,000,000', iconColor: 'bg-red-500' },
    { kolBadge: 'KOL 4', title: 'Paylater', accountCount: '2 account', amount: 'Rp 6,400,000', iconColor: 'bg-yellow-500' },
    { kolBadge: 'KOL 5', title: 'KKB (Kredit Kendaraan Bermotor)', accountCount: '1 account', amount: 'Rp 172,000,000', iconColor: 'bg-orange-500' },
    { kolBadge: 'KOL 5', title: 'KPR (Kredit Pemilikan Rumah)', accountCount: 'No active loan', amount: 'Rp 0', iconColor: 'bg-blue-500' },
    { kolBadge: 'KOL 5', title: 'KTA (Kredit Tanpa Agunan)', accountCount: '2 account', amount: 'Rp 154,100,000', iconColor: 'bg-green-500' },
    { kolBadge: 'KOL 5', title: 'Other', accountCount: 'No active loan', amount: 'Rp 0', iconColor: 'bg-gray-500' },
  ]

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex flex-col gap-1 pb-4 border-b border-gray-200">
        <h3 className="text-xl font-bold text-gray-900">Loan category</h3>
        <p className="text-sm text-gray-500">Breakdown of active and historical credit facilities associated with this individual.</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat, index) => (
          <LoanCategoryCard key={index} {...cat} />
        ))}
      </div>
    </div>
  )
}
