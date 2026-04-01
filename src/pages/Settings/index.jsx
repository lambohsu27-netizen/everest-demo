import React from 'react'
import { Outlet } from 'react-router-dom'
import StackedPageSheet from '@src/components/StackedPageSheet'
import SettingsHeader from './components/Common/SettingsHeader'
import { SettingsProvider } from './Context'

export default function Settings() {
  return (
    <SettingsProvider>
      <StackedPageSheet backUrl="/dashboard" closeUrl="/dashboard">
        <div className="flex w-full flex-col font-inter">
          <div className="w-full">
            <SettingsHeader />
            <Outlet />
          </div>
        </div>
      </StackedPageSheet>
    </SettingsProvider>
  )
}
