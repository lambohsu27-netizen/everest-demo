import React from 'react'

import LegalHeader from './components/LegalHeader'
import LegalContent from './components/LegalContent'

function Legal() {
  return (
    <div className="flex h-full w-full flex-col overflow-y-auto bg-white">
      <div className="mx-auto w-full max-w-[1372px]">
        <LegalHeader />
        
        <div className="w-full px-8">
          <div className="h-px w-full bg-[#e9eaeb]" />
        </div>
        
        <LegalContent />
        
        <div className="w-full px-8 pb-24">
          <div className="h-px w-full bg-[#e9eaeb]" />
        </div>
      </div>
    </div>
  )
}

export default Legal
