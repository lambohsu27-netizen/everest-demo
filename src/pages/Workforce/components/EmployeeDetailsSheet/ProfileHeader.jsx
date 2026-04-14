import {
  MyButton,
  MyChip,
  MyContextMenu,
  MyPopper,
  MyHorizontalTabV2,
  MyStackedModalSlider,
} from '@interstellar-component'
import { useState } from 'react'
import {
  Calendar,
  ChevronDown,
  Edit01,
  File06,
  FilterLines,
  LinkBroken02,
  Repeat04,
  Zap,
} from '@untitled-ui/icons-react'
import PropTypes from 'prop-types'
import { useEmployeeDetailsSheet } from './Context'
import EditEmployeeSlider from './EditEmployeeSlider'
import RevokeReportForm from './RevokeReportForm'

export default function ProfileHeader({ employee }) {
  const { currentTabs, setCurrentTabs } = useEmployeeDetailsSheet()
  const [isRevokeModalOpen, setIsRevokeModalOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)

  const tabs = [
    { label: 'Report', value: 'report' },
    { label: 'Personal information', value: 'personal_information' },
  ]

  return (
    <div className="flex flex-col gap-6 pb-8 border-b border-gray-200 bg-white">
      {/* Main Header Content */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {/* Avatar */}
          {employee.avatar_url ?? employee.avatar ? (
            <img
              src={employee.avatar_url ?? employee.avatar}
              alt={employee.full_name ?? employee.name ?? ''}
              className="h-14 w-14 rounded-full object-cover ring-1 ring-gray-200"
            />
          ) : (
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand/50 text-xl font-bold text-brand/700 ring-1 ring-gray-200">
              {(employee.full_name ?? employee.name ?? '?').charAt(0)}
            </div>
          )}

          {/* Name & ID */}
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold text-gray-900">
              {employee.full_name ?? employee.name ?? '—'}
            </h1>
            <p className="text-sm text-gray-500 font-medium">
              {employee.code ?? employee.employeeId ?? ''}
            </p>
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
                    icon: <Edit01 />,
                    label: 'Edit',
                    onClick: () => {
                      setIsEditOpen(true)
                      close()
                    },
                  },
                  {
                    icon: <Repeat04 />,
                    label: 'Refresh report',
                    onClick: () => {
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
        <MyHorizontalTabV2
          tabs={tabs}
          value={currentTabs.type}
          onChange={(val) =>
            setCurrentTabs({
              type: val,
            })
          }
          fitContent
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
      <MyStackedModalSlider
        open={isEditOpen}
        offset={0}
        zIndex={1000}
        element={
          <EditEmployeeSlider employee={employee} onClose={() => setIsEditOpen(false)} />
        }
        onClose={() => setIsEditOpen(false)}
        scrim
      />
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
    full_name: PropTypes.string,
    name: PropTypes.string,
    code: PropTypes.string,
    employeeId: PropTypes.string,
    avatar_url: PropTypes.string,
    avatar: PropTypes.string,
  }).isRequired,
}
