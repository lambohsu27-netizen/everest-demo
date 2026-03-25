import React from 'react'
import { MessageCircle01, Phone } from '@untitled-ui/icons-react'

function ContactFeatures() {
  return (
    <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-16 px-8">
      <div className="flex w-full overflow-hidden rounded-xl bg-gray-100 h-[560px]">
        <img
          src="https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&q=80&w=1216&h=560"
          alt="Friendly team member"
          className="h-full w-full object-cover"
        />
      </div>

      <div className="flex w-full flex-col gap-8 md:flex-row">
        {/* Card 1 */}
        <div className="flex flex-1 flex-col gap-16 bg-[#fafafa] p-6 rounded-xl">
          <div className="flex h-12 w-12 items-center justify-center rounded-[10px] bg-brand/600 shadow-[0px_1px_2px_0px_#1018280d]">
            <MessageCircle01 className="h-6 w-6 text-white" />
          </div>
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <h3 className="text-xl font-semibold text-[#101828]">Chat to customer service</h3>
              <p className="text-base text-[#535862]">Speak to our friendly team.</p>
            </div>
            <a href="/" className="text-base font-semibold text-brand/700">0812 8872 3889</a>
          </div>
        </div>

        {/* Card 2 */}
        <div className="flex flex-1 flex-col gap-16 bg-[#fafafa] p-6 rounded-xl">
          <div className="flex h-12 w-12 items-center justify-center rounded-[10px] bg-brand/600 shadow-[0px_1px_2px_0px_#1018280d]">
            <Phone className="h-6 w-6 text-white" />
          </div>
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <h3 className="text-xl font-semibold text-[#101828]">Call us</h3>
              <p className="text-base text-[#535862]">Mon-Fri from 8am to 5pm.</p>
            </div>
            <a href="/" className="text-base font-semibold text-brand/700">+1 (555) 000-0000</a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContactFeatures
