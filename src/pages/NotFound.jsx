import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { MyButton } from '@interstellar-component'
import logo from '../assets/Login/bipura_logo.png'

function NotFound() {
  const nav = useNavigate()
  return (
    <div className="relative flex h-screen flex-col items-center justify-around text-gray-800">
      {/* 🔹 Logo Section */}
      <div className="flex flex-col items-center">
        <img src={logo} alt="Logo" className="w-24" />
      </div>

      {/* 🔹 Message Section */}
      <section className="relative items-center gap-4 text-center column">
        {/* Decorative Floating Elements */}
        <div className="absolute left-10 top-10 h-10 w-20 animate-pulse rounded-full bg-white opacity-60 blur-md" />
        <div className="absolute right-20 top-16 h-16 w-32 animate-pulse rounded-full bg-white opacity-60 blur-md" />

        <h1 className="text-7xl font-bold text-gray-900">404</h1>
        <p className="mt-2 text-xl text-gray-600">Oops! Page not found.</p>

        {/* Home Button */}
        <MyButton variant="filled" color="primary" size="md" onClick={() => nav('/')}>
          Go Home
        </MyButton>
      </section>

      {/* 🔹 Footer Section */}
      <footer className="text-sm text-gray-400">
        &copy; {new Date().getFullYear()} Bipura. All rights reserved.
      </footer>
    </div>
  )
}

export default NotFound
