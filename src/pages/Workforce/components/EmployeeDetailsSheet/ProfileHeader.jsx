import { MyButton, MyButtonGroup, MyChip, MyContextMenu, MyPopper } from '@interstellar-component'
import { useState } from 'react'
import {
  Calendar,
  ChevronDown,
  File06,
  FilterLines,
  LinkBroken02,
  Repeat04,
  Zap,
} from '@untitled-ui/icons-react'
import PropTypes from 'prop-types'
import { useEmployeeDetailsSheet } from './Context'
import RevokeReportForm from './RevokeReportForm'

export default function ProfileHeader({ employee }) {
  const { currentTabs, setCurrentTabs } = useEmployeeDetailsSheet()
  const [isRevokeModalOpen, setIsRevokeModalOpen] = useState(false)

  const tabs = ['Report', 'Personal information']

  return (
    <div className="flex flex-col gap-6 pb-8 border-b border-gray-200 bg-white">
      {/* Main Header Content */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {/* Avatar */}
          {employee.avatar ? (
            <img
              src={employee.avatar}
              alt={employee.name}
              className="h-14 w-14 rounded-full object-cover ring-1 ring-gray-200"
            />
          ) : (
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand/50 text-xl font-bold text-brand/700 ring-1 ring-gray-200">
              {employee.name.charAt(0)}
            </div>
          )}

          {/* Name & ID */}
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold text-gray-900">{employee.name}</h1>
            <p className="text-sm text-gray-500 font-medium">{employee.employeeId}</p>
          </div>
        </div>

        {/* Action Button */}
        <MyPopper
          placement="bottom-end"
          target={(open, show) => (
            <MyButton
              onClick={show}
              color="primary"
              variant="filled"
              size="md"
              customClassname="gap-2"
            >
              <Zap className="h-5 w-5" />
              Action
              <ChevronDown className={`h-5 w-5 transition-transform ${open ? 'rotate-180' : ''}`} />
            </MyButton>
          )}
        >
          {(_open, _anchorEl, _show, close) => (
            <MyContextMenu
              menuButtonGroups={[
                [
                  {
                    icon: <Repeat04 />,
                    label: 'Refresh report',
                    onClick: () => {
                      // console.log('Refresh report')
                      close()
                    },
                  },
                  {
                    icon: <LinkBroken02 />,
                    label: 'Revoke',
                    color: '#b42318',
                    onClick: () => {
                      setIsRevokeModalOpen(true)
                      close()
                    },
                  },
                ],
              ]}
            />
          )}
        </MyPopper>
      </div>

      {/* Badges Section */}
      <div className="flex items-center gap-2">
        <MyChip
          label="Active consent"
          color="success"
          variant="modern"
          size="sm"
          rounded="lg"
          dot
        />
        <MyChip
          label="26 Juni 2026"
          color="modern"
          variant="modern"
          size="sm"
          rounded="lg"
          startAdornment={<File06 className="h-3 w-3 text-brand/700" />}
        />
      </div>

      {/* Tabs & Filters Section */}
      <div className="flex items-center justify-between gap-4 mt-2">
        <MyButtonGroup
          buttons={tabs}
          value={currentTabs.type === 'report' ? 'Report' : 'Personal information'}
          onChange={(val) =>
            setCurrentTabs({
              type: val === 'Report' ? 'report' : 'personal_information',
            })
          }
        />

        <div className="flex items-center gap-3">
          {/* Date Picker (Placeholder for now as it needs complex logic) */}
          <MyButton color="secondary" variant="outlined" size="md" customClassname="gap-2">
            <Calendar className="h-5 w-5 text-gray-500" />
            Jan 10, 2025 – Jan 16, 2025
          </MyButton>

          {/* Filter Button */}
          <MyButton color="secondary" variant="outlined" size="md" customClassname="gap-2">
            <FilterLines className="h-5 w-5 text-gray-500" />
            Filters
          </MyButton>
        </div>
      </div>
      <RevokeReportForm
        open={isRevokeModalOpen}
        onClose={() => setIsRevokeModalOpen(false)}
        onRevoke={() => {
          // Handle revoke logic here (e.g., call API)
        }}
      />
    </div>
  )
}

ProfileHeader.propTypes = {
  employee: PropTypes.shape({
    name: PropTypes.string.isRequired,
    employeeId: PropTypes.string.isRequired,
    avatar: PropTypes.string,
  }).isRequired,
}
