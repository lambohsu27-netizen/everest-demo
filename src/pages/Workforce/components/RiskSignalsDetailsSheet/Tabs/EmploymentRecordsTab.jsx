import React, { useMemo, useState } from 'react'
import { SearchMd, FilterLines, Stars01 } from '@untitled-ui/icons-react'
import {
  MyButton,
  MyDataTable,
  MyColumn,
  MyDoubleCard,
} from '@interstellar-component'
import { useWorkforce } from '../../../Context'
import RiskAssessmentTable from '../../EmployeeDetailsSheet/Tabs/ReportsContent/components/Sidebar/RiskAssessmentTable'

function formatDate(value) {
  if (!value) return '—'
  const d = new Date(String(value))
  if (Number.isNaN(d.getTime())) return String(value)
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

const FALLBACK_ROWS = [
  {
    occupation: 'Specialist',
    subtext: 'Current Employer',
    industry: 'Other / Mixed Industry',
    location: 'Jakarta',
    count: '1',
    lastUpdate: '2026-03-12',
  },
]

export default function EmploymentRecordsTab() {
  const { workforceDetail } = useWorkforce()
  const employmentSignal = workforceDetail?.risk_background_signals?.employment_records
  const [searchTerm, setSearchTerm] = useState('')

  const allRows = useMemo(() => {
    const items = Array.isArray(employmentSignal?.items) && employmentSignal.items.length
      ? employmentSignal.items
      : FALLBACK_ROWS
    return items.map((r) => ({
      occupation: r.occupation,
      subtext: r.subtext,
      industry: r.industry,
      location: r.location,
      count: r.count,
      lastUpdate: formatDate(r.lastUpdate),
    }))
  }, [employmentSignal])

  const rows = useMemo(() => {
    if (!searchTerm) return allRows
    const q = searchTerm.toLowerCase()
    return allRows.filter(
      (r) =>
        (r.occupation ?? '').toLowerCase().includes(q)
        || (r.subtext ?? '').toLowerCase().includes(q)
        || (r.industry ?? '').toLowerCase().includes(q)
        || (r.location ?? '').toLowerCase().includes(q)
    )
  }, [allRows, searchTerm])

  const total = allRows.length

  const indicators = [
    { label: 'Employment records found', value: String(total) },
    {
      label: 'Employment consistency',
      badge: total <= 2 ? 'High' : total <= 4 ? 'Medium' : 'Low',
      badgeColor: total <= 2 ? 'success' : total <= 4 ? 'warning' : 'error',
    },
    {
      label: 'Overall risk',
      badge: total >= 5 ? 'High' : total >= 4 ? 'Medium' : 'Low',
      badgeColor: total >= 5 ? 'error' : total >= 4 ? 'warning' : 'success',
    },
  ]

  const latest = allRows[0]
  const takeaway =
    employmentSignal?.rationale
    || (total > 0
      ? `Employment analysis identified ${total} record(s) associated with this individual.${
          latest ? ` Most recent role: ${latest.occupation} at ${latest.subtext}.` : ''
        }`
      : 'No employment records found for this individual.')

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
          <h3 className="text-lg font-semibold text-gray-900">Employment records</h3>
          <p className="text-sm-regular text-gray-600">
            Employment records associated with the individual reporting sources.
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

          <MyDataTable values={{ data: rows }} className="border-none shadow-none">
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
            <MyColumn header="Industry" field="industry" body={(row) => (
              <span className="text-sm-regular text-gray-600 block py-1">{row.industry}</span>
            )} />
            <MyColumn header="Workplace" field="location" body={(row) => (
              <span className="text-sm-regular text-gray-600 block py-1">{row.location}</span>
            )} />
            <MyColumn header="Count" field="count" body={(row) => (
              <span className="text-sm-regular text-gray-600 block py-1">{row.count}</span>
            )} />
            <MyColumn header="Last Update Date" field="lastUpdate" body={(row) => (
              <span className="text-sm-regular text-gray-600 block py-1">{row.lastUpdate}</span>
            )} />
          </MyDataTable>

          <div className="flex items-center justify-between p-4 border-t border-gray-200">
            <span className="text-sm-regular text-gray-600">
              {rows.length} record{rows.length === 1 ? '' : 's'}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
