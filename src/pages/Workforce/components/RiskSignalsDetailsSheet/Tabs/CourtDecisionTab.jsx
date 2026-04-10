import React, { useState } from 'react'
import { SearchMd, FilterLines, Stars01 } from '@untitled-ui/icons-react'
import {
  MyButton,
  MyDataTable,
  MyColumn,
  MyDoubleCard,
  MyChip,
} from '@interstellar-component'
import RiskAssessmentTable from '../../EmployeeDetailsSheet/Tabs/ReportsContent/components/Sidebar/RiskAssessmentTable'

export default function CourtDecisionTab() {
  const [searchTerm, setSearchTerm] = useState('')

  const indicators = [
    { label: 'Total case found', value: '2' },
    { label: 'Overall risk', badge: 'Low', badgeColor: 'success' },
  ]

  const courtData = [
    {
      id: '67389263',
      type: 'Customer dispute',
      badgeColor: 'warning',
      remark: 'Small debt collection claim related to unpaid personal loan.',
      date: '8 Jan 2024',
    },
    {
      id: '57863479',
      type: 'Contract violation',
      badgeColor: 'warning',
      remark: 'Breach of contract dispute involving overdue payment.',
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
              2 court decisions were found in public legal records associated with this individual.
              The cases indicate minor financial disputes with no severe criminal or high-risk legal
              involvement
            </p>
          </MyDoubleCard>

          <RiskAssessmentTable data={indicators} />
        </div>
      </div>

      {/* Main Table Content */}
      <div className="lg:col-span-8 flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <h3 className="text-lg font-semibold text-gray-900">Legal case records</h3>
          <p className="text-sm-regular text-gray-600">
            Court decisions and legal disputes linked to the individual across public legal records.
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
                placeholder="Search for cases"
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
          <MyDataTable values={{ data: courtData }} className="border-none shadow-none">
            <MyColumn
              header="Case ID"
              field="id"
              body={(row) => <span className="text-sm-semibold text-gray-900 block py-1">{row.id}</span>}
            />
            <MyColumn
              header="Case Type"
              field="type"
              body={(row) => (
                <div className="py-1">
                  <MyChip
                    label={row.type}
                    color={row.badgeColor || 'gray'}
                    variant="outlined"
                    size="sm"
                  />
                </div>
              )}
            />
            <MyColumn
              header="Remark"
              field="remark"
              body={(row) => (
                <span className="text-sm-regular text-gray-600 block py-1">{row.remark}</span>
              )}
            />
            <MyColumn
              header="Filling Date"
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
