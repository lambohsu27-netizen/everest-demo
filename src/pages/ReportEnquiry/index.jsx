import React from 'react'

import { MyStackedModalSlider } from '@interstellar-component'
import { useReportEnquiry } from './Context'
import ReportEnquiryHeader from './components/ReportEnquiryHeader'
import ReportEnquiryMetrics from './components/ReportEnquiryMetrics'
import ReportEnquiryTable from './components/ReportEnquiryTable'
import ImportEnquirySlider from './components/ImportEnquirySlider'

const SLIDER_COMPONENTS = {
  'import-enquiry': ImportEnquirySlider,
}

function ReportEnquiry() {
  const { sliderStack, popSlider } = useReportEnquiry()

  return (
    <div className="flex h-full w-full flex-col overflow-y-auto bg-gray-50/50">
      {/* Dynamic Stacked Sliders */}
      {sliderStack.map((slider, index) => {
        const Component = SLIDER_COMPONENTS[slider.current]
        if (!Component) return null

        return (
          <MyStackedModalSlider
            key={`${slider.current}-${index}`}
            open
            offset={index * 420}
            zIndex={1000 - index * 10}
            element={<Component />}
            onClose={popSlider}
            scrim={index === 0}
          />
        )
      })}

      <div className="mx-auto w-full max-w-[1372px]">
        <ReportEnquiryHeader />
        <ReportEnquiryMetrics />
        <ReportEnquiryTable />
      </div>
    </div>
  )
}

export default ReportEnquiry
