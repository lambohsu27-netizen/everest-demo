import React from 'react'
import { SearchSm, FilterLines } from '@untitled-ui/icons-react'
import { MyButton } from '@interstellar-component'

export default function NegativeEventsSection() {
  const events = [
    {
      provider: 'PT Babados Bangkit Bersama',
      type: 'General Business Company',
      event: 'Bankruptcy petition',
      date: '8 Jan 2024',
      expiry: '8 Jan 2024',
      lastReference: '8 Jan 2024',
    },
    {
      provider: 'PT Babados Bangkit Bersama',
      type: 'General Business Company',
      event: 'Write-off',
      date: '8 Jan 2024',
      expiry: '8 Jan 2024',
      lastReference: '8 Jan 2024',
    },
    {
      provider: 'PT Babados Bangkit Bersama',
      type: 'General Business Company',
      event: 'Write-off',
      date: '8 Jan 2024',
      expiry: '8 Jan 2024',
      lastReference: '8 Jan 2024',
    },
  ]

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex flex-col gap-1 pb-4 border-b border-gray-200">
        <h3 className="text-xl font-bold text-gray-900">Negative events</h3>
        <p className="text-sm text-gray-500">Breakdown of active and historical credit facilities associated with this individual.</p>
      </div>

      <div className="flex flex-col border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
        {/* Toolbar */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
          <div className="relative w-80">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchSm className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search for event"
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500"
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

        {/* Pagination Placeholder */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-white">
          <span className="text-sm text-gray-600 font-medium">Page 1 of 4</span>
          <div className="flex gap-3">
             <MyButton color="secondary" variant="outlined" size="sm">Previous</MyButton>
             <MyButton color="secondary" variant="outlined" size="sm">Next</MyButton>
          </div>
        </div>
      </div>
    </div>
  )
}
