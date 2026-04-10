import React, { useState } from 'react'
import { SearchMd, FilterLines, Stars01 } from '@untitled-ui/icons-react'
import {
  MyButton,
  MyDataTable,
  MyColumn,
  MyDoubleCard,
} from '@interstellar-component'
import RiskAssessmentTable from '../../EmployeeDetailsSheet/Tabs/ReportsContent/components/Sidebar/RiskAssessmentTable'

export default function EmploymentRecordsTab() {
  const [searchTerm, setSearchTerm] = useState('')

  const indicators = [
    { label: 'Employment consistency', value: '3 / 10' },
    { label: 'Employment records found', value: '14' },
    { label: 'Overall risk', badge: 'Low', badgeColor: 'success' },
  ]

  const employmentData = [
    {
      occupation: 'Product Manager',
      subtext: 'PT Anugerah TexIndotama',
      industry: 'Other / Mixed Industry',
      location: 'Mega Kuningan',
      count: '2',
      lastUpdate: '8 Jan 2024',
    },
    {
      occupation: 'Product Manager',
      subtext: 'PT Anugerah TexIndotama',
      industry: 'Other / Mixed Industry',
      location: 'Mega Kuningan',
      count: '1',
      lastUpdate: '8 Jan 2024',
    },
    {
      occupation: 'Customer Service',
      subtext: 'PT Anugerah TexIndotama',
      industry: 'Other / Mixed Industry',
      location: 'Jakarta',
      count: '1',
      lastUpdate: '8 Jan 2024',
    },
    {
      occupation: 'Customer Service',
      subtext: 'Bank Central Asia',
      industry: 'Not Other business Fields',
      location: 'Jakarta',
      count: '4',
      lastUpdate: '12 Des 2023',
    },
    {
      occupation: 'Marketing',
      subtext: 'PT Tirtayasa',
      industry: 'Other / Mixed Industry',
      location: 'Mega Kuningan',
      count: '2',
      lastUpdate: '10 Des 2023',
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
              The employment analysis identified 10 employment records associated with this
              individual across multiple institutions and reporting periods. The latest employment
              record indicates the individual is currently associated with PT Anugerah Texindo,
              working as a Product Manager in the Other / Mixed Industry sector, based in Mega
              Kuningan.
            </p>
          </MyDoubleCard>

          <RiskAssessmentTable data={indicators} />
        </div>
      </div>

      {/* Main Table Content */}
      <div className="lg:col-span-8 flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <h3 className="text-lg font-semibold text-gray-900">Employment records</h3>
          <p className="text-sm-regular text-gray-600">
            Employment records associated with the individual reporting sources.
          </p>
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
                placeholder="Search for employment"
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
          <MyDataTable values={{ data: employmentData }} className="border-none shadow-none">
            <MyColumn
              header="Occupation"
              field="occupation"
              body={(row) => (
                <div className="flex flex-col gap-0.5 py-1">
                  <span className="text-sm-semibold text-gray-900">{row.occupation}</span>
                  <span className="text-xs text-gray-500 font-normal">{row.subtext}</span>
                </div>
              )}
            />
            <MyColumn
              header="Industry"
              field="industry"
              body={(row) => (
                <span className="text-sm-regular text-gray-600 block py-1">{row.industry}</span>
              )}
            />
            <MyColumn
              header="Workplace"
              field="location"
              body={(row) => (
                <span className="text-sm-regular text-gray-600 block py-1">{row.location}</span>
              )}
            />
            <MyColumn
              header="Count"
              field="count"
              body={(row) => (
                <span className="text-sm-regular text-gray-600 block py-1">{row.count}</span>
              )}
            />
            <MyColumn
              header="Last Update Date"
              field="lastUpdate"
              body={(row) => (
                <span className="text-sm-regular text-gray-600 block py-1">{row.lastUpdate}</span>
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
