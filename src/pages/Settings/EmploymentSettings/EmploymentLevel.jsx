import { useState } from 'react'
import { MyHorizontalTabV2 } from '@interstellar-component'
import { EmploymentSettingsProvider } from './Context'
import LevelTab from './LevelTab'
import PositionTab from './PositionTab'

export default function EmploymentLevel() {
  const [activeSubTab, setActiveSubTab] = useState('level')

  return (
    <EmploymentSettingsProvider>
      <div className="flex flex-1 min-h-0 flex-col pt-5">
        {/* Header section */}
        {/* <div className="flex flex-col gap-1 w-full pb-6">
          <h2 className="text-lg font-semibold text-[#181d27]">Employment level</h2>
          <p className="text-sm text-[#535862]">
            Define employee levels and their associated consent and screening rules.
          </p>
        </div> */}

        {/* Primary Sub-tabs */}
        <div className="mb-6">
          <MyHorizontalTabV2
            value={activeSubTab}
            onChange={(val) => setActiveSubTab(val)}
            fitContent
            tabs={[
              { value: 'level', label: 'Level' },
              { value: 'position', label: 'Position' },
            ]}
          />
        </div>

        {activeSubTab === 'level' && <LevelTab />}
        {activeSubTab === 'position' && <PositionTab />}
      </div>
    </EmploymentSettingsProvider>
  )
}
