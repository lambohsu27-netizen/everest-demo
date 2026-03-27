import React from 'react'
import CreditUtilizationCard from './CreditUtilizationCard'
import CreditCompositionCard from './CreditCompositionCard'
import NewCreditFacilitiesCard from './NewCreditFacilitiesCard'

export default function CreditOverviewSection() {
  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex flex-col gap-1 pb-4 border-b border-gray-200">
        <h3 className="text-xl font-bold text-gray-900">Credit Overview</h3>
        <p className="text-sm text-gray-500">
          Summary of the individual&apos;s credit usage, composition, and recent borrowing activity.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        {/* Top 2 Cards */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <CreditUtilizationCard />
          <CreditCompositionCard />
        </div>

        {/* Bottom Chart */}
        <NewCreditFacilitiesCard />
      </div>
    </div>
  )
}
