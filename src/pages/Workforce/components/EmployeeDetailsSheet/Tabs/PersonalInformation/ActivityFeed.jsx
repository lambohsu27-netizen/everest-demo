import React from 'react'
import { User01 } from '@untitled-ui/icons-react'

/**
 * @param {object} props
 * @param {object} props.employee
 */
function relativeTime(value) {
  if (!value) return ''
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return ''
  const diffMs = Date.now() - d.getTime()
  const sec = Math.floor(diffMs / 1000)
  if (sec < 60) return `${sec}s ago`
  const min = Math.floor(sec / 60)
  if (min < 60) return `${min} min ago`
  const hr = Math.floor(min / 60)
  if (hr < 24) return `${hr} hour${hr === 1 ? '' : 's'} ago`
  const day = Math.floor(hr / 24)
  if (day < 30) return `${day} day${day === 1 ? '' : 's'} ago`
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

function deriveActivities(employee) {
  const credit = employee?.credit_report
  const emp = employee?.employment_detail
  const items = []
  if (employee?.created_at) {
    items.push({
      title: 'Record created',
      subtext: relativeTime(employee.created_at),
      supportingText: `${employee.creator?.name ?? 'Admin'} created this workforce record.`,
    })
  }
  if (emp?.start_date) {
    items.push({
      title: 'Employment started',
      subtext: relativeTime(emp.start_date),
      supportingText: `Start date ${new Date(emp.start_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}.`,
    })
  }
  if (emp?.verified_at) {
    items.push({
      title: 'Employment verified',
      subtext: relativeTime(emp.verified_at),
      supportingText: 'Employment details verified.',
    })
  }
  if (credit?.clik_completed_at) {
    items.push({
      title: 'CLIK report completed',
      subtext: relativeTime(credit.clik_completed_at),
      supportingText: `Credit report${credit.enquiry_id ? ` (${credit.enquiry_id})` : ''} retrieved from CLIK.`,
    })
  }
  if (employee?.updated_at && employee.updated_at !== employee.created_at) {
    items.push({
      title: 'Record updated',
      subtext: relativeTime(employee.updated_at),
      supportingText: `${employee.updater?.name ?? employee.creator?.name ?? 'Admin'} updated record.`,
    })
  }
  return items.sort((a, b) => (a.subtext.length > b.subtext.length ? -1 : 1))
}

export default function ActivityFeed({ employee }) {
  const activities = deriveActivities(employee)
  if (activities.length === 0) {
    return (
      <div className="flex flex-col gap-[2px] rounded-xl border border-gray-200 bg-[#fdfdfd] shadow-sm">
        <div className="flex items-center justify-between pl-5 pr-5 pt-3 pb-2">
          <h3 className="text-sm font-semibold text-[#181d27]">Activity</h3>
        </div>
        <div className="bg-white mx-[1px] mb-[1px] rounded-[12px] border border-[#e9eaeb] p-6">
          <p className="text-sm text-gray-500">No activity recorded yet.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-[2px] rounded-xl border border-gray-200 bg-[#fdfdfd] shadow-sm">
      {/* Heading wrapper */}
      <div className="flex items-center justify-between pl-5 pr-5 pt-3 pb-2">
        <h3 className="text-sm font-semibold text-[#181d27]">Activity</h3>
      </div>

      {/* Sidebar / Content Container */}
      <div className="bg-white mx-[1px] mb-[1px] rounded-[12px] border border-[#e9eaeb] p-6 flex flex-col gap-6 overflow-hidden h-full shadow-sm">
        {activities.map((activity, index) => (
          <div key={index} className="flex gap-3 relative last:mb-0">
            {/* Timeline connector */}
            {index !== activities.length - 1 && (
              <div className="absolute left-[16px] top-[32px] bottom-[-24px] w-[1px] bg-gray-100" />
            )}

            {/* Avatar */}
            <div className="flex-shrink-0 z-10">
              {activity.avatarUrl ? (
                <img
                  src={activity.avatarUrl}
                  alt={activity.title}
                  className="h-8 w-8 rounded-full object-cover ring-1 ring-gray-100"
                />
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-50 text-gray-400 border border-gray-100">
                  <User01 className="h-4 w-4" />
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex flex-col gap-1 w-full">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-semibold text-gray-900">{activity.title}</span>
                <span className="text-xs text-gray-400 whitespace-nowrap">{activity.subtext}</span>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed font-medium">
                {activity.supportingText}
              </p>
              
              {activity.message && (
                <div className="mt-2 p-3 rounded-lg border border-gray-100 bg-white">
                  <p className="text-sm text-gray-500 italic">&quot;{activity.message}&quot;</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

