import React from 'react'
import { useWorkforce } from '../../../../../../Context'

import LoanCategoryCard from './LoanCategoryCard'

export default function LoanCategorySection() {
  const { handleCurrentSlider, loanCategories } = useWorkforce()

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex flex-col gap-1">
        <h3 className="text-xl font-bold text-gray-900">Loan category</h3>
        <p className="text-sm text-gray-500">
          Breakdown of active and historical credit facilities associated with this individual.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 flex-wrap">
        {loanCategories.map((cat, index) => (
          <LoanCategoryCard
            key={index}
            {...cat}
            onViewDetails={() => handleCurrentSlider({ current: 'loan-category', category: cat.title })}
          />
        ))}
      </div>
    </div>
  )
}
