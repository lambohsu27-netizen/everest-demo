import React from 'react'
import { SearchMd } from '@untitled-ui/icons-react'

const metrics = [
  { label: 'All KOL', value: '1,432', active: true },
  { label: 'KOL 1', value: '272', active: false },
  { label: 'KOL 2', value: '0', active: false },
  { label: 'KOL 3', value: '12', active: false },
  { label: 'KOL 4', value: '43', active: false },
  { label: 'KOL 5', value: '5', active: false },
]

function MetricCard({ label, value, active }) {
  return (
    <div
      className={`flex flex-col gap-2 rounded-xl border p-4 shadow-sm w-[160px] md:flex-1 ${
        active ? 'border-brand/500 bg-white' : 'border-gray-200 bg-white'
      }`}
    >
      <span className="text-sm font-medium text-gray-500">{label}</span>
      <span className="text-3xl font-semibold text-gray-900">{value}</span>
    </div>
  )
}

function EmployeeDashboardSection({ searchTerm, onSearchTermChange }) {
  return (
    <div className="flex flex-col gap-6 p-8 pb-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-end justify-between">
        <div className="flex flex-col gap-1">
          <h2 className="text-[18px] font-semibold text-gray-900">Employee dashboard</h2>
          <p className="text-[14px] text-gray-600">
            Manage your team members and their account permissions here.
          </p>
        </div>

        <div className="relative w-full max-w-sm">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <SearchMd className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full rounded-lg border border-gray-300 bg-white p-2 pl-9 pr-12 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:border-brand/500 focus:outline-none focus:ring-1 focus:ring-brand/500"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => onSearchTermChange?.(e.target.value)}
          />
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <span className="text-xs text-gray-400 border border-gray-200 rounded px-1.5 py-0.5 bg-gray-50">
              ⌘K
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 md:flex-nowrap">
        {metrics.map((m) => (
          <MetricCard key={m.label} label={m.label} value={m.value} active={m.active} />
        ))}
      </div>
    </div>
  )
}

export default EmployeeDashboardSection
