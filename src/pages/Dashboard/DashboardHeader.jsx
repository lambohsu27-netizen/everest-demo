import React from 'react'

function DashboardHeader() {
  return (
    <div className="flex flex-col gap-1 w-full p-8 pb-0">
      <h1 className="text-3xl font-semibold text-[#181d27]">
        PT Everest Maju Bersama
      </h1>
      <p className="text-[16px] text-[#535862]">
        Manage your team members and their account permissions here.
      </p>
    </div>
  )
}

export default DashboardHeader
