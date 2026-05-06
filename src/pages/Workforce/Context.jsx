import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { myToaster } from '@interstellar-component'
import { WorkforceService } from './service'

const WorkforceContext = createContext()

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
  consent_expiry: 'consent_expiry_at',
  consent_expiry_at: 'consent_expiry_at',
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

  // Detail responses are now keyed by mode. The backend supports
  // ?type=report (default) and ?type=personal_information; the FE used to
  // make a single fetch and reach into employee.credit_report — that wrapper
  // is gone, and personal_information returns a different sub-shape entirely.
  const [workforceDetailReport, setWorkforceDetailReport] = useState(null)
  const [workforceDetailPersonal, setWorkforceDetailPersonal] = useState(null)
  const [isLoadingReport, setIsLoadingReport] = useState(false)
  const [isLoadingPersonal, setIsLoadingPersonal] = useState(false)

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

  const fetchWorkforceDetail = useCallback(async (id, mode = 'report') => {
    if (id == null || id === '') return
    const isPersonal = mode === 'personal_information'
    const setLoading = isPersonal ? setIsLoadingPersonal : setIsLoadingReport
    const setSlot = isPersonal ? setWorkforceDetailPersonal : setWorkforceDetailReport
    setLoading(true)
    try {
      const query = isPersonal ? { type: 'personal_information' } : {}
      const res = await WorkforceService.getWorkforceDetail(id, query)
      setSlot(res?.data !== undefined ? res.data : res)
    } catch (e) {
      myToaster(e)
      setSlot(null)
    } finally {
      setLoading(false)
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

  const BUCKETS = [
    { key: 'credit_card', title: 'Credit Card', icon: 'CoinsStacked03', color: 'Success' },
    { key: 'paylater', title: 'Paylater', icon: 'ShoppingBag03', color: 'Blue' },
    { key: 'kkb', title: 'KKB', icon: 'File06', color: 'Warning' },
    { key: 'kpr', title: 'KPR', icon: 'Shield02', color: 'Orange' },
    { key: 'kta', title: 'KTA', icon: 'DotsVertical', color: 'Gray' },
    { key: 'other', title: 'Other', icon: 'DotsVertical', color: 'Gray' },
  ]

  // Per-workforce account-level data shipped by the new GET /v1/workforce/:id?type=report
  // payload. Each category maps to an array of {bank, name, kol, label, amount}
  // accounts. The slider iterates over these directly; the report card sums
  // amounts per category.
  const loanAccounts = useMemo(() => {
    const apiAccounts = workforceDetailReport?.loan_accounts
    if (!apiAccounts || typeof apiAccounts !== 'object') {
      return BUCKETS.reduce((acc, b) => ({ ...acc, [b.title]: [] }), {})
    }
    return Object.fromEntries(
      BUCKETS.map((b) => {
        const rows = Array.isArray(apiAccounts[b.title]) ? apiAccounts[b.title] : []
        return [
          b.title,
          rows.map((r) => {
            const kolValue =
              Number(r.kol_value)
              || Number(String(r.kol ?? '').match(/\d+/)?.[0])
              || null
            return {
              id: r.id,
              bank: r.bank ?? deriveBankCode(r.name ?? r.provider),
              name: r.name ?? r.provider,
              kol: r.kol ?? null,
              kolValue,
              status: kolValue && kolValue > 1 ? 'Overdue' : 'On track',
              label: r.label ?? 'Jumlah pinjaman',
              amount: formatIDR(r.amount),
              amountValue: Number(r.amount) || 0,
              isActive: r.isActive ?? true,
            }
          }),
        ]
      })
    )
  }, [workforceDetailReport?.loan_accounts])

  const loanCategories = useMemo(() => {
    const summary = workforceDetailReport?.credit_summary
    const kol = summary?.collectibility_status?.kol ?? summary?.collectability_status?.kol
    const kolBadge = kol ? `KOL ${kol}` : null
    return BUCKETS.map((b) => {
      const accounts = loanAccounts[b.title] ?? []
      const count = accounts.length
      const totalAmount = accounts.reduce((sum, a) => sum + (a.amountValue || 0), 0)
      return {
        title: b.title,
        accountCount: count > 0 ? `${count} account${count === 1 ? '' : 's'}` : 'No active loan',
        amount: formatIDR(totalAmount),
        kolBadge,
        color: b.color,
        icon: b.icon,
      }
    })
  }, [loanAccounts, workforceDetailReport?.credit_summary])

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
      workforceDetailReport,
      workforceDetailPersonal,
      // Backwards-compat shim: most of the section files still pull
      // `workforceDetail` and we'll migrate them in this same change.
      // Once every consumer reads workforceDetailReport directly we can drop
      // this alias.
      workforceDetail: workforceDetailReport,
      isLoadingReport,
      isLoadingPersonal,
      isLoadingWorkforceDetail: isLoadingReport,
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
      workforceDetailReport,
      workforceDetailPersonal,
      isLoadingReport,
      isLoadingPersonal,
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
