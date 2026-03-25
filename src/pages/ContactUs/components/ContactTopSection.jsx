import React from 'react'

function ContactTopSection() {
  return (
    <div className="flex w-full flex-col gap-[96px]">
      <div className="mx-auto flex w-full max-w-[1280px] flex-col px-8">
        <div className="flex w-full flex-col items-center justify-center gap-5 text-center">
          <div className="flex flex-col items-center justify-center gap-4">
            <span className="rounded-full bg-brand/50 px-3 py-1 text-sm font-medium text-brand/700">
              Contact us
            </span>
            <h1 className="text-4xl font-semibold tracking-tight text-[#101828] md:text-5xl">
              We’d love to hear from you
            </h1>
          </div>
          <p className="text-xl text-[#535862]">Chat to our friendly team.</p>
        </div>
      </div>
    </div>
  )
}

export default ContactTopSection
