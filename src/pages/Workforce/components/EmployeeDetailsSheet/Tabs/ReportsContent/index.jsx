import React from 'react'
import Sidebar from './components/Sidebar/index'
import MainContent from './components/MainContent/index'

export default function ReportsContent() {
  return (
    <div className="grid lg:grid-cols-12 w-full bg-white gap-8">
      {/* Sidebar */}
      <div className="w-full lg:col-span-4 xl:col-span-3 flex-shrink-0 lg:border-r lg:border-gray-200 lg:pr-8">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="w-full lg:col-span-8 xl:col-span-9 min-w-0">
        <MainContent />
      </div>
    </div>
  )
}
