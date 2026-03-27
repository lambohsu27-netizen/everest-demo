import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { myToaster } from '@interstellar-component'
import { SettingsService } from './service'

const SettingsContext = createContext()

const INITIAL_USERS = [
  { id: 1, name: 'Drew Cano', role: 'Field Technician', status: 'Active', email: 'drew.cano@everest.io', phone: '+62 817 8817 3723', company: 'Everest', avatar: 'https://i.pravatar.cc/150?u=1' },
  { id: 2, name: 'Natali Craig', role: 'Help Desk', status: 'Active', email: 'natali.craig@everest.io', phone: '+62 817 8817 3723', company: 'Everest', avatar: 'https://i.pravatar.cc/150?u=2' },
  { id: 3, name: 'Ammar Foley', role: 'Field Technician', status: 'Inactive', email: 'ammar.foley@everest.io', phone: '+62 817 8817 3723', company: 'Everest', avatar: 'https://i.pravatar.cc/150?u=3' },
  { id: 4, name: 'Loki Bright', role: 'Field Technician', status: 'Inactive', email: 'loki.bright@everest.io', phone: '+62 817 8817 3723', company: 'Everest', avatar: 'https://i.pravatar.cc/150?u=4' },
  { id: 5, name: 'Julius Vaughan', role: 'Field Technician', status: 'Inactive', email: 'julius.vaughan@everest.io', phone: '+62 817 8817 3723', company: 'Everest', avatar: 'https://i.pravatar.cc/150?u=5' },
  { id: 6, name: 'Mathilde Lewis', role: 'Help Desk', status: 'Inactive', email: 'mathilder.lewis@everest.io', phone: '+62 817 8817 3723', company: 'Everest', avatar: 'https://i.pravatar.cc/150?u=6' },
]

const INITIAL_EMPLOYMENT_LEVELS = [
  { id: 1, level: 'Staff', salaryRange: 'Rp5,000,000 - Rp10,000,000', consentExpiry: '5 years', repeatEvery: 'Every month' },
  { id: 2, level: 'Supervisor', salaryRange: 'Rp5,000,000 - Rp10,000,000', consentExpiry: '2 years', repeatEvery: 'Every 3 months' },
  { id: 3, level: 'Assistant Manager', salaryRange: 'Rp5,000,000 - Rp10,000,000', consentExpiry: '2 years', repeatEvery: 'Every 3 months' },
  { id: 4, level: 'Junior Manager', salaryRange: 'Rp5,000,000 - Rp10,000,000', consentExpiry: '2 years', repeatEvery: 'Every 3 months' },
  { id: 5, level: 'Senior Manager', salaryRange: 'Rp5,000,000 - Rp10,000,000', consentExpiry: '2 years', repeatEvery: 'Every 6 months' },
  { id: 6, level: 'Director', salaryRange: 'Rp150,000,000 - Rp300,000,000', consentExpiry: '1 year', repeatEvery: 'None' },
]

const INITIAL_POSITIONS = [
  { id: 1, name: 'Product Manager' },
  { id: 2, name: 'Customer Service' },
  { id: 3, name: 'Marketing' },
  { id: 4, name: 'Quality Assurance' },
  { id: 5, name: 'UI/UX Designer' },
  { id: 6, name: 'Project Manager' },
]

function SettingsProvider({ children }) {
  // ── General Settings ────────────────────────────────────────────────────────
  const [sessionTimeout, setSessionTimeout] = useState('')
  const [verificationThreshold, setVerificationThreshold] = useState('')
  const [isLoadingGeneral, setIsLoadingGeneral] = useState(false)
  const savedGeneral = useRef({ session_timeout: '', verification_threshold: '' })

  const fetchGeneralSettings = useCallback(async () => {
    setIsLoadingGeneral(true)
    try {
      const res = await SettingsService.getGeneral()
      const { session_timeout, verification_threshold } = res.data
      setSessionTimeout(String(session_timeout))
      setVerificationThreshold(String(verification_threshold))
      savedGeneral.current = {
        session_timeout: String(session_timeout),
        verification_threshold: String(verification_threshold),
      }
    } catch (err) {
      myToaster(err)
    } finally {
      setIsLoadingGeneral(false)
    }
  }, [])

  const updateGeneralSettings = useCallback(async () => {
    try {
      const res = await SettingsService.updateGeneral({
        session_timeout: Number(sessionTimeout),
        verification_threshold: Number(verificationThreshold),
      })
      myToaster(res)
      savedGeneral.current = { session_timeout: sessionTimeout, verification_threshold: verificationThreshold }
    } catch (err) {
      myToaster(err)
    }
  }, [sessionTimeout, verificationThreshold])

  const cancelGeneralSettings = useCallback(() => {
    setSessionTimeout(savedGeneral.current.session_timeout)
    setVerificationThreshold(savedGeneral.current.verification_threshold)
  }, [])

  useEffect(() => {
    fetchGeneralSettings()
  }, [fetchGeneralSettings])

  // ── Role Access (API-backed) ─────────────────────────────────────────────────
  const [roles, setRoles] = useState([])
  const [rolePagination, setRolePagination] = useState({ total: 0, page: 1, limit: 10, total_pages: 1 })
  const [rolePage, setRolePage] = useState(1)
  const [roleSearchTerm, setRoleSearchTerm] = useState('')
  const [isLoadingRoles, setIsLoadingRoles] = useState(false)
  const [selectedRoleIds, setSelectedRoleIds] = useState([])
  const [roleSortField, setRoleSortField] = useState(null)
  const [roleSortOrder, setRoleSortOrder] = useState(null)

  // Panel state: null | 'detail' | 'create' | 'edit'
  const [rolePanel, setRolePanel] = useState(null)
  const [activePanelRoleId, setActivePanelRoleId] = useState(null)
  const [roleDetail, setRoleDetail] = useState(null)
  const [isLoadingRoleDetail, setIsLoadingRoleDetail] = useState(false)
  const [allPermissions, setAllPermissions] = useState([])

  const fetchRoles = useCallback(async (page = 1, search = '') => {
    setIsLoadingRoles(true)
    try {
      const res = await SettingsService.getRoles({ page, limit: 10, ...(search ? { search } : {}) })
      setRoles(res.data.roles)
      setRolePagination(res.data.pagination)
    } catch (err) {
      myToaster(err)
    } finally {
      setIsLoadingRoles(false)
    }
  }, [])

  const fetchRoleDetail = useCallback(async (id) => {
    setIsLoadingRoleDetail(true)
    try {
      const res = await SettingsService.getRoleDetail(id)
      setRoleDetail(res.data)
    } catch (err) {
      myToaster(err)
    } finally {
      setIsLoadingRoleDetail(false)
    }
  }, [])

  const fetchAllPermissions = useCallback(async () => {
    if (allPermissions.length > 0) return
    try {
      const res = await SettingsService.getPermissions()
      setAllPermissions(res.data)
    } catch (err) {
      myToaster(err)
    }
  }, [allPermissions.length])

  // Panel navigation
  const openRoleDetail = useCallback((id) => {
    setActivePanelRoleId(id)
    setRolePanel('detail')
    fetchRoleDetail(id)
  }, [fetchRoleDetail])

  const openCreateRole = useCallback(() => {
    setActivePanelRoleId(null)
    setRoleDetail(null)
    setRolePanel('create')
    fetchAllPermissions()
  }, [fetchAllPermissions])

  const openEditRole = useCallback(() => {
    setRolePanel('edit')
    fetchAllPermissions()
  }, [fetchAllPermissions])

  const closeRolePanel = useCallback(() => {
    setRolePanel(null)
    setActivePanelRoleId(null)
    setRoleDetail(null)
  }, [])

  // CRUD
  const createRole = useCallback(async (data) => {
    const res = await SettingsService.createRole(data)
    myToaster(res)
    fetchRoles(rolePage, roleSearchTerm)
    closeRolePanel()
  }, [rolePage, roleSearchTerm, fetchRoles, closeRolePanel])

  const updateRole = useCallback(async (id, data) => {
    const res = await SettingsService.updateRole(id, data)
    myToaster(res)
    fetchRoles(rolePage, roleSearchTerm)
    fetchRoleDetail(id)
    setRolePanel('detail')
  }, [rolePage, roleSearchTerm, fetchRoles, fetchRoleDetail])

  const deleteRoles = useCallback(async (ids) => {
    const res = await SettingsService.deleteRoles(ids)
    myToaster(res)
    setSelectedRoleIds([])
    fetchRoles(rolePage, roleSearchTerm)
  }, [rolePage, roleSearchTerm, fetchRoles])

  const handleRoleSort = useCallback(({ sort, order }) => {
    setRoleSortField(sort)
    setRoleSortOrder(order)
  }, [])

  const handleRoleSelectionChange = useCallback((updated) => {
    setRoles(updated.data)
    setSelectedRoleIds(updated.data.filter((r) => r.checked).map((r) => r.id))
  }, [])


  // ── User Role Access State (dummy, user tab unchanged) ───────────────────────
  const [users, setUsers] = useState(INITIAL_USERS)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortField, setSortField] = useState(null)
  const [sortOrder, setSortOrder] = useState(null)
  const [selectedStatus, setSelectedStatus] = useState('Active')

  const handleSort = useCallback(({ sort, order }) => {
    setSortField(sort)
    setSortOrder(order)
    if (!sort || !order) { setUsers(INITIAL_USERS); return }
    const sortedData = [...users].sort((a, b) => {
      const valA = a[sort] || ''
      const valB = b[sort] || ''
      if (valA < valB) return order === 'asc' ? -1 : 1
      if (valA > valB) return order === 'asc' ? 1 : -1
      return 0
    })
    setUsers(sortedData)
  }, [users])

  const handleSelectionChange = useCallback((updated) => {
    setUsers(updated.data)
  }, [])

  const filteredUsers = useMemo(() => {
    let result = users
    if (selectedStatus) result = result.filter((u) => u.status === selectedStatus)
    if (searchTerm) {
      const lower = searchTerm.toLowerCase()
      result = result.filter(
        (u) =>
          u.name.toLowerCase().includes(lower) ||
          u.email.toLowerCase().includes(lower) ||
          u.role.toLowerCase().includes(lower)
      )
    }
    return result
  }, [users, selectedStatus, searchTerm])

  // ── Employment Level State (dummy, unchanged) ────────────────────────────────
  const [employmentLevels, setEmploymentLevels] = useState(INITIAL_EMPLOYMENT_LEVELS)
  const [positions, setPositions] = useState(INITIAL_POSITIONS)
  const [empSearchTerm, setEmpSearchTerm] = useState('')
  const [posSearchTerm, setPosSearchTerm] = useState('')
  const [empSortField, setEmpSortField] = useState(null)
  const [empSortOrder, setEmpSortOrder] = useState(null)
  const [posSortField, setPosSortField] = useState(null)
  const [posSortOrder, setPosSortOrder] = useState(null)
  const [activeEmpSubTab, setActiveEmpSubTab] = useState('level')

  const handleEmpSort = useCallback(({ sort, order }) => {
    setEmpSortField(sort)
    setEmpSortOrder(order)
    if (!sort || !order) { setEmploymentLevels(INITIAL_EMPLOYMENT_LEVELS); return }
    const sortedData = [...employmentLevels].sort((a, b) => {
      const valA = a[sort] || ''; const valB = b[sort] || ''
      if (valA < valB) return order === 'asc' ? -1 : 1
      if (valA > valB) return order === 'asc' ? 1 : -1
      return 0
    })
    setEmploymentLevels(sortedData)
  }, [employmentLevels])

  const handlePosSort = useCallback(({ sort, order }) => {
    setPosSortField(sort)
    setPosSortOrder(order)
    if (!sort || !order) { setPositions(INITIAL_POSITIONS); return }
    const sortedData = [...positions].sort((a, b) => {
      const valA = a[sort] || ''; const valB = b[sort] || ''
      if (valA < valB) return order === 'asc' ? -1 : 1
      if (valA > valB) return order === 'asc' ? 1 : -1
      return 0
    })
    setPositions(sortedData)
  }, [positions])

  const handleEmpSelectionChange = useCallback((updated) => { setEmploymentLevels(updated.data) }, [])
  const handlePosSelectionChange = useCallback((updated) => { setPositions(updated.data) }, [])

  const filteredEmpLevels = useMemo(() => {
    if (!empSearchTerm) return employmentLevels
    const lower = empSearchTerm.toLowerCase()
    return employmentLevels.filter((e) => e.level.toLowerCase().includes(lower))
  }, [employmentLevels, empSearchTerm])

  const filteredPositions = useMemo(() => {
    if (!posSearchTerm) return positions
    const lower = posSearchTerm.toLowerCase()
    return positions.filter((p) => p.name.toLowerCase().includes(lower))
  }, [positions, posSearchTerm])

  // ── Context Value ────────────────────────────────────────────────────────────
  const contextValue = useMemo(
    () => ({
      // General Settings
      sessionTimeout, setSessionTimeout,
      verificationThreshold, setVerificationThreshold,
      isLoadingGeneral,
      updateGeneralSettings, cancelGeneralSettings,

      // Role Access
      roles,
      rolePagination,
      rolePage, setRolePage,
      roleSearchTerm, setRoleSearchTerm,
      isLoadingRoles,
      selectedRoleIds,
      roleSortField, roleSortOrder,
      handleRoleSort, handleRoleSelectionChange,
      rolePanel,
      activePanelRoleId,
      roleDetail, isLoadingRoleDetail,
      allPermissions,
      fetchRoles,
      openRoleDetail, openCreateRole, openEditRole, closeRolePanel,
      createRole, updateRole, deleteRoles,

      // User tab
      users: filteredUsers,
      searchTerm, setSearchTerm,
      sortField, sortOrder, handleSort,
      handleSelectionChange,
      selectedStatus, setSelectedStatus,

      // Employment Level
      employmentLevels: filteredEmpLevels,
      positions: filteredPositions,
      empSearchTerm, setEmpSearchTerm,
      posSearchTerm, setPosSearchTerm,
      empSortField, empSortOrder, handleEmpSort,
      posSortField, posSortOrder, handlePosSort,
      handleEmpSelectionChange, handlePosSelectionChange,
      activeEmpSubTab, setActiveEmpSubTab,
    }),
    [
      sessionTimeout, verificationThreshold, isLoadingGeneral,
      updateGeneralSettings, cancelGeneralSettings,
      roles, rolePagination, rolePage, roleSearchTerm, isLoadingRoles,
      selectedRoleIds, roleSortField, roleSortOrder,
      handleRoleSort, handleRoleSelectionChange,
      rolePanel, activePanelRoleId, roleDetail, isLoadingRoleDetail,
      allPermissions, fetchRoles,
      openRoleDetail, openCreateRole, openEditRole, closeRolePanel,
      createRole, updateRole, deleteRoles,
      filteredUsers, searchTerm, sortField, sortOrder,
      handleSort, handleSelectionChange, selectedStatus,
      filteredEmpLevels, filteredPositions,
      empSearchTerm, posSearchTerm,
      empSortField, empSortOrder, handleEmpSort,
      posSortField, posSortOrder, handlePosSort,
      handleEmpSelectionChange, handlePosSelectionChange,
      activeEmpSubTab,
    ]
  )

  return <SettingsContext.Provider value={contextValue}>{children}</SettingsContext.Provider>
}

const useSettings = () => {
  const context = useContext(SettingsContext)
  if (context === undefined) throw new Error('useSettings must be used within a SettingsProvider')
  return context
}

export { SettingsProvider, useSettings }
