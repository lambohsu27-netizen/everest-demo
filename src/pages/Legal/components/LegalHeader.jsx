import React from 'react'
import { SearchLg } from '@untitled-ui/icons-react'
import { MyTextField } from '@interstellar-component'

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
            <div className="w-full max-w-[320px]">
              <MyTextField
                placeholder="Search"
                startAdornment={
                  <SearchLg className="size-5 text-gray-light/600" stroke="currentColor" />
                }
                focusColor="#42307D"
                 
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
