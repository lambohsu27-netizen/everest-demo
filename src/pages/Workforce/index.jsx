import React from 'react'
import { Outlet } from 'react-router-dom'

import { MyModalSlider } from '@interstellar-component'
import WorkforceHeader from './components/WorkforceHeader'
import WorkforceTable from './components/WorkforceTable'
import NewEmployeeSlider from './Sliders/NewEmployeeSlider'
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

      <div className="mx-auto w-full max-w-[1372px]">
        <WorkforceHeader />
        <WorkforceTable />
        <Outlet />
      </div>
    </div>
  )
}

export default Workforce
