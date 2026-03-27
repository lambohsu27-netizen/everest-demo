import React from 'react'
import GeneralInfoCard from './GeneralInfoCard'
import AttachmentsCard from './AttachmentsCard'
import ActivityFeed from './ActivityFeed'

/**
 * @param {object} props
 * @param {object} props.employee
 */
export default function PersonalInformation({ employee }) {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start pb-8">
      <GeneralInfoCard employee={employee} />
      <AttachmentsCard employee={employee} />
      <ActivityFeed employee={employee} />
    </div>
  )
}
