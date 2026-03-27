import { useEmployeeDetailsSheet } from './Context'
import ProfileHeader from './ProfileHeader'
import PersonalInformation from './Tabs/PersonalInformation'
import ReportsContent from './Tabs/ReportsContent/index'
import NoReportData from './NoReportData'

/**
 * @param {object} props
 * @param {object} props.employee
 */
export default function RenderEmployeeData({ employee }) {
  const { currentTabs } = useEmployeeDetailsSheet()

  // TODO: replace with real backend flag once available
  const hasReportData = employee.hasReport ?? false

  const renderContent = () => {
    if (currentTabs.type === 'personal_information') {
      return <PersonalInformation employee={employee} />
    }
    if (!hasReportData) {
      return <NoReportData />
    }
    return <ReportsContent />
  }

  return (
    <div className="flex flex-col gap-8">
      <ProfileHeader employee={employee} />
      <div>{renderContent()}</div>
    </div>
  )
}
