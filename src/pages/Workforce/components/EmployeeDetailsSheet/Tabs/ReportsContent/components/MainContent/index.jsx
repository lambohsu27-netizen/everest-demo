import React from 'react'
import CreditSummarySection from './CreditSummarySection'
import CreditOverviewSection from './CreditOverviewSection'
import LoanCategorySection from './LoanCategorySection'
import NegativeEventsSection from './NegativeEventsSection'

export default function MainContent() {
  return (
    <div className="flex flex-col gap-10 w-full">
      <CreditSummarySection />
      <hr className="border-gray-200" />
      <CreditOverviewSection />
      <hr className="border-gray-200" />
      <LoanCategorySection />
      <hr className="border-gray-200" />
      <NegativeEventsSection />
    </div>
  )
}
