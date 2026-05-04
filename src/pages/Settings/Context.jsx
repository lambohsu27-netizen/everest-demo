/* eslint-disable no-undef */
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { myToaster } from '@interstellar-component'
import { SettingsService } from './service'

const SettingsContext = createContext()

/**
 * List endpoints return `meta` (current_page, total_page, total) or legacy `paginator` (page, limit, total).
 * Table state expects { page, limit, total, total_pages }.
 */
/**
 * Returns the BE pagination shape: { current_page, prev_page, next_page, total_page, total }.
 * Accepts metadata at res.meta, res.paginator, or directly on res.
 */
function normalizeListPagination(res) {
  const raw = res?.meta ?? res?.paginator ?? res
  if (!raw || typeof raw !== 'object') {
    const len = Array.isArray(res?.data) ? res.data.length : 0
    return { current_page: 1, prev_page: null, next_page: null, total_page: 1, total: len }
  }
  const currentPage = Number(raw.current_page ?? raw.page ?? 1)
  const totalPage = Number(raw.total_page ?? raw.total_pages ?? 1)
  return {
    current_page: currentPage,
    prev_page: raw.prev_page ?? (currentPage > 1 ? currentPage - 1 : null),
    next_page: raw.next_page ?? (currentPage < totalPage ? currentPage + 1 : null),
    total_page: totalPage,
    total: Number(raw.total ?? 0),
  }
}

const PERMISSIONS_EMPTY_TOAST_MESSAGE = 'Please select at least one access menu.'

/** Friendly copy when BE returns 422 for empty permissions on role create/update. */
function normalizeRoleSaveError(err) {
  const status = Number(err?.status)
  if (status !== 422 || !Array.isArray(err?.errors)) return err
  const permissionsIssue = err.errors.some(
    (e) =>
      e?.field === 'permissions' &&
      /non-empty|non empty|empty array/i.test(String(e?.message ?? ''))
  )
  if (!permissionsIssue) return err
  return { ...err, message: PERMISSIONS_EMPTY_TOAST_MESSAGE }
}

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
      savedGeneral.current = {
        session_timeout: sessionTimeout,
        verification_threshold: verificationThreshold,
      }
    } catch (err) {
      myToaster(err)
    }
  }, [sessionTimeout, verificationThreshold])

  const cancelGeneralSettings = useCallback(() => {
    setSessionTimeout(savedGeneral.current.session_timeout)
    setVerificationThreshold(savedGeneral.current.verification_threshold)
  }, [])

  // NOTE: General Settings is fetched lazily by GeneralSettings.jsx when that tab mounts.

  // ── Consent Editor ──────────────────────────────────────────────────────────
  const [candidateContent, setCandidateContent] = useState('')
  const [existingContent, setExistingContent] = useState('')
  const [isLoadingConsent, setIsLoadingConsent] = useState(false)
  const [isSavingConsent, setIsSavingConsent] = useState({ candidate: false, existing: false })
  const savedConsent = useRef({ candidate: '', existing: '' })

  const fetchConsentEditor = useCallback(async () => {
    setIsLoadingConsent(true)
    try {
      const res = await SettingsService.getConsentEditor()
      const { candidate, existing } = res.data
      const cVal = candidate?.content || ''
      const eVal = existing?.content || ''
      setCandidateContent(cVal)
      setExistingContent(eVal)
      savedConsent.current = { candidate: cVal, existing: eVal }
    } catch (err) {
      myToaster(err)
    } finally {
      setIsLoadingConsent(false)
    }
  }, [])

  const updateConsentEditor = useCallback(async (code) => {
    setIsSavingConsent((prev) => ({ ...prev, [code]: true }))
    try {
      const content = code === 'candidate' ? candidateContent : existingContent
      const res = await SettingsService.updateConsentEditor(code, { content })
      myToaster(res)
      savedConsent.current[code] = content
    } catch (err) {
      myToaster(err)
    } finally {
      setIsSavingConsent((prev) => ({ ...prev, [code]: false }))
    }
  }, [candidateContent, existingContent])

  const cancelConsentEditor = useCallback((code) => {
    if (code === 'candidate') {
      setCandidateContent(savedConsent.current.candidate)
    } else {
      setExistingContent(savedConsent.current.existing)
    }
  }, [])

  // NOTE: Consent Editor is fetched lazily by ConsentEditor.jsx when that tab mounts.

  // ── Role Access (API-backed) ─────────────────────────────────────────────────
  const [roles, setRoles] = useState([])
  const [rolePagination, setRolePagination] = useState({
    current_page: 1,
    prev_page: null,
    next_page: null,
    total_page: 1,
    total: 0,
  })
  const [rolePage, setRolePage] = useState(1)
  const [roleSearchTerm, setRoleSearchTerm] = useState('')
  const [isLoadingRoles, setIsLoadingRoles] = useState(false)
  const [selectedRoleIds, setSelectedRoleIds] = useState([])
  const [roleSortField, setRoleSortField] = useState(null)
  const [roleSortOrder, setRoleSortOrder] = useState(null)
  const [roleFilters, setRoleFilters] = useState([])
  const [roleFilterParams, setRoleFilterParams] = useState([])

  // Panel state: null | 'detail' | 'create' | 'edit'
  const [rolePanel, setRolePanel] = useState(null)
  const [activePanelRoleId, setActivePanelRoleId] = useState(null)
  const [roleDetail, setRoleDetail] = useState(null)
  const [isLoadingRoleDetail, setIsLoadingRoleDetail] = useState(false)
  const [allPermissions, setAllPermissions] = useState([])

  const fetchRoles = useCallback(async (page = 1, search = '') => {
    const limit = 10
    setIsLoadingRoles(true)
    try {
      const params = {
        page,
        limit,
        ...(search ? { search } : {}),
        ...(roleFilterParams.length > 0 ? { filter: roleFilterParams } : {}),
        ...(roleSortField ? { sort: roleSortField } : {}),
        ...(roleSortOrder ? { order: roleSortOrder } : {}),
      }
      const res = await SettingsService.getRoles(params)
      const rows = res.data ?? []
      // New list = new view (search/filter/page); selection does not carry over.
      setRoles(rows.map((r) => ({ ...r, checked: false })))
      setSelectedRoleIds([])
      setRolePagination(res.meta)
      if (res.filter) setRoleFilters(res.filter)
    } catch (err) {
      myToaster(err)
    } finally {
      setIsLoadingRoles(false)
    }
  }, [roleFilterParams, roleSortField, roleSortOrder])

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
  const openRoleDetail = useCallback(
    (id) => {
      setActivePanelRoleId(id)
      setRolePanel('detail')
      fetchRoleDetail(id)
    },
    [fetchRoleDetail]
  )

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

  const exportRoles = useCallback(() => {
    const params = {
      ...(roleSearchTerm ? { search: roleSearchTerm } : {}),
      ...(roleFilterParams.length > 0 ? { filter: roleFilterParams } : {}),
    }
    const url = SettingsService.exportRoles(params)
    window.open(url, '_blank').focus()
  }, [roleSearchTerm, roleFilterParams])

  const closeRolePanel = useCallback(() => {
    setRolePanel(null)
    setActivePanelRoleId(null)
    setRoleDetail(null)
  }, [])

  // CRUD
  const createRole = useCallback(
    async (data) => {
      try {
        const res = await SettingsService.createRole(data)
        myToaster(res)
        fetchRoles(rolePage, roleSearchTerm)
        closeRolePanel()
      } catch (err) {
        myToaster(normalizeRoleSaveError(err))
      }
    },
    [rolePage, roleSearchTerm, fetchRoles, closeRolePanel]
  )

  const updateRole = useCallback(
    async (id, data) => {
      try {
        const res = await SettingsService.updateRole(id, data)
        myToaster(res)
        fetchRoles(rolePage, roleSearchTerm)
        fetchRoleDetail(id)
        setRolePanel('detail')
      } catch (err) {
        myToaster(normalizeRoleSaveError(err))
      }
    },
    [rolePage, roleSearchTerm, fetchRoles, fetchRoleDetail]
  )

  const deleteRoles = useCallback(
    async (ids) => {
      try {
        // Super Admin is immune; strip it just in case it leaked into the selection.
        const sanitized = (ids || []).filter((id) => id !== 'fa70fed3-9fc5-4753-a879-ceb2b92f8d77')
        if (sanitized.length === 0) {
          setSelectedRoleIds([])
          return
        }
        const res = await SettingsService.deleteRoles(sanitized)
        myToaster(res)
        setSelectedRoleIds([])
        fetchRoles(rolePage, roleSearchTerm)
      } catch (err) {
        myToaster(err)
      }
    },
    [rolePage, roleSearchTerm, fetchRoles]
  )

  const handleRoleFilterChange = useCallback(
    (filter) => {
      const filterArray = filter
        ? Object.values(filter).filter(
            (f) => f.field && f.condition && f.value != null
          )
        : []
      setRoleFilterParams(filterArray)
      setRolePage(1)
    },
    []
  )

  const handleRoleSort = useCallback(({ sort, order }) => {
    setRoleSortField(sort)
    setRoleSortOrder(order)
  }, [])

  const handleRoleSelectionChange = useCallback((updated) => {
    // Super Admin role is immune: force-uncheck it so it can never be bulk-deleted.
    const sanitized = updated.data.map((r) =>
      r.id === 'fa70fed3-9fc5-4753-a879-ceb2b92f8d77' && r.checked ? { ...r, checked: false } : r
    )
    setRoles(sanitized)
    setSelectedRoleIds(sanitized.filter((r) => r.checked).map((r) => r.id))
  }, [])

  // ── User Management (API-backed) ────────────────────────────────────────────
  const [users, setUsers] = useState([])
  const [userPagination, setUserPagination] = useState({
    current_page: 1,
    prev_page: null,
    next_page: null,
    total_page: 1,
    total: 0,
  })
  const [userPage, setUserPage] = useState(1)
  const [userSearchTerm, setUserSearchTerm] = useState('')
  const [isLoadingUsers, setIsLoadingUsers] = useState(false)
  const [selectedUserIds, setSelectedUserIds] = useState([])
  const [userSortField, setUserSortField] = useState(null)
  const [userSortOrder, setUserSortOrder] = useState(null)
  const [userStatusFilter, setUserStatusFilter] = useState('all')
  const [userFilters, setUserFilters] = useState([])
  const [userFilterParams, setUserFilterParams] = useState([])

  // Panel state: null | 'detail' | 'create' | 'edit'
  const [userPanel, setUserPanel] = useState(null)
  const [activePanelUserId, setActivePanelUserId] = useState(null)
  const [userDetail, setUserDetail] = useState(null)
  const [isLoadingUserDetail, setIsLoadingUserDetail] = useState(false)

  const fetchUsers = useCallback(async (page = 1, search = '') => {
    const limit = 10
    setIsLoadingUsers(true)
    try {
      const params = {
        page,
        limit,
        ...(search ? { search } : {}),
        ...(userStatusFilter !== 'all' ? { status: userStatusFilter } : {}),
        ...(userFilterParams.length > 0 ? { filter: userFilterParams } : {}),
        ...(userSortField ? { sort: userSortField } : {}),
        ...(userSortOrder ? { order: userSortOrder } : {}),
      }
      const res = await SettingsService.getUsers(params)
      const rows = res.data ?? []
      // New list = new view (tab/search/filter/page); selection does not carry over.
      setUsers(rows.map((u) => ({ ...u, checked: false })))
      setSelectedUserIds([])
      setUserPagination(res.meta)
      if (res.filter) setUserFilters(res.filter)
    } catch (err) {
      myToaster(err)
    } finally {
      setIsLoadingUsers(false)
    }
  }, [userStatusFilter, userFilterParams, userSortField, userSortOrder])

  const fetchUserDetail = useCallback(async (id) => {
    setIsLoadingUserDetail(true)
    try {
      const res = await SettingsService.getUserDetail(id)
      setUserDetail(res.data)
    } catch (err) {
      myToaster(err)
    } finally {
      setIsLoadingUserDetail(false)
    }
  }, [])

  const openUserDetail = useCallback(
    (id) => {
      setActivePanelUserId(id)
      setUserPanel('detail')
      fetchUserDetail(id)
    },
    [fetchUserDetail]
  )

  const openCreateUser = useCallback(() => {
    setActivePanelUserId(null)
    setUserDetail(null)
    setUserPanel('create')
  }, [])

  const openImportUser = useCallback(() => {
    setUserPanel('import')
  }, [])

  const openEditUser = useCallback(() => {
    setUserPanel('edit')
  }, [])

  const closeUserPanel = useCallback(() => {
    setUserPanel(null)
    setActivePanelUserId(null)
    setUserDetail(null)
  }, [])

  const createUser = useCallback(
    async (formData) => {
      try {
        const res = await SettingsService.createUser(formData)
        myToaster(res)
        fetchUsers(userPage, userSearchTerm)
        closeUserPanel()
      } catch (err) {
        myToaster(err)
      }
    },
    [userPage, userSearchTerm, fetchUsers, closeUserPanel]
  )

  const updateUser = useCallback(
    async (id, formData) => {
      try {
        const res = await SettingsService.updateUser(id, formData)
        myToaster(res)
        fetchUsers(userPage, userSearchTerm)
        fetchUserDetail(id)
        setUserPanel('detail')
      } catch (err) {
        myToaster(err)
      }
    },
    [userPage, userSearchTerm, fetchUsers, fetchUserDetail]
  )

  const deleteUsers = useCallback(
    async (ids) => {
      try {
        const res = await SettingsService.deleteUsers(ids)
        myToaster(res)
        setSelectedUserIds([])
        fetchUsers(userPage, userSearchTerm)
      } catch (err) {
        myToaster(err)
      }
    },
    [userPage, userSearchTerm, fetchUsers]
  )

  const handleUserFilterChange = useCallback(
    (filter) => {
      const filterArray = filter
        ? Object.values(filter).filter(
            (f) => f.field && f.condition && f.value != null
          )
        : []
      setUserFilterParams(filterArray)
      setUserPage(1)
    },
    []
  )

  const handleUserSort = useCallback(({ sort, order }) => {
    setUserSortField(sort)
    setUserSortOrder(order)
  }, [])

  const handleUserSelectionChange = useCallback((updated) => {
    setUsers(updated.data)
    setSelectedUserIds(updated.data.filter((u) => u.checked).map((u) => u.id))
  }, [])

  const exportUsers = useCallback(() => {
    const params = {
      ...(userSearchTerm ? { search: userSearchTerm } : {}),
      ...(userStatusFilter !== 'all' ? { status: userStatusFilter } : {}),
      ...(userFilterParams.length > 0 ? { filter: userFilterParams } : {}),
    }
    const url = SettingsService.exportUsers(params)
    window.open(url, '_blank').focus()
  }, [userSearchTerm, userStatusFilter, userFilterParams])

  const downloadUserTemplate = useCallback(() => {
    const url = SettingsService.downloadUserTemplate()
    window.open(url, '_blank').focus()
  }, [])

  // ── Option Endpoints (for dropdowns) ─────────────────────────────────────────
  const searchOptionRoles = useCallback(
    async (search = '') => {
      const res = await SettingsService.getOptionRoles({ search })
      return res.data
    },
    []
  )

  const searchOptionCompanies = useCallback(
    async (search = '') => {
      const res = await SettingsService.getOptionCompanies({ search })
      return res.data
    },
    []
  )

  const searchOptionStatuses = useCallback(
    async (search = '') => {
      const res = await SettingsService.getOptionStatuses({ search })
      return res.data
    },
    []
  )

  const searchOptionUsers = useCallback(
    async (search = '') => {
      const res = await SettingsService.getOptionUsers({ search })
      return res.data
    },
    []
  )

  // ── Context Value ────────────────────────────────────────────────────────────
  const contextValue = useMemo(
    () => ({
      // General Settings
      sessionTimeout,
      setSessionTimeout,
      verificationThreshold,
      setVerificationThreshold,
      isLoadingGeneral,
      fetchGeneralSettings,
      updateGeneralSettings,
      cancelGeneralSettings,

      // Consent Editor
      candidateContent,
      setCandidateContent,
      existingContent,
      setExistingContent,
      isLoadingConsent,
      isSavingConsent,
      fetchConsentEditor,
      updateConsentEditor,
      cancelConsentEditor,

      // Role Access
      roles,
      rolePagination,
      rolePage,
      setRolePage,
      roleSearchTerm,
      setRoleSearchTerm,
      isLoadingRoles,
      selectedRoleIds,
      roleSortField,
      roleSortOrder,
      roleFilters,
      handleRoleFilterChange,
      handleRoleSort,
      handleRoleSelectionChange,
      rolePanel,
      activePanelRoleId,
      roleDetail,
      isLoadingRoleDetail,
      allPermissions,
      fetchRoles,
      openRoleDetail,
      openCreateRole,
      openEditRole,
      closeRolePanel,
      createRole,
      updateRole,
      deleteRoles,
      exportRoles,

      // User Management
      users,
      userPagination,
      userPage,
      setUserPage,
      userSearchTerm,
      setUserSearchTerm,
      isLoadingUsers,
      selectedUserIds,
      userSortField,
      userSortOrder,
      userStatusFilter,
      setUserStatusFilter,
      userFilters,
      userFilterParams,
      handleUserFilterChange,
      handleUserSort,
      handleUserSelectionChange,
      userPanel,
      activePanelUserId,
      userDetail,
      isLoadingUserDetail,
      fetchUsers,
      openUserDetail,
      openCreateUser,
      openImportUser,
      openEditUser,
      closeUserPanel,
      createUser,
      updateUser,
      deleteUsers,
      exportUsers,
      downloadUserTemplate,

      // Options (dropdowns)
      searchOptionRoles,
      searchOptionCompanies,
      searchOptionStatuses,
      searchOptionUsers,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      sessionTimeout,
      verificationThreshold,
      isLoadingGeneral,
      fetchGeneralSettings,
      updateGeneralSettings,
      cancelGeneralSettings,
      candidateContent,
      existingContent,
      isLoadingConsent,
      isSavingConsent,
      fetchConsentEditor,
      updateConsentEditor,
      cancelConsentEditor,
      roles,
      rolePagination,
      rolePage,
      roleSearchTerm,
      isLoadingRoles,
      selectedRoleIds,
      roleSortField,
      roleSortOrder,
      roleFilters,
      handleRoleFilterChange,
      handleRoleSort,
      handleRoleSelectionChange,
      rolePanel,
      activePanelRoleId,
      roleDetail,
      isLoadingRoleDetail,
      allPermissions,
      fetchRoles,
      openRoleDetail,
      openCreateRole,
      openEditRole,
      closeRolePanel,
      createRole,
      updateRole,
      deleteRoles,
      exportRoles,
      users,
      userPagination,
      userPage,
      userSearchTerm,
      isLoadingUsers,
      selectedUserIds,
      userSortField,
      userSortOrder,
      userStatusFilter,
      userFilters,
      userFilterParams,
      handleUserFilterChange,
      handleUserSort,
      handleUserSelectionChange,
      userPanel,
      activePanelUserId,
      userDetail,
      isLoadingUserDetail,
      fetchUsers,
      openUserDetail,
      openCreateUser,
      openImportUser,
      openEditUser,
      closeUserPanel,
      createUser,
      updateUser,
      deleteUsers,
      exportUsers,
      downloadUserTemplate,
      searchOptionRoles,
      searchOptionCompanies,
      searchOptionStatuses,
      searchOptionUsers,
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
