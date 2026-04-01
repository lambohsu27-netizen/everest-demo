import { MyHorizontalTabV2 } from '@interstellar-component'
import { useSettings } from '../../Context'
import LevelTab from './LevelTab'
import PositionTab from './PositionTab'

export default function EmploymentLevel() {
  const { activeEmpSubTab, setActiveEmpSubTab } = useSettings()

  return (
    <div className="flex flex-col pt-8">
      {/* Header section */}
      <div className="flex flex-col gap-1 w-full pb-6">
        <h2 className="text-lg font-semibold text-[#181d27]">Employment level</h2>
        <p className="text-sm text-[#535862]">
          Define employee levels and their associated consent and screening rules.
        </p>
      </div>

      {/* Primary Sub-tabs */}
      <div className="mb-6">
        <MyHorizontalTabV2
          value={activeEmpSubTab}
          onChange={(val) => setActiveEmpSubTab(val)}
          fitContent
          tabs={[
            { value: 'level', label: 'Level' },
            { value: 'position', label: 'Position' },
          ]}
        />
      </div>

      {activeEmpSubTab === 'level' && <LevelTab />}
      {activeEmpSubTab === 'position' && <PositionTab />}
    </div>
  )
}
