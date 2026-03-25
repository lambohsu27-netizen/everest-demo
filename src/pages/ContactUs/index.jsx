import React from 'react'
import { ContactUsProvider } from './Context'

import ContactTopSection from './components/ContactTopSection'
import ContactFeatures from './components/ContactFeatures'
import ContactForm from './components/ContactForm'

function ContactUs() {
  return (
    <div className="flex h-full w-full flex-col overflow-y-auto bg-white">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col py-24">
        {/* Contact Header Component (Top Section) */}
        <ContactTopSection />

        <div className="h-16 w-full" /> {/* Spacing */}

        <ContactFeatures />

        <div className="w-full py-24">
          <div className="mx-auto w-full max-w-[1280px] px-8">
            <div className="h-px w-full bg-[#e9eaeb]" />
          </div>
        </div>

        <ContactForm />
      </div>
    </div>
  )
}

export default function ContactUsWithContext() {
  return (
    <ContactUsProvider>
      <ContactUs />
    </ContactUsProvider>
  )
}
