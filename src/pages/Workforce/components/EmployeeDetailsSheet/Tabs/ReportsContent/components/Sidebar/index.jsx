import React from 'react'
import OverviewSection from './OverviewSection'
import RiskSignalsSection from './RiskSignalsSection'

export default function Sidebar() {
  return (
    <div className="flex flex-col gap-8 w-full">
      <OverviewSection />
      <RiskSignalsSection />
    </div>
  )
}
