import React from 'react'
import { SearchMd } from '@untitled-ui/icons-react'
import { MyMetricCard } from '@interstellar-component'
import { useDashboard } from '../Context'

function EmployeeDashboardSection({ searchTerm, onSearchTermChange }) {
  const { metrics, handleMetricClick } = useDashboard()

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
        {metrics?.map((m) => (
          <MyMetricCard
            key={m.label}
            label={m.label}
            value={m.value}
            active={m.active}
            onClick={() => handleMetricClick(m.label)}
          />
        ))}
      </div>
    </div>
  )
}

export default EmployeeDashboardSection
