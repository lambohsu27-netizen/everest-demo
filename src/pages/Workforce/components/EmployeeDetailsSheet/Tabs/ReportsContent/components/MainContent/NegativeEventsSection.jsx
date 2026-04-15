import React, { useMemo, useState } from 'react'
import { debounce } from 'lodash'
import { SearchLg, FilterLines } from '@untitled-ui/icons-react'
import { MyButton, MyTextField } from '@interstellar-component'
import { useWorkforce } from '../../../../../../Context'

const DASH = '—'

function formatDate(value) {
  if (!value) return DASH
  const d = new Date(String(value).replace(/\//g, '-'))
  if (Number.isNaN(d.getTime())) return String(value)
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

export default function NegativeEventsSection() {
  const { workforceDetail } = useWorkforce()
  const [search, setSearch] = useState('')

  const allEvents = useMemo(
    () =>
      (workforceDetail?.credit_report?.negative_events ?? []).map((e) => ({
        provider: e.provider ?? DASH,
        type: e.provider_type ?? '',
        event: e.event ?? e.event_details ?? DASH,
        date: formatDate(e.event_date),
        expiry: formatDate(e.event_expiry_date),
        lastReference: formatDate(e.event_date),
      })),
    [workforceDetail?.credit_report?.negative_events]
  )

  const events = useMemo(() => {
    if (!search) return allEvents
    const q = search.toLowerCase()
    return allEvents.filter(
      (e) =>
        e.provider.toLowerCase().includes(q) ||
        e.event.toLowerCase().includes(q) ||
        (e.type ?? '').toLowerCase().includes(q)
    )
  }, [allEvents, search])

  const onSearchChange = useMemo(
    () => debounce((e) => setSearch(e.target.value ?? ''), 500),
    []
  )

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex flex-col gap-1">
        <h3 className="text-xl font-bold text-gray-900">Negative events</h3>
        <p className="text-sm text-gray-500">
          Breakdown of active and historical credit facilities associated with this individual.
        </p>
      </div>

      <div className="flex flex-col border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
        {/* Toolbar */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
          <div className="w-full max-w-sm">
            <MyTextField
              placeholder="Search for event"
              startAdornment={
                <SearchLg className="size-5 text-gray-light/600" stroke="currentColor" />
              }
              focusColor="#42307D"
              onChangeForm={onSearchChange}
            />
          </div>
          <MyButton color="secondary" variant="outlined" size="md" customClassname="gap-2">
            <FilterLines className="h-5 w-5 text-gray-700" />
            <span className="text-gray-700">Filters</span>
          </MyButton>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-[#f9fafb] text-gray-500 font-medium border-b border-gray-200">
              <tr>
                <th className="px-6 py-3">Provider & type</th>
                <th className="px-6 py-3">Event</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Expiry</th>
                <th className="px-6 py-3">Last reference</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {events.map((ev, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-medium text-gray-900">{ev.provider}</span>
                      <span className="text-xs text-gray-500">{ev.type}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">{ev.event}</td>
                  <td className="px-6 py-4">{ev.date}</td>
                  <td className="px-6 py-4">{ev.expiry}</td>
                  <td className="px-6 py-4">{ev.lastReference}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer count */}
        <div className="flex items-center px-6 py-4 border-t border-gray-200 bg-white">
          <span className="text-sm text-gray-600 font-medium">
            {events.length} event{events.length === 1 ? '' : 's'}
          </span>
        </div>
      </div>
    </div>
  )
}
