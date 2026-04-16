import React, { useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import {
  Phone,
  MarkerPin01,
  PenTool01,
  Briefcase02,
  FileSearch02,
} from '@untitled-ui/icons-react'
import StackedPageSheet from '@src/components/StackedPageSheet'

import PhoneNumbersTab from './Tabs/PhoneNumbers'
import AddressRecordsTab from './Tabs/AddressRecordsTab'
import EmploymentRecordsTab from './Tabs/EmploymentRecordsTab'
import CourtDecisionTab from './Tabs/CourtDecisionTab'
import FootprintsTab from './Tabs/FootprintsTab'

export default function RiskSignalsDetailsSheet() {
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const initialTab = searchParams.get('tab') || 'Phone Numbers'
  const [activeTab, setActiveTab] = useState(initialTab)

  const tabs = [
    { name: 'Phone Numbers', icon: Phone },
    { name: 'Address Records', icon: MarkerPin01 },
    { name: 'Employment Records', icon: Briefcase02 },
    { name: 'Court Decision', icon: PenTool01 },
    { name: 'Footprints', icon: FileSearch02 },
  ]

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Phone Numbers':
        return <PhoneNumbersTab />
      case 'Address Records':
        return <AddressRecordsTab />
      case 'Employment Records':
        return <EmploymentRecordsTab />
      case 'Court Decision':
        return <CourtDecisionTab />
      case 'Footprints':
        return <FootprintsTab />
      default:
        return <PhoneNumbersTab />
    }
  }

  return (
    <StackedPageSheet backUrl={`/workforce/employee/${id}`} closeUrl="/workforce">
      <div className="flex flex-col gap-8 pb-10">
        {/* Page Header */}
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-semibold text-gray-900">Risk & background signals</h1>
            <p className="text-md-regular text-gray-600">
              Manage your team members and their account permissions here.
            </p>
          </div>

          {/* Category Tabs */}
          <div className="inline-flex rounded-lg border border-gray-200 bg-white p-0.5 shadow-sm w-fit">
            {tabs.map((tab) => (
              <button
                key={tab.name}
                onClick={() => setActiveTab(tab.name)}
                className={`rounded-md px-4 py-2.5 text-sm font-semibold transition-all ${
                  activeTab === tab.name
                    ? 'bg-gray-50 text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                {tab.name}
              </button>
            ))}
          </div>
        </div>

        {/* Modular Tab Content */}
        {renderTabContent()}
      </div>
    </StackedPageSheet>
  )
}
