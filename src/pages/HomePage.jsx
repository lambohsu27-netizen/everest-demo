import React from 'react'
import BackgroundPattern from '../assets/HomePage/BackgroundPattern.png'
import Content from '../assets/HomePage/Content.png'
import { useApp } from '../AppContext'

function HomePage() {
  const { user } = useApp()
  return (
    <main className="relative z-0 flex min-h-screen overflow-hidden">
      {/* Full Background Pattern */}
      <img
        src={BackgroundPattern}
        alt="Background Pattern"
        className="pointer-events-none absolute inset-0 h-full w-full object-cover"
      />

      {/* Content Layer */}
      <div className="relative z-10 flex w-full flex-col items-start justify-center gap-6 p-8 md:w-1/2 md:p-16">
        <p className="display-xl-medium text-gray-900">Welcome Back, {user?.name?.trim()}!</p>
        <p className="text-xl-regular text-gray-600">
          Pilih menu yang diinginkan dari opsi di sidebar untuk memulai.
        </p>
      </div>

      {/* Right Side - Foreground Content */}
      <div className="relative z-10 hidden w-0 md:block md:w-1/2">
        <div className="flex h-full items-center justify-center p-8">
          <img src={Content} alt="Main Pattern Content" className="w-full max-w-md" />
        </div>
      </div>
    </main>
  )
}

export default HomePage
