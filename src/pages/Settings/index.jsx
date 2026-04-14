import React from 'react'
import { Outlet } from 'react-router-dom'
import StackedPageSheet from '@src/components/StackedPageSheet'
import SettingsHeader from './Common/SettingsHeader'
import { SettingsProvider } from './Context'

export default function Settings() {
  return (
    <SettingsProvider>
      {/* <StackedPageSheet backUrl="/dashboard" closeUrl="/dashboard"> */}
        <div className="flex w-full h-full flex-col font-inter p-8 min-h-0">
          <div className="flex w-full flex-1 min-h-0 flex-col">
            <SettingsHeader />
            <Outlet />
          </div>
        </div>
      {/* </StackedPageSheet> */}
    </SettingsProvider>
  )
}
