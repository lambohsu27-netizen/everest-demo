import { useEmployeeDetailsSheet } from './Context'
import ProfileHeader from './ProfileHeader'
import PersonalInformation from './Tabs/PersonalInformation'
import ReportsContent from './Tabs/ReportsContent/index'

export default function RenderEmployeeData({ employee }) {
  const { currentTabs } = useEmployeeDetailsSheet()

  return (
    <div className="flex flex-col gap-8">
      <ProfileHeader employee={employee} />

      <div>
        {currentTabs.type === 'personal_information' ? (
          <PersonalInformation employee={employee} />
        ) : (
          <ReportsContent />
        )}
      </div>
    </div>
  )
}
