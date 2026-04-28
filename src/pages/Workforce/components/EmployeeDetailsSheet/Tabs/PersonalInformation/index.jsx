import React from 'react'
import GeneralInfoCard from './GeneralInfoCard'
import AttachmentsCard from './AttachmentsCard'
import ActivityFeed from './ActivityFeed'

// `personalDetail` is the response from GET /v1/workforce/:id?type=personal_information.
// `employee` is the merged list-row + report cache used for fallback fields
// (avatar, position) that the personal_information mode doesn't return.
export default function PersonalInformation({ personalDetail, employee }) {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start pb-8">
      <GeneralInfoCard personalDetail={personalDetail} employee={employee} />
      <AttachmentsCard personalDetail={personalDetail} />
      <ActivityFeed personalDetail={personalDetail} employee={employee} />
    </div>
  )
}
