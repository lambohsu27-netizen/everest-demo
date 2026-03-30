import React from 'react'
import { useWorkforce } from '../../../../../../Context'

import LoanCategoryCard from './LoanCategoryCard'

export default function LoanCategorySection() {
  const { handleCurrentSlider } = useWorkforce()

  const categories = [
    {
      kolBadge: 'KOL 5',
      title: 'Credit Card',
      accountCount: '3 account',
      amount: 'Rp 52,000,000',
      color: 'Error',
      icon: 'CreditCard02',
    },
    {
      kolBadge: 'KOL 4',
      title: 'Paylater',
      accountCount: '2 account',
      amount: 'Rp 6,400,000',
      color: 'Warning',
      icon: 'ShoppingBag03',
    },
    {
      kolBadge: 'KOL 5',
      title: 'KKB (Kredit Kendaraan Bermotor)',
      accountCount: '1 account',
      amount: 'Rp 172,000,000',
      color: 'Orange',
      icon: 'Car01',
    },
    {
      kolBadge: 'KOL 5',
      title: 'KPR (Kredit Pemilikan Rumah)',
      accountCount: 'No active loan',
      amount: 'Rp 0',
      color: 'Blue',
      icon: 'Home03',
    },
    {
      kolBadge: 'KOL 5',
      title: 'KTA (Kredit Tanpa Agunan)',
      accountCount: '2 account',
      amount: 'Rp 154,100,000',
      color: 'Success',
      icon: 'CoinsStacked03',
    },
    {
      kolBadge: 'KOL 5',
      title: 'Other',
      accountCount: 'No active loan',
      amount: 'Rp 0',
      color: 'Gray',
      icon: 'DotsVertical',
    },
  ]

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex flex-col gap-1">
        <h3 className="text-xl font-bold text-gray-900">Loan category</h3>
        <p className="text-sm text-gray-500">
          Breakdown of active and historical credit facilities associated with this individual.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 flex-wrap">
        {categories.map((cat, index) => (
          <LoanCategoryCard
            key={index}
            {...cat}
            onViewDetails={
              cat.title === 'Credit Card'
                ? () => handleCurrentSlider({ current: 'credit-card-loan' })
                : undefined
            }
          />
        ))}
      </div>
    </div>
  )
}
