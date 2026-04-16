import React, { useMemo, useState } from 'react'
import { debounce } from 'lodash'
import { SearchLg, FilterLines, Stars01 } from '@untitled-ui/icons-react'
import {
  MyButton,
  MyDataTable,
  MyColumn,
  MyDoubleCard,
  MyTextField,
} from '@interstellar-component'
import { useWorkforce } from '../../../Context'
import RiskAssessmentTable from '../../EmployeeDetailsSheet/Tabs/ReportsContent/components/Sidebar/RiskAssessmentTable'

function formatDate(value) {
  if (!value) return '—'
  const d = new Date(String(value).replace(/\//g, '-'))
  if (Number.isNaN(d.getTime())) return String(value)
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

export default function FootprintsTab() {
  const { workforceDetail } = useWorkforce()
  const footprint = workforceDetail?.credit_report?.footprint ?? {}
  const enquiryCounts = footprint.enquiry_counts ?? {}
  const [search, setSearch] = useState('')

  const allRows = useMemo(
    () =>
      (footprint.last_enquiries ?? []).map((e, i) => ({
        id: i,
        name: e.institute ?? '—',
        subtext: e.type ?? '',
        purpose: e.purpose ?? '—',
        date: formatDate(e.date),
      })),
    [footprint.last_enquiries]
  )

  const filteredRows = useMemo(() => {
    if (!search) return allRows
    const q = search.toLowerCase()
    return allRows.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.subtext.toLowerCase().includes(q) ||
        r.purpose.toLowerCase().includes(q)
    )
  }, [allRows, search])

  const onSearchChange = useMemo(() => debounce((e) => setSearch(e.target.value ?? ''), 500), [])

  const totalEnquiries = enquiryCounts['12_months'] ?? allRows.length

  const indicators = [
    { label: 'Total enquiries (12m)', value: String(totalEnquiries) },
    {
      label: 'Overall risk',
      badge: totalEnquiries > 20 ? 'High' : totalEnquiries > 10 ? 'Medium' : 'Low',
      badgeColor: totalEnquiries > 20 ? 'error' : totalEnquiries > 10 ? 'warning' : 'success',
    },
  ]

  const metrics = [
    { label: '1 month', value: String(enquiryCounts['1_month'] ?? 0) },
    { label: '3 months', value: String(enquiryCounts['3_months'] ?? 0) },
    { label: '6 months', value: String(enquiryCounts['6_months'] ?? 0) },
    { label: '12 months', value: String(enquiryCounts['12_months'] ?? 0) },
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
              {totalEnquiries > 0
                ? `${totalEnquiries} enquiry/ies found across financial institutions, primarily related to loan applications and employment verification processes.`
                : 'No credit enquiry records found for this individual.'}
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
            <div className="w-full max-w-sm">
              <MyTextField
                placeholder="Search for footprints"
                startAdornment={
                  <SearchLg className="size-5 text-gray-light/600" stroke="currentColor" />
                }
                focusColor="#42307D"
                onChangeForm={onSearchChange}
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
          <MyDataTable values={{ data: filteredRows }}>
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

          {/* Footer */}
          <div className="flex items-center px-6 py-4 border-t border-gray-200">
            <span className="text-sm text-gray-600 font-medium">
              {filteredRows.length} record{filteredRows.length === 1 ? '' : 's'}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
