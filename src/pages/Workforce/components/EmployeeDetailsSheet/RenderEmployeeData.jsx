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

        {/* Actions Footer */}
        <div className="mt-8 flex items-center justify-end gap-3 border-t border-gray-100 pt-8">
          <button className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition-colors hover:bg-gray-50">
            Edit Information
          </button>
          <button className="rounded-lg bg-brand/600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand/700">
            Update Status
          </button>
        </div>
      </div>
    </div>
  )
}
