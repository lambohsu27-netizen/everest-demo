import React from 'react'
import { Outlet } from 'react-router-dom'

import { MyModalSlider } from '@interstellar-component'
import WorkforceHeader from './components/WorkforceHeader'
import WorkforceTable from './components/WorkforceTable'
import NewEmployeeSlider from './Sliders/NewEmployeeSlider'
import ImportWorkforceSlider from './Sliders/ImportWorkforceSlider'
import CreditCompositionSlider from './Sliders/CreditCompositionSlider'
import LoanCategorySlider from './Sliders/LoanCategorySlider'
import { useWorkforce } from './Context'

function Workforce() {
  const { currentSlider, handleCurrentSlider } = useWorkforce()

  return (
    <div className="flex h-full w-full flex-col overflow-y-auto bg-gray-50/50">
      <MyModalSlider
        open={currentSlider?.current === 'new-employee'}
        element={<NewEmployeeSlider />}
        onClose={() => handleCurrentSlider(null)}
        scrim
      />
      <MyModalSlider
        open={currentSlider?.current === 'import-workforce'}
        element={<ImportWorkforceSlider />}
        onClose={() => handleCurrentSlider(null)}
        scrim
      />
      <MyModalSlider
        open={currentSlider?.current === 'credit-composition'}
        element={<CreditCompositionSlider />}
        onClose={() => handleCurrentSlider(null)}
        scrim
      />
      <MyModalSlider
        open={currentSlider?.current === 'loan-category'}
        element={<LoanCategorySlider />}
        onClose={() => handleCurrentSlider(null)}
        scrim
      />

      <div className="mx-auto w-full max-w-[1372px]">
        <WorkforceHeader />
        <WorkforceTable />
        <Outlet />
      </div>
    </div>
  )
}

export default Workforce
