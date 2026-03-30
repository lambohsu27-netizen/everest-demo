import React, { useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import {
  SearchMd,
  FilterLines,
  Phone,
  MarkerPin01,
  PenTool01,
  Briefcase02,
  FileSearch02,
  Stars01,
} from '@untitled-ui/icons-react'
import {
  MyButton,
  MyDataTable,
  MyColumn,
  MyDoubleCard,
  MyChip,
} from '@interstellar-component'
import StackedPageSheet from '@src/components/StackedPageSheet'
import RiskAssessmentTable from '../EmployeeDetailsSheet/Tabs/ReportsContent/components/Sidebar/RiskAssessmentTable'

export default function RiskSignalsDetailsSheet() {
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const initialTab = searchParams.get('tab') || 'Phone numbers'
  const [activeTab, setActiveTab] = useState(initialTab)
  const [contentTab, setContentTab] = useState('Listed number')
  const [searchTerm, setSearchTerm] = useState('')

  const tabs = [
    { name: 'Phone numbers', icon: Phone },
    { name: 'Address records', icon: MarkerPin01 },
    { name: 'Employment records', icon: Briefcase02 },
    { name: 'Court decision', icon: PenTool01 },
    { name: 'Footprints', icon: FileSearch02 },
  ]

  const tabData = {
    'Phone numbers': {
      title: 'Associated phone number',
      description:
        'List of phone numbers linked to the individual across credit bureau records and external contact sources.',
      takeaway:
        'Contact intelligence identified 8 phone numbers linked to the individual, with most labels matching the individual’s name or professional identity, indicating consistent recognition by others.',
      indicators: [
        { label: 'Risk labels detected', value: '3 / 10' },
        { label: 'Label consistency score', value: '2 / 10' },
        { label: 'Longest active number', value: '5 / 10' },
        { label: 'Overall risk', badge: 'High', badgeColor: 'error' },
      ],
      tableColumns: [
        { header: 'Phone Number', field: 'number', isPrimary: true },
        { header: 'Aging', field: 'aging' },
        { header: 'Last Update Date', field: 'lastUpdate' },
      ],
      tableData: [
        {
          number: '+62 818 1111 5121',
          aging: '4 months',
          lastUpdate: '8 Jan 2024',
          status: 'Current',
        },
        { number: '+62 877 9089 6541', aging: '1 month', lastUpdate: '8 Jan 2024' },
        { number: '+62 812 9890 908', aging: '1 month', lastUpdate: '8 Jan 2024' },
        { number: '+62 812 1965 4541', aging: '1 month', lastUpdate: '12 Des 2023' },
        { number: '+62 877 9089 6541', aging: '1 month', lastUpdate: '10 Des 2023' },
        { number: '+62 877 9089 6531', aging: '1 month', lastUpdate: '7 Aug 2023' },
      ],
      searchPlaceholder: 'Search for number',
      showSecondaryTabs: true,
    },
    'Address records': {
      title: 'Registered address records',
      description: 'Addresses linked to the individual across financial and public records.',
      takeaway:
        'Address intelligence identified multiple residential records across credit bureau and public sources, including Palm Regency, Hibiskus Residence, and Jl. H. Junaidi Naim, indicating frequent address changes or inconsistent reporting.',
      indicators: [
        { label: 'Address consistency', value: '3 / 10' },
        { label: 'Address records found', value: '14' },
        { label: 'Overall risk', badge: 'High', badgeColor: 'error' },
      ],
      tableColumns: [
        { header: 'Street Address', field: 'address', isPrimary: true },
        { header: 'Aging', field: 'aging' },
        { header: 'Count', field: 'count' },
        { header: 'Last Update Date', field: 'lastUpdate' },
      ],
      tableData: [
        { address: 'Jl Badila II No 20', aging: '4 months', count: '3', lastUpdate: '8 Jan 2024' },
        {
          address: 'Jl Palm regency aj 07',
          aging: '1 month',
          count: '26',
          lastUpdate: '8 Jan 2024',
        },
        {
          address: 'Jl H. Junaidi Naim nomor 3',
          aging: '1 month',
          count: '65',
          lastUpdate: '8 Jan 2024',
        },
        {
          address: 'Jl H. Junaidi naim nomor III',
          aging: '1 month',
          count: '201',
          lastUpdate: '12 Des 2023',
        },
        {
          address: 'Jl Palm regency AJ 07',
          aging: '1 month',
          count: '234',
          lastUpdate: '10 Des 2023',
        },
        {
          address: 'Jl hibiskus blok b58/9',
          aging: '1 month',
          count: '102',
          lastUpdate: '7 Aug 2023',
        },
        {
          address: 'Jl Mawar setia arah 7, sawo residence',
          aging: '1 month',
          count: '102',
          lastUpdate: '7 Aug 2023',
        },
        {
          address: 'Jl Hibiskus Blok b58/9',
          aging: '1 month',
          count: '102',
          lastUpdate: '7 Aug 2023',
        },
      ],
      searchPlaceholder: 'Search for address',
      showSecondaryTabs: false,
    },
  }

  const currentData = tabData[activeTab] || tabData['Phone numbers']

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

        {/* Main Content Area */}
        <div className="grid lg:grid-cols-12 gap-8 pt-4">
          {/* Sidebar */}
          <div className="lg:col-span-4 flex flex-col gap-8 h-full lg:border-r lg:border-gray-200 lg:pr-8">
            <div className="flex flex-col gap-1">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                Overview
                <Stars01 className="h-5 w-5 text-brand/600" />
              </h3>
              <p className="text-sm-regular text-gray-600">
                Key insights from credit and background data.
              </p>
            </div>

            <div className="flex flex-col gap-5">
              <MyDoubleCard heading="Key takeaway">
                <p className="text-sm-regular text-gray-600 leading-relaxed">
                  {currentData.takeaway}
                </p>
              </MyDoubleCard>

              <RiskAssessmentTable data={currentData.indicators} />
            </div>
          </div>

          {/* Main Table Content */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            <div className="flex flex-col gap-1">
              <h3 className="text-lg font-semibold text-gray-900">{currentData.title}</h3>
              <p className="text-sm-regular text-gray-600">{currentData.description}</p>
            </div>

            <div className="flex flex-col gap-0 border border-gray-200 rounded-xl bg-white shadow-sm overflow-hidden">
              {/* Table Controls */}
              <div className="flex p-4 items-center justify-between border-b border-gray-200 gap-4">
                <div className="relative flex-1 max-w-sm">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <SearchMd className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="block w-full rounded-lg border border-gray-300 bg-white p-2 pl-9 pr-3 text-sm text-gray-900 placeholder-gray-400 focus:border-brand/500 focus:outline-none focus:ring-1 focus:ring-brand/500"
                    placeholder={currentData.searchPlaceholder}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <div className="flex items-center gap-3">
                  <MyButton color="secondary" variant="outlined" size="md">
                    <FilterLines className="h-4 w-4" />
                    Filters
                  </MyButton>

                  {currentData.showSecondaryTabs && (
                    <div className="inline-flex rounded-lg border border-gray-200 bg-gray-50 p-0.5">
                      {['Listed number', 'Discovered contact'].map((tab) => (
                        <button
                          key={tab}
                          onClick={() => setContentTab(tab)}
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
                  )}
                </div>
              </div>

              {/* Table */}
              <MyDataTable
                values={{ data: currentData.tableData }}
                className="border-none shadow-none"
              >
                {currentData.tableColumns.map((col) => (
                  <MyColumn
                    key={col.field}
                    header={col.header}
                    field={col.field}
                    body={(row) => (
                      <div className="flex items-center gap-3">
                        <span
                          className={`text-sm text-gray-900 ${col.isPrimary ? 'font-semibold' : 'font-normal'}`}
                        >
                          {row[col.field]}
                        </span>
                        {col.isPrimary && row.status === 'Current' && (
                          <MyChip
                            label="Current"
                            color="success"
                            variant="filled"
                            size="sm"
                            rounded="full"
                          />
                        )}
                      </div>
                    )}
                  />
                ))}
              </MyDataTable>

              {/* Footer / Pagination Placeholder */}
              <div className="flex items-center justify-between p-4 border-t border-gray-200">
                <span className="text-sm-regular text-gray-600">Page 1 of 4</span>
                <div className="flex items-center gap-2">
                  <MyButton color="secondary" variant="outlined" size="sm">
                    Previous
                  </MyButton>
                  <MyButton color="secondary" variant="outlined" size="sm">
                    Next
                  </MyButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </StackedPageSheet>
  )
}
