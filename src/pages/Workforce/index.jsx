import React from 'react'
import { Outlet } from 'react-router-dom'

import { MyStackedModalSlider } from '@interstellar-component'
import WorkforceHeader from './components/WorkforceHeader'
import WorkforceTable from './components/WorkforceTable'
import NewEmployeeSlider from './Sliders/NewEmployeeSlider'
import ImportWorkforceSlider from './Sliders/ImportWorkforceSlider'
import CreditCompositionSlider from './Sliders/CreditCompositionSlider'
import LoanCategorySlider from './Sliders/LoanCategorySlider'
import LoanAccountSlider from './Sliders/LoanAccountSlider'
import { useWorkforce } from './Context'

const SLIDER_COMPONENTS = {
  'new-employee': NewEmployeeSlider,
  'import-workforce': ImportWorkforceSlider,
  'credit-composition': CreditCompositionSlider,
  'loan-category': LoanCategorySlider,
  'loan-account-detail': LoanAccountSlider,
}

function Workforce() {
  const { sliderStack, popSlider } = useWorkforce()

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

      <div className="w-full">
        <WorkforceHeader />
        <WorkforceTable />
        <Outlet />
      </div>
    </div>
  )
}

export default Workforce
