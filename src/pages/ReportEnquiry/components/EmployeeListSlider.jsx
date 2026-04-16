import React, { useCallback, useEffect, useState } from 'react'
import SimpleBar from 'simplebar-react'
import {
  XClose,
  SearchMd,
  Plus,
  User01,
} from '@untitled-ui/icons-react'
import {
  MyButton,
  MyTextField,
  MyHorizontalTabV2,
  MyAvatar,
  myToaster,
} from '@interstellar-component'
import { useReportEnquiry } from '../Context'
import EmployeeDetailHoverCard from './EmployeeDetailHoverCard'
import Service from '../service'

function EmployeeListSlider({ onSelect }) {
  const { popSlider, sliderStack } = useReportEnquiry()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusTab, setStatusTab] = useState('All status')
  const [employeeGroups, setEmployeeGroups] = useState([])
  const [loading, setLoading] = useState(false)

  // Hover Card state
  const [hoveredEmployee, setHoveredEmployee] = useState(null)
  const [isHoverCardVisible, setIsHoverCardVisible] = useState(false)
  const hoverTimeoutRef = React.useRef(null)

  const sliderIndex = sliderStack.findIndex(
    (s) => s.current === 'employee-list'
  )
  const currentOffset = sliderIndex >= 0 ? sliderIndex * 420 : 0

  // ── Fetch employees from API ──────────────────────────────────────────
  const fetchEmployees = useCallback(() => {
    setLoading(true)
    const params = {}
    if (searchTerm) params.search = searchTerm
    if (statusTab !== 'All status') {
      params.consent_status = statusTab.toLowerCase()
    }

    Service.getEmployees(params)
      .then((res) => {
        const groups = (res.data || []).map((company) => ({
          entity: company.name,
          employees: (company.employees || []).map((emp) => ({
            id: emp.id,
            employeeId: emp.employee_id,
            label: emp.full_name,
            position:
              emp.position?.name || emp.employment_level?.name || '-',
            status:
              emp.consent_status === 'active' ? 'Active' : 'Expired',
            avatar: null,
            email: emp.email,
            whatsapp: emp.phone,
            entityObj: {
              label: company.name,
              value: company.id,
            },
            level: emp.employment_level
              ? {
                  label: emp.employment_level.name,
                  value: emp.employment_level.id,
                }
              : null,
            positionObj: emp.position
              ? { label: emp.position.name, value: emp.position.id }
              : null,
            division: null,
            _raw: emp,
          })),
        }))
        setEmployeeGroups(groups)
      })
      .catch(myToaster)
      .finally(() => setLoading(false))
  }, [searchTerm, statusTab])

  useEffect(() => {
    fetchEmployees()
  }, [fetchEmployees])

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

  const filteredGroups = employeeGroups
    .map((group) => ({
      ...group,
      employees: group.employees.filter((emp) => {
        const matchesStatus =
          statusTab === 'All status' || emp.status === statusTab
        return matchesStatus
      }),
    }))
    .filter((group) => group.employees.length > 0)

  return (
    <div className="flex h-screen w-[420px] flex-col bg-white shadow-xl">
      {/* Header */}
      <header className="relative flex items-start gap-x-4 px-6 py-6 border-b border-gray-100">
        <button
          type="button"
          onClick={handleClose}
          className="absolute right-[12px] top-[12px] flex h-10 w-10 items-center justify-center rounded-lg p-2 text-gray-400 hover:bg-gray-50 active:bg-gray-100"
        >
          <XClose size={24} stroke="currentColor" />
        </button>

        <div className="flex flex-1 flex-col gap-1 pt-1">
          <p className="text-lg font-semibold text-gray-900">
            List of employee
          </p>
          <p className="text-sm text-gray-500 font-medium">
            Select an employee for the enquiry
          </p>
        </div>
      </header>

      {/* Top Controls */}
      <div className="flex flex-col gap-4 p-6 border-b border-gray-100">
        <MyTextField
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          startAdornment={
            <SearchMd className="size-4 text-gray-400" />
          }
        />

        <MyHorizontalTabV2
          value={statusTab}
          onChange={setStatusTab}
          tabs={[
            { label: 'All status', value: 'All status' },
            { label: 'Active', value: 'Active' },
            { label: 'Expired', value: 'Expired' },
          ]}
        />

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

      {/* List Content */}
      <div className="flex-1 overflow-hidden">
        <SimpleBar forceVisible="y" style={{ maxHeight: '100%' }}>
          <div className="flex flex-col">
            {loading && (
              <div className="flex items-center justify-center py-8">
                <p className="text-sm text-gray-500">Loading...</p>
              </div>
            )}
            {!loading &&
              filteredGroups.map((group) => (
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
                        fallback={
                          <User01 className="size-5 text-gray-400" />
                        }
                      />
                      <div className="flex flex-1 flex-col gap-0.5">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-900 whitespace-pre-wrap leading-tight">
                            {emp.label}
                            <br />
                            <span className="text-xs text-gray-500 font-normal">
                              {emp.employeeId}
                            </span>
                          </p>
                          {emp.status === 'Expired' && (
                            <span className="rounded-full bg-error/50 border border-error/200 px-2 py-0.5 text-[10px] font-semibold text-error/700">
                              Expired
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500">
                          {emp.position}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              ))}
            {!loading && filteredGroups.length === 0 && (
              <div className="flex items-center justify-center py-8">
                <p className="text-sm text-gray-500">
                  No employees found
                </p>
              </div>
            )}
          </div>
        </SimpleBar>
      </div>

      {/* Hover Modal */}
      <EmployeeDetailHoverCard
        employee={hoveredEmployee}
        isVisible={isHoverCardVisible}
        onMouseEnter={handleModalKeepAlive}
        onMouseMove={handleModalKeepAlive}
        onMouseLeave={handleMouseLeave}
        style={{
          right: `${currentOffset + 416}px`,
          top: '24px',
        }}
      />
    </div>
  )
}

export default EmployeeListSlider
