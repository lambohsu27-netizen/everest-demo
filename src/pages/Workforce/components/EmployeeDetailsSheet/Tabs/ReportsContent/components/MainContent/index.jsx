import React from 'react'
import EnquiriesTimeline from './EnquiriesTimeline'
import CreditSummarySection from './CreditSummarySection'
import CreditOverviewSection from './CreditOverviewSection'
import LoanCategorySection from './LoanCategorySection'
import NegativeEventsSection from './NegativeEventsSection'

export default function MainContent() {
  return (
    <div className="flex flex-col gap-10 w-full">
      <EnquiriesTimeline />
      <CreditSummarySection />
      <CreditOverviewSection />
      <LoanCategorySection />
      <NegativeEventsSection />
    </div>
  )
}
