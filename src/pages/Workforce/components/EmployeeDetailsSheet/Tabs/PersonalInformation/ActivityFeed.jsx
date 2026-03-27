import React from 'react'
import { User01 } from '@untitled-ui/icons-react'

/**
 * @param {object} props
 * @param {object} props.employee
 */
export default function ActivityFeed({ employee }) {
  // Mocking activity if not present
  const activities = employee.activity || [
    {
      title: 'Enquiry sent to CLIK',
      subtext: 'Just now',
      supportingText: 'Credit report request submitted to CLIK by the system.',
    },
    {
      title: 'Verification approved',
      subtext: '2 mins ago',
      supportingText: 'Identity data verified and approved by Alisa Hester.',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
    {
      title: 'Form resubmitted',
      subtext: '2 mins ago',
      supportingText: 'Resubmitted by Phoenix Baker. KTP photo and liveness verification uploaded.',
    },
    {
      title: 'Form resent',
      subtext: '3 hours ago',
      supportingText: 'Form link resent automatically to employee with revision notes.',
    },
    {
      title: 'Verification rejected',
      subtext: '3 hours ago',
      supportingText: 'Rejected by Candice Wu. Issues found: KTP image is blurry and liveness photo is too dark.',
      message: 'KTP image is blurry and liveness photo is too dark.',
      avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
    {
      title: 'Form Submitted',
      subtext: '6 hours ago',
      supportingText: 'Submitted by Phoenix Baker. KTP photo and liveness verification uploaded.',
    },
    {
      title: 'Request created',
      subtext: '6 hours ago',
      supportingText: 'Created by Lana Steiner. Form link sent to employee via WhatsApp',
      avatarUrl: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
  ]

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

