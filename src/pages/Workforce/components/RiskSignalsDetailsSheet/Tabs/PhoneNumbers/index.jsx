import React, { useMemo, useState } from 'react'
import { SearchMd, FilterLines, Stars01 } from '@untitled-ui/icons-react'
import { MyButton, MyDoubleCard } from '@interstellar-component'
import { useWorkforce } from '../../../../Context'
import RiskAssessmentTable from '../../../EmployeeDetailsSheet/Tabs/ReportsContent/components/Sidebar/RiskAssessmentTable'
import ListedNumberTable from './ListedNumberTable'
import DiscoveredContactTable from './DiscoveredContactTable'

function formatDate(value) {
  if (!value) return '—'
  const d = new Date(String(value))
  if (Number.isNaN(d.getTime())) return String(value)
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

const FALLBACK_LISTED = [
  { number: '+62 818 1111 5121', aging: '4 months', lastUpdate: '8 Jan 2024', status: 'Current' },
  { number: '+62 877 9089 6541', aging: '1 month', lastUpdate: '8 Jan 2024' },
]

const FALLBACK_DISCOVERED = [
  { label: 'Personal Mobile', count: 4, numbers: ['+62 818 1111 5121'] },
]

export default function PhoneNumbersTab() {
  const { workforceDetail } = useWorkforce()
  const phoneSignal = workforceDetail?.risk_background_signals?.phone_numbers

  const listedRaw = Array.isArray(phoneSignal?.items) && phoneSignal.items.length
    ? phoneSignal.items
    : FALLBACK_LISTED

  const phoneData = useMemo(
    () =>
      listedRaw.map((p) => ({
        number: p.number,
        aging: p.aging,
        lastUpdate: formatDate(p.lastUpdate),
        status: p.status ?? null,
      })),
    [listedRaw]
  )

  const discoveredContactData = Array.isArray(phoneSignal?.discovered_contacts) && phoneSignal.discovered_contacts.length
    ? phoneSignal.discovered_contacts
    : FALLBACK_DISCOVERED

  const total = phoneData.length

  const indicators = useMemo(
    () => [
      { label: 'Phone numbers found', value: String(total) },
      {
        label: 'Active number',
        value: String(phoneData.filter((p) => p.status === 'Current').length),
      },
      {
        label: 'Overall risk',
        badge: total >= 8 ? 'High' : total >= 5 ? 'Medium' : 'Low',
        badgeColor: total >= 8 ? 'error' : total >= 5 ? 'warning' : 'success',
      },
    ],
    [total, phoneData]
  )

  const takeaway =
    phoneSignal?.rationale
    || (total > 0
      ? `Contact intelligence identified ${total} phone number(s) linked to the individual.`
      : 'No phone records found for this individual.')

  const [contentTab, setContentTab] = useState('Listed number')
  const [searchTerm, setSearchTerm] = useState('')
  const isListed = contentTab === 'Listed number'

  return (
    <div className="grid lg:grid-cols-12 gap-8 pt-4">
      <div className="lg:col-span-4 flex flex-col gap-8 h-full lg:border-r lg:border-gray-200 lg:pr-8">
        <div className="flex flex-col gap-1">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            Overview
            <Stars01 className="h-5 w-5 text-brand/900" />
          </h3>
          <p className="text-sm-regular text-gray-600">
            Key insights from credit and background data.
          </p>
        </div>

        <div className="flex flex-col gap-5">
          <MyDoubleCard heading="Key takeaway">
            <p className="text-sm-regular text-gray-600 leading-relaxed">{takeaway}</p>
          </MyDoubleCard>
          <RiskAssessmentTable data={indicators} />
        </div>
      </div>

      <div className="lg:col-span-8 flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <h3 className="text-lg font-semibold text-gray-900">
            {isListed ? 'Associated phone number' : 'Contact labels'}
          </h3>
          <p className="text-sm-regular text-gray-600">
            {isListed
              ? 'List of phone numbers linked to the individual across credit bureau records and external contact sources.'
              : 'Labels used by external contacts to save the individual’s phone numbers.'}
          </p>
        </div>

        <div className="flex flex-col gap-0 border border-gray-200 rounded-xl bg-white shadow-sm overflow-hidden">
          <div className="flex p-4 items-center justify-between border-b border-gray-200 gap-4">
            <div className="relative flex-1 max-w-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <SearchMd className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full rounded-lg border border-gray-300 bg-white p-2 pl-9 pr-3 text-sm text-gray-900 placeholder-gray-400 focus:border-brand/500 focus:outline-none focus:ring-1 focus:ring-brand/500"
                placeholder={isListed ? 'Search for number' : 'Search'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-3">
              <MyButton color="secondary" variant="outlined" size="md">
                <FilterLines className="h-4 w-4" />
                Filters
              </MyButton>
              <div className="inline-flex rounded-lg border border-gray-200 bg-gray-50 p-0.5">
                {['Listed number', 'Discovered contact'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => {
                      setContentTab(tab)
                      setSearchTerm('')
                    }}
                    className={`rounded-md px-3 py-1.5 text-sm font-semibold transition-all ${
                      contentTab === tab
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {isListed ? (
            <ListedNumberTable data={phoneData} searchTerm={searchTerm} />
          ) : (
            <DiscoveredContactTable data={discoveredContactData} searchTerm={searchTerm} />
          )}

          <div className="flex items-center justify-between p-4 border-t border-gray-200">
            <span className="text-sm-regular text-gray-600">
              {total} record{total === 1 ? '' : 's'}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
