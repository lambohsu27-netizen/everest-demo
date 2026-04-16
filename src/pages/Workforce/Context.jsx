import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { myToaster } from '@interstellar-component'
import { WorkforceService } from './service'

const WorkforceContext = createContext()

const CATEGORY_META = {
  'Credit / Financing': { color: 'Success', icon: 'CoinsStacked03' },
  'Bond / Securities': { color: 'Blue', icon: 'ShoppingBag03' },
  'Irrevocable LC': { color: 'Warning', icon: 'File06' },
  'Bank Guarantee': { color: 'Orange', icon: 'Shield02' },
  'Other Facilities': { color: 'Gray', icon: 'DotsVertical' },
}

function formatIDR(n) {
  const v = Number(n) || 0
  return `Rp ${v.toLocaleString('en-US', { maximumFractionDigits: 0 })}`
}

function deriveBankCode(provider) {
  if (!provider) return 'XX'
  const words = String(provider).replace(/^PT\.?\s+/i, '').split(/\s+/).filter(Boolean)
  return (words[0] ?? 'XX').slice(0, 3).toUpperCase()
}

const SORT_FIELD_TO_API = {
  full_name: 'full_name',
  code: 'code',
  category: 'category',
  consent_status: 'consent_status',
  consent_expiry: 'consent_expiry',
  created_at: 'created_at',
}

const CATEGORY_TAB_TO_API = {
  'All category': null,
  Employee: 'employee',
  Candidate: 'candidate',
}

function withSelectionRow(item) {
  if (!item || typeof item !== 'object') return null
  return { ...item, checked: Boolean(item.checked) }
}

function WorkforceProvider({ children }) {
  const [workforce, setWorkforce] = useState({
    data: [],
    meta: {},
    filter: [],
    loading: false,
  })

  const [workforceDetail, setWorkforceDetail] = useState(null)
  const [isLoadingWorkforceDetail, setIsLoadingWorkforceDetail] = useState(false)

  const [params, setParams] = useState({
    page: 1,
    limit: 10,
    search: '',
    filter: [],
    sort: null,
    order: null,
    category: 'All category',
  })

  // Stacked slider state (kept from original: credit/loan sliders stack on top)
  const [sliderStack, setSliderStack] = useState([])
  const [activeAccountId, setActiveAccountId] = useState(null)

  const pushSlider = useCallback((slider) => {
    setSliderStack((prev) => [...prev, slider])
  }, [])

  const popSlider = useCallback(() => {
    setSliderStack((prev) => {
      const newStack = prev.slice(0, -1)
      if (newStack.length === 1) setActiveAccountId(null)
      return newStack
    })
  }, [])

  const handleAccountDetail = useCallback((acc) => {
    setActiveAccountId(acc.id)
    setSliderStack((prev) => {
      const base = prev[0]
      const detail = { current: 'loan-account-detail', data: acc }
      return [base, detail]
    })
  }, [])

  const handleCurrentSlider = useCallback((value) => {
    if (value === null) {
      setSliderStack([])
      setActiveAccountId(null)
    } else {
      setSliderStack([value])
      setActiveAccountId(null)
    }
  }, [])

  const getWorkforce = useCallback(async () => {
    const limit = params.limit ?? 10
    const sortApi = params.sort ? SORT_FIELD_TO_API[params.sort] ?? params.sort : null
    const categoryApi = CATEGORY_TAB_TO_API[params.category] ?? null
    const query = {
      page: params.page,
      limit,
      ...(params.search ? { search: params.search } : {}),
      ...(Array.isArray(params.filter) && params.filter.length > 0 ? { filter: params.filter } : {}),
      ...(sortApi ? { sort: sortApi } : {}),
      ...(params.order ? { order: params.order } : {}),
      ...(categoryApi ? { category: categoryApi } : {}),
    }
    setWorkforce((s) => ({ ...s, loading: true }))
    try {
      const res = await WorkforceService.getWorkforce(query)
      const rawRows = Array.isArray(res?.data) ? res.data : []
      const rows = rawRows.map((r) => withSelectionRow(r)).filter(Boolean)
      const rawMeta = res?.meta
      const perPageForMeta = Number(rawMeta?.per_page ?? rawMeta?.limit ?? limit) || limit
      const meta =
        rawMeta && typeof rawMeta === 'object' && !Array.isArray(rawMeta)
          ? {
              ...rawMeta,
              total: Number(rawMeta.total ?? rows.length),
              total_page:
                rawMeta.total_page ??
                rawMeta.last_page ??
                Math.max(1, Math.ceil(Number(rawMeta.total ?? rows.length) / perPageForMeta)),
            }
          : {
              current_page: 1,
              per_page: limit,
              total: rows.length,
              total_page: Math.max(1, Math.ceil(rows.length / perPageForMeta)),
            }
      setWorkforce({
        data: rows,
        meta,
        filter: res?.filter ?? [],
        loading: false,
      })
    } catch (e) {
      myToaster(e)
      setWorkforce((s) => ({ ...s, loading: false }))
    }
  }, [params])

  useEffect(() => {
    getWorkforce()
  }, [getWorkforce])

  const fetchWorkforceDetail = useCallback(async (id, query = {}) => {
    if (id == null || id === '') return
    setIsLoadingWorkforceDetail(true)
    try {
      const res = await WorkforceService.getWorkforceDetail(id, query)
      setWorkforceDetail(res?.data !== undefined ? res.data : res)
    } catch (e) {
      myToaster(e)
      setWorkforceDetail(null)
    } finally {
      setIsLoadingWorkforceDetail(false)
    }
  }, [])

  const handleWorkforceSort = useCallback(({ sort, order }) => {
    setParams((p) => ({ ...p, page: 1, sort: sort ?? null, order: order ?? null }))
  }, [])

  const handleWorkforceSelectionChange = useCallback((updated) => {
    setWorkforce((prev) => ({ ...prev, data: updated.data }))
  }, [])

  const setPage = useCallback((page) => {
    setParams((p) => ({ ...p, page }))
  }, [])

  const setSearchTerm = useCallback((search) => {
    setParams((p) => ({ ...p, page: 1, search }))
  }, [])

  const setSelectedCategory = useCallback((category) => {
    setParams((p) => ({ ...p, page: 1, category }))
  }, [])

  const getEmployeeById = useCallback(
    (id) => {
      if (id == null) return null
      const rows = Array.isArray(workforce?.data) ? workforce.data : []
      return rows.find((r) => String(r.id) === String(id)) ?? null
    },
    [workforce?.data]
  )

  const workforceRows = useMemo(
    () => (Array.isArray(workforce?.data) ? workforce.data : []),
    [workforce?.data]
  )

  const creditFacilitiesByCategory = useMemo(() => {
    const facilities = workforceDetail?.credit_report?.major_credit_facilities ?? []
    const grouped = {}
    facilities.forEach((fac) => {
      const key = fac.category ?? 'Other Facilities'
      grouped[key] ??= { accounts: [], totalBalance: 0, activeCount: 0 }
      grouped[key].accounts.push(fac)
      grouped[key].totalBalance += Number(fac.debit_balance) || 0
      if (fac.contract_phase === 'Active') grouped[key].activeCount += 1
    })
    return grouped
  }, [workforceDetail?.credit_report?.major_credit_facilities])

  const loanCategories = useMemo(() => {
    const kol = workforceDetail?.credit_report?.credit_summary?.collectability_status?.kol
    const kolBadge = kol ? `KOL ${kol}` : null
    return Object.entries(creditFacilitiesByCategory).map(([title, { accounts, totalBalance }]) => ({
      title,
      accountCount: accounts.length > 0 ? `${accounts.length} account` : 'No active loan',
      amount: formatIDR(totalBalance),
      kolBadge,
      color: CATEGORY_META[title]?.color ?? 'Gray',
      icon: CATEGORY_META[title]?.icon ?? 'DotsVertical',
    }))
  }, [creditFacilitiesByCategory, workforceDetail?.credit_report?.credit_summary])

  const loanAccounts = useMemo(() => {
    const kol = workforceDetail?.credit_report?.credit_summary?.collectability_status?.kol
    const out = {}
    Object.entries(creditFacilitiesByCategory).forEach(([title, { accounts }]) => {
      out[title] = accounts.map((acc, i) => ({
        id: `${title}-${i}`,
        bank: deriveBankCode(acc.provider),
        name: acc.provider ?? '—',
        kol: kol ? `Kol ${kol}` : null,
        label: 'Jumlah pinjaman',
        amount: formatIDR(acc.debit_balance),
        isActive: acc.contract_phase === 'Active',
      }))
    })
    return out
  }, [creditFacilitiesByCategory, workforceDetail?.credit_report?.credit_summary])

  const workforceMeta = useMemo(() => {
    const m = workforce?.meta
    if (m && typeof m === 'object' && !Array.isArray(m)) return m
    return {
      current_page: 1,
      per_page: params.limit ?? 10,
      total: workforceRows.length,
      total_page: 1,
    }
  }, [workforce?.meta, workforceRows.length, params.limit])

  const currentSlider = useMemo(
    () => (sliderStack.length > 0 ? sliderStack[sliderStack.length - 1] : null),
    [sliderStack]
  )

  const contextValue = useMemo(
    () => ({
      params,
      setParams,
      workforce,
      workforceRows,
      workforceMeta,
      getWorkforce,
      handleWorkforceSort,
      handleWorkforceSelectionChange,
      workforceDetail,
      isLoadingWorkforceDetail,
      fetchWorkforceDetail,
      searchTerm: params.search,
      setSearchTerm,
      selectedCategory: params.category,
      setSelectedCategory,
      sortField: params.sort,
      sortOrder: params.order,
      setPage,
      getEmployeeById,
      // Stacked sliders
      sliderStack,
      currentSlider,
      pushSlider,
      popSlider,
      handleCurrentSlider,
      handleAccountDetail,
      activeAccountId,
      loanCategories,
      loanAccounts,
    }),
    [
      params,
      workforce,
      workforceRows,
      workforceMeta,
      getWorkforce,
      handleWorkforceSort,
      handleWorkforceSelectionChange,
      workforceDetail,
      isLoadingWorkforceDetail,
      fetchWorkforceDetail,
      setSearchTerm,
      setSelectedCategory,
      setPage,
      getEmployeeById,
      loanCategories,
      loanAccounts,
      sliderStack,
      currentSlider,
      pushSlider,
      popSlider,
      handleCurrentSlider,
      handleAccountDetail,
      activeAccountId,
    ]
  )

  return <WorkforceContext.Provider value={contextValue}>{children}</WorkforceContext.Provider>
}

const useWorkforce = () => {
  const context = useContext(WorkforceContext)
  if (context === undefined) {
    throw new Error('useWorkforce must be used within a WorkforceProvider')
  }
  return context
}

export { WorkforceProvider, useWorkforce }
