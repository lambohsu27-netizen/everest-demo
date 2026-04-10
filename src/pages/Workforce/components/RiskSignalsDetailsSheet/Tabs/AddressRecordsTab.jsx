import React, { useState } from 'react'
import { SearchMd, FilterLines, Stars01 } from '@untitled-ui/icons-react'
import {
  MyButton,
  MyDataTable,
  MyColumn,
  MyDoubleCard,
} from '@interstellar-component'
import RiskAssessmentTable from '../../EmployeeDetailsSheet/Tabs/ReportsContent/components/Sidebar/RiskAssessmentTable'

export default function AddressRecordsTab() {
  const [searchTerm, setSearchTerm] = useState('')

  const indicators = [
    { label: 'Address consistency', value: '3 / 10' },
    { label: 'Address records found', value: '14' },
    { label: 'Overall risk', badge: 'High', badgeColor: 'error' },
  ]

  const addressData = [
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
              Address intelligence identified multiple residential records across credit bureau and
              public sources, including Palm Regency, Hibiskus Residence, and Jl. H. Junaidi Naim,
              indicating frequent address changes or inconsistent reporting.
            </p>
          </MyDoubleCard>

          <RiskAssessmentTable data={indicators} />
        </div>
      </div>

      {/* Main Table Content */}
      <div className="lg:col-span-8 flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <h3 className="text-lg font-semibold text-gray-900">Registered address records</h3>
          <p className="text-sm-regular text-gray-600">
            Addresses linked to the individual across financial and public records.
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
                placeholder="Search for address"
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
          <MyDataTable values={{ data: addressData }} className="border-none shadow-none">
            <MyColumn
              header="Street Address"
              field="address"
              body={(row) => (
                <span className="text-sm-semibold text-gray-900 block py-1">{row.address}</span>
              )}
            />
            <MyColumn
              header="Aging"
              field="aging"
              body={(row) => (
                <span className="text-sm-regular text-gray-600 block py-1">{row.aging}</span>
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
