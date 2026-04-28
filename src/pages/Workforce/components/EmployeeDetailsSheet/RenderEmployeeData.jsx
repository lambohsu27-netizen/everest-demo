import { useEmployeeDetailsSheet } from './Context'
import ProfileHeader from './ProfileHeader'
import PersonalInformation from './Tabs/PersonalInformation'
import ReportsContent from './Tabs/ReportsContent/index'
import NoReportData from './NoReportData'
import { isNewReportShape } from './adapters/workforceDetailAdapter'

export default function RenderEmployeeData({ employee, reportDetail, personalDetail, isLoadingDetail = false }) {
  const { currentTabs } = useEmployeeDetailsSheet()

  // Old snapshots (legacy shape) intentionally fall through to the empty
  // state — see plan §"User-confirmed scope decisions". Only the new shape
  // exposes report sections.
  const hasReportData = isNewReportShape(reportDetail)

  const renderContent = () => {
    if (isLoadingDetail) {
      return (
        <div className="flex items-center justify-center py-24">
          <p className="text-sm font-medium text-gray-500">Loading…</p>
        </div>
      )
    }
    if (currentTabs.type === 'personal_information') {
      return <PersonalInformation personalDetail={personalDetail} employee={employee} />
    }
    if (!hasReportData) {
      return <NoReportData />
    }
    return <ReportsContent />
  }

  return (
    <div className="flex flex-1 min-h-0 flex-col gap-8">
      <ProfileHeader employee={employee} />
      <div className="flex-1 min-h-0 overflow-y-auto">{renderContent()}</div>
    </div>
  )
}
