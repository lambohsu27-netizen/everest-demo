import React, { useMemo, useState } from 'react'
import { debounce } from 'lodash'
import { SearchLg, FilterLines, Stars01 } from '@untitled-ui/icons-react'
import {
  MyButton,
  MyDataTable,
  MyColumn,
  MyDoubleCard,
  MyChip,
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

export default function CourtDecisionTab() {
  const { workforceDetail } = useWorkforce()
  const negativeEvents = workforceDetail?.negative_events ?? []
  const [search, setSearch] = useState('')

  const allRows = useMemo(
    () =>
      negativeEvents.map((e, i) => ({
        id: i + 1,
        type: e.description ?? '—',
        badgeColor: e.type === 'court_decision' ? 'error' : 'warning',
        provider: e.provider ?? '—',
        providerType: e.provider_type ?? '',
        remark: e.description ?? '—',
        date: formatDate(e.date),
        expiry: formatDate(e.expiry_date),
      })),
    [negativeEvents]
  )

  const filteredRows = useMemo(() => {
    if (!search) return allRows
    const q = search.toLowerCase()
    return allRows.filter(
      (r) =>
        r.type.toLowerCase().includes(q) ||
        r.provider.toLowerCase().includes(q) ||
        r.remark.toLowerCase().includes(q)
    )
  }, [allRows, search])

  const onSearchChange = useMemo(() => debounce((e) => setSearch(e.target.value ?? ''), 500), [])

  const total = allRows.length
  const indicators = [
    { label: 'Total cases found', value: String(total) },
    {
      label: 'Overall risk',
      badge: total > 3 ? 'High' : total > 0 ? 'Medium' : 'Low',
      badgeColor: total > 3 ? 'error' : total > 0 ? 'warning' : 'success',
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
              {total > 0
                ? `${total} negative event(s) found in records associated with this individual, including write-offs and/or bankruptcy petitions.`
                : 'No negative events or court decisions found for this individual.'}
            </p>
          </MyDoubleCard>

          <RiskAssessmentTable data={indicators} />
        </div>
      </div>

      {/* Main Table Content */}
      <div className="lg:col-span-8 flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <h3 className="text-lg font-semibold text-gray-900">Negative event records</h3>
          <p className="text-sm-regular text-gray-600">
            Negative events and legal disputes linked to the individual across public and credit records.
          </p>
        </div>

        <div className="flex flex-col gap-0 border border-gray-200 rounded-xl bg-white shadow-sm overflow-hidden">
          {/* Table Controls */}
          <div className="flex p-4 items-center justify-between border-b border-gray-200 gap-4">
            <div className="w-full max-w-sm">
              <MyTextField
                placeholder="Search for cases"
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
              header="Provider"
              field="provider"
              body={(row) => (
                <div className="flex flex-col gap-0.5 py-1">
                  <span className="text-sm-semibold text-gray-900">{row.provider}</span>
                  <span className="text-xs text-gray-500 font-normal">{row.providerType}</span>
                </div>
              )}
            />
            <MyColumn
              header="Event Type"
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
              header="Event Date"
              field="date"
              body={(row) => (
                <span className="text-sm-regular text-gray-600 block py-1">{row.date}</span>
              )}
            />
            <MyColumn
              header="Expiry"
              field="expiry"
              body={(row) => (
                <span className="text-sm-regular text-gray-600 block py-1">{row.expiry}</span>
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
