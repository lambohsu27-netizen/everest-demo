import React, { useState } from 'react'
import { SearchMd, FilterLines, Stars01 } from '@untitled-ui/icons-react'
import {
  MyButton,
  MyDataTable,
  MyColumn,
  MyDoubleCard,
} from '@interstellar-component'
import RiskAssessmentTable from '../../EmployeeDetailsSheet/Tabs/ReportsContent/components/Sidebar/RiskAssessmentTable'

export default function FootprintsTab() {
  const [searchTerm, setSearchTerm] = useState('')

  const indicators = [
    { label: 'Total enquiries', value: '5' },
    { label: 'Overall risk', badge: 'Low', badgeColor: 'success' },
  ]

  const metrics = [
    { label: '1 month', value: '334' },
    { label: '3 months', value: '1,201' },
    { label: '6 months', value: '382' },
    { label: '12 months', value: '2,201' },
  ]

  const footprintsData = [
    {
      name: 'CLIK',
      subtext: 'New Application Enquiry',
      purpose: 'Supporting the loan process',
      date: '8 Jan 2024',
    },
    {
      name: 'PT Anugerah TexIndotama',
      subtext: 'New Application Enquiry',
      purpose: 'Supporting the loan process',
      date: '8 Jan 2024',
    },
    {
      name: 'CLIK',
      subtext: 'Monitoring Enquiry',
      purpose: 'Supporting the loan process',
      date: '8 Jan 2024',
    },
    {
      name: 'Bank Central Asia',
      subtext: 'New Application Enquiry',
      purpose: 'Human resource management at financial institution',
      date: '8 Jan 2024',
    },
    {
      name: 'PT Tirtayasa',
      subtext: 'Monitoring Enquiry',
      purpose: 'Human resource management at financial institution',
      date: '8 Jan 2024',
    },
  ]

  return (
    <div className="grid lg:grid-cols-12 gap-8 pt-4">
      {/* Sidebar */}
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
            <p className="text-sm-regular text-gray-600 leading-relaxed">
              Credit records show multiple enquiries from financial institutions and
              organizations, primarily related to loan applications and employment verification
              processes. Most enquiries appear to be associated with standard credit checks and
              monitoring activities.
            </p>
          </MyDoubleCard>

          <RiskAssessmentTable data={indicators} />
        </div>
      </div>

      {/* Main Table Content */}
      <div className="lg:col-span-8 flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <h3 className="text-lg font-semibold text-gray-900">Credit enquiry activity</h3>
          <p className="text-sm-regular text-gray-600">
            Breakdown of active and historical credit facilities associated with this individual.
          </p>
        </div>

        {/* Metrics Group */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {metrics.map((metric) => (
            <div
              key={metric.label}
              className="flex flex-col gap-1 rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
            >
              <span className="text-xs-semibold text-gray-500 uppercase tracking-wider">
                {metric.label}
              </span>
              <span className="text-2xl font-semibold text-gray-900">{metric.value}</span>
            </div>
          ))}
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
                placeholder="Search for footprints"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-3">
              <MyButton color="secondary" variant="outlined" size="md">
                <FilterLines className="h-4 w-4" />
                Filters
              </MyButton>
            </div>
          </div>

          {/* Table */}
          <MyDataTable values={{ data: footprintsData }} className="border-none shadow-none">
            <MyColumn
              header="Institution"
              field="name"
              body={(row) => (
                <div className="flex flex-col gap-0.5 py-1">
                  <span className="text-sm-semibold text-gray-900">{row.name}</span>
                  <span className="text-xs text-gray-500 font-normal">{row.subtext}</span>
                </div>
              )}
            />
            <MyColumn
              header="Purpose"
              field="purpose"
              body={(row) => (
                <span className="text-sm-regular text-gray-600 block py-1">{row.purpose}</span>
              )}
            />
            <MyColumn
              header="Enquiry Date"
              field="date"
              body={(row) => (
                <span className="text-sm-regular text-gray-600 block py-1">{row.date}</span>
              )}
            />
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
  )
}
