import React from 'react'
import EmptyStateImg from '../../../../assets/EmptyState.png'

/**
 * Empty state shown in the Report tab when no report data is available for the employee.
 */
export default function NoReportData() {
  return (
    <div className="flex h-full min-h-[400px] items-center justify-center w-full relative">
      <div className="flex flex-col items-center gap-6">
        {/* Empty state illustration */}
        <div className="flex items-center justify-cente">
          <img src={EmptyStateImg} alt="No report found" className="h-full w-full object-contain" />
        </div>

        {/* Text */}
        <p className="absolute bottom-24 text-xl-semibold text-gray-900">No report found</p>
      </div>
    </div>
  )
}
