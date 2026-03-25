import React from 'react'
import { SearchMd } from '@untitled-ui/icons-react'

function LegalHeader() {
  return (
    <div className="flex w-full flex-col px-8 py-24 gap-[64px]">
      <div className="flex w-full flex-col gap-3">
        <span className="text-base font-semibold text-[#6941c6]">
          Current as of 20 Jan 2025
        </span>
        <div className="flex flex-col lg:flex-row justify-between w-full gap-8">
          <div className="flex w-full max-w-[704px] flex-col gap-8">
            <h1 className="text-5xl font-semibold leading-[60px] tracking-tight text-[#181d27]">
              Terms and conditions
            </h1>
            <div className="relative w-full max-w-[320px]">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <SearchMd className="h-5 w-5 text-gray-500" />
              </div>
              <input
                type="text"
                className="block w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-3.5 text-base text-gray-900 shadow-sm placeholder-gray-500 focus:border-brand/500 focus:outline-none focus:ring-1 focus:ring-brand/500"
                placeholder="Search"
              />
            </div>
          </div>
          <div className="pt-3 max-w-[480px]">
            <p className="text-[20px] leading-[30px] text-[#535862]">
              By accessing our website, you are agreeing to be bound by these terms of service,
              and agree that you are responsible for compliance with any applicable local laws.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LegalHeader
