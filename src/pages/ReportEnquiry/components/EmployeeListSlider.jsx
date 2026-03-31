import React, { useState } from 'react'
import SimpleBar from 'simplebar-react'
import {
  XClose,
  SearchMd,
  Plus,
  User01,
} from '@untitled-ui/icons-react'
// Shared Components
import {
  MyButton,
  MyTextField,
  MyHorizontalTabV2,
  MyAvatar,
} from '@interstellar-component'
// Context
import { useReportEnquiry } from '../Context'
import EmployeeDetailHoverCard from './EmployeeDetailHoverCard'

// ── static data ────────────────────────────────────────────────────────────────
const EMPLOYEES_GROUPED = [
  {
    entity: 'PT Everest Maju Sejahtera',
    employees: [
      {
        id: '357232',
        label: 'Phoenix Baker',
        position: 'Product Designer',
        status: 'Expired',
        avatar: null,
        email: 'phoenix.baker@everest.com',
        whatsapp: '08123456789',
        entityObj: { label: 'PT Everest Maju Sejahtera', value: 'everest' },
        level: { label: 'Supervisor', value: 'supervisor' },
        positionObj: { label: 'Product Designer', value: 'product-designer' },
        division: 'Design',
      },
      {
        id: '357233',
        label: 'Olivia Rhye',
        position: 'UX Designer',
        status: 'Active',
        avatar: null,
        email: 'olivia.rhye@everest.com',
        whatsapp: '08123456781',
        entityObj: { label: 'PT Everest Maju Sejahtera', value: 'everest' },
        level: { label: 'Staff', value: 'staff' },
        positionObj: { label: 'UX Designer', value: 'ux-designer' },
        division: 'UX',
      },
      {
        id: '357234',
        label: 'Lana Steiner',
        position: 'UI Designer',
        status: 'Expired',
        avatar: null,
        email: 'lana.steiner@everest.com',
        whatsapp: '08123456780',
        entityObj: { label: 'PT Everest Maju Sejahtera', value: 'everest' },
        level: { label: 'Staff', value: 'staff' },
        positionObj: { label: 'UI Designer', value: 'ui-designer' },
        division: 'UI',
      },
      {
        id: '357235',
        label: 'Demi Wilkinson',
        position: 'UX Designer',
        status: 'Active',
        avatar: null,
        email: 'demi.wilkinson@everest.com',
        whatsapp: '08123456783',
        entityObj: { label: 'PT Everest Maju Sejahtera', value: 'everest' },
        level: { label: 'Staff', value: 'staff' },
        positionObj: { label: 'UX Designer', value: 'ux-designer' },
        division: 'UX',
      },
    ],
  },
  {
    entity: 'PT Annapurna Berdiri Tinggi',
    employees: [
      {
        id: '357236',
        label: 'Phoenix Baker',
        position: 'Product Designer',
        status: 'Active',
        avatar: null,
        email: 'phoenix.baker@everest.com',
        whatsapp: '08123456789',
        entityObj: { label: 'PT Annapurna Berdiri Tinggi', value: 'annapurna' },
        level: { label: 'Supervisor', value: 'supervisor' },
        positionObj: { label: 'Product Designer', value: 'product-designer' },
        division: 'Design',
      },
      {
        id: '357237',
        label: 'Olivia Rhye',
        position: 'UX Designer',
        status: 'Active',
        avatar: null,
        email: 'olivia.rhye@everest.com',
        whatsapp: '08123456781',
        entityObj: { label: 'PT Annapurna Berdiri Tinggi', value: 'annapurna' },
        level: { label: 'Staff', value: 'staff' },
        positionObj: { label: 'UX Designer', value: 'ux-designer' },
        division: 'UX',
      },
      {
        id: '357238',
        label: 'Lana Steiner',
        position: 'UI Designer',
        status: 'Expired',
        avatar: null,
        email: 'lana.steiner@everest.com',
        whatsapp: '08123456780',
        entityObj: { label: 'PT Annapurna Berdiri Tinggi', value: 'annapurna' },
        level: { label: 'Staff', value: 'staff' },
        positionObj: { label: 'UI Designer', value: 'ui-designer' },
        division: 'UI',
      },
      {
        id: '357239',
        label: 'Demi Wilkinson',
        position: 'UX Designer',
        status: 'Active',
        avatar: null,
        email: 'demi.wilkinson@everest.com',
        whatsapp: '08123456783',
        entityObj: { label: 'PT Annapurna Berdiri Tinggi', value: 'annapurna' },
        level: { label: 'Staff', value: 'staff' },
        positionObj: { label: 'UX Designer', value: 'ux-designer' },
        division: 'UX',
      },
      {
        id: '357240',
        label: 'Candice Wu',
        position: 'UI Designer',
        status: 'Active',
        avatar: null,
        email: 'candice.wu@everest.com',
        whatsapp: '08123456784',
        entityObj: { label: 'PT Annapurna Berdiri Tinggi', value: 'annapurna' },
        level: { label: 'Staff', value: 'staff' },
        positionObj: { label: 'UI Designer', value: 'ui-designer' },
        division: 'UI',
      },
      {
        id: '357241',
        label: 'Natali Craig',
        position: '@natali',
        status: 'Active',
        avatar: null,
        email: 'natali.craig@everest.com',
        whatsapp: '08123456785',
        entityObj: { label: 'PT Annapurna Berdiri Tinggi', value: 'annapurna' },
        level: { label: 'Staff', value: 'staff' },
        positionObj: { label: 'UX Designer', value: 'ux-designer' },
        division: 'UX',
      },
      {
        id: '357242',
        label: 'Drew Cano',
        position: '@drew',
        status: 'Active',
        avatar: null,
        email: 'drew.cano@everest.com',
        whatsapp: '08123456786',
        entityObj: { label: 'PT Annapurna Berdiri Tinggi', value: 'annapurna' },
        level: { label: 'Staff', value: 'staff' },
        positionObj: { label: 'UX Designer', value: 'ux-designer' },
        division: 'UX',
      },
    ],
  },
]

// ── main component ─────────────────────────────────────────────────────────────
function EmployeeListSlider({ onSelect }) {
  const { popSlider, sliderStack } = useReportEnquiry()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusTab, setStatusTab] = useState('All status')

  // Hover Card state
  const [hoveredEmployee, setHoveredEmployee] = useState(null)
  const [isHoverCardVisible, setIsHoverCardVisible] = useState(false)
  const hoverTimeoutRef = React.useRef(null)

  // Find this slider's index in the stack to determine horizontal positioning
  const sliderIndex = sliderStack.findIndex((s) => s.current === 'employee-list')
  const currentOffset = sliderIndex >= 0 ? sliderIndex * 420 : 0

  const handleClose = () => popSlider()

  const handleMouseEnter = (emp) => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current)
    setHoveredEmployee(emp)
    setIsHoverCardVisible(true)
  }

  const handleMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setIsHoverCardVisible(false)
    }, 300)
  }

  const handleModalKeepAlive = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current)
    setIsHoverCardVisible(true)
  }

  const handleSelectEmployee = (emp) => {
    onSelect?.({
      label: emp.label,
      value: emp.id,
      supportingText: emp.position,
      email: emp.email,
      whatsapp: emp.whatsapp,
      entity: emp.entityObj,
      level: emp.level,
      position: emp.positionObj,
    })
    popSlider()
  }

  // Filtering logic
  const filteredGroups = EMPLOYEES_GROUPED.map((group) => ({
    ...group,
    employees: group.employees.filter((emp) => {
      const matchesSearch =
        emp.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.id.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus =
        statusTab === 'All status' || emp.status === statusTab
      return matchesSearch && matchesStatus
    }),
  })).filter((group) => group.employees.length > 0)

  return (
    <div className="flex h-screen w-[420px] flex-col bg-white shadow-xl">
      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <header className="relative flex items-start gap-x-4 px-6 py-6 border-b border-gray-100">
        <button
          type="button"
          onClick={handleClose}
          className="absolute right-[12px] top-[12px] flex h-10 w-10 items-center justify-center rounded-lg p-2 text-gray-400 hover:bg-gray-50 active:bg-gray-100"
        >
          <XClose size={24} stroke="currentColor" />
        </button>

        <div className="flex flex-1 flex-col gap-1 pt-1">
          <p className="text-lg font-semibold text-gray-900">List of employee</p>
          <p className="text-sm text-gray-500 font-medium">BCA_PM_220124_897641</p>
        </div>
      </header>

      {/* ── Top Controls ────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-4 p-6 border-b border-gray-100">
        {/* Search */}
        <MyTextField
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          startAdornment={<SearchMd className="size-4 text-gray-400" />}
        />

        {/* Status Tabs */}
        <MyHorizontalTabV2
          value={statusTab}
          onChange={setStatusTab}
          tabs={[
            { label: 'All status', value: 'All status' },
            { label: 'Active', value: 'Active' },
            { label: 'Expired', value: 'Expired' },
          ]}
        />

        {/* Add New Action */}
        <MyButton
          variant="text"
          color="primary"
          size="sm"
          customClassname="gap-2 w-max px-0 font-semibold"
        >
          <Plus className="size-4" />
          Add new employee
        </MyButton>
      </div>

      {/* ── List Content ────────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-hidden">
        <SimpleBar forceVisible="y" style={{ maxHeight: '100%' }}>
          <div className="flex flex-col">
            {filteredGroups.map((group) => (
              <div key={group.entity} className="flex flex-col">
                <div className="px-6 py-2 bg-gray-50 border-b border-gray-100">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    {group.entity}
                  </p>
                </div>
                {group.employees.map((emp) => (
                  <button
                    key={`${group.entity}-${emp.id}`}
                    type="button"
                    onClick={() => handleSelectEmployee(emp)}
                    onMouseEnter={() => handleMouseEnter(emp)}
                    onMouseLeave={handleMouseLeave}
                    className="flex items-center gap-3 px-6 py-4 hover:bg-gray-50 border-b border-gray-50 text-left transition-colors"
                  >
                    <MyAvatar
                      name={emp.label}
                      src={emp.avatar}
                      size="md"
                      fallback={<User01 className="size-5 text-gray-400" />}
                    />
                    <div className="flex flex-1 flex-col gap-0.5">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900 whitespace-pre-wrap leading-tight">
                          {emp.label}
                          <br />
                          <span className="text-xs text-gray-500 font-normal">
                            ID-{emp.id}
                          </span>
                        </p>
                        {emp.status === 'Expired' && (
                          <span className="rounded-full bg-error/50 border border-error/200 px-2 py-0.5 text-[10px] font-semibold text-error/700">
                            Expired
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500">{emp.position}</p>
                    </div>
                  </button>
                ))}
              </div>
            ))}
          </div>
        </SimpleBar>
      </div>

      {/* ── Hover Modal ─────────────────────────────────────────────────────── */}
      <EmployeeDetailHoverCard
        employee={hoveredEmployee}
        isVisible={isHoverCardVisible}
        onMouseEnter={handleModalKeepAlive}
        onMouseMove={handleModalKeepAlive}
        onMouseLeave={handleMouseLeave}
        style={{
          right: `${currentOffset + 416}px`, // Slight 4px overlap to ensure no hover gap
          top: '24px',
        }}
      />
    </div>
  )
}

export default EmployeeListSlider
