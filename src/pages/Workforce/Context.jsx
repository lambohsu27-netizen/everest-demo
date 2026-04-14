import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { myToaster } from '@interstellar-component'
import { WorkforceService } from './service'

const WorkforceContext = createContext()

export const LOAN_CATEGORIES = [
  { kolBadge: 'KOL 5', title: 'Credit card', accountCount: '3 account', amount: 'Rp 52,000,000', color: 'Error', icon: 'CreditCard02' },
  { kolBadge: 'KOL 4', title: 'Paylater', accountCount: '2 account', amount: 'Rp 6,400,000', color: 'Warning', icon: 'ShoppingBag03' },
  { kolBadge: 'KOL 5', title: 'KKB', accountCount: '1 account', amount: 'Rp 172,000,000', color: 'Orange', icon: 'Car01' },
  { kolBadge: 'KOL 5', title: 'KPR', accountCount: 'No active loan', amount: 'Rp 0', color: 'Blue', icon: 'Home03' },
  { kolBadge: 'KOL 5', title: 'KTA', accountCount: '2 account', amount: 'Rp 154,100,000', color: 'Success', icon: 'CoinsStacked03' },
  { kolBadge: 'KOL 5', title: 'Other', accountCount: 'No active loan', amount: 'Rp 0', color: 'Gray', icon: 'DotsVertical' },
]

export const LOAN_ACCOUNTS = {
  'Credit card': [
    { id: 1, bank: 'BCA', name: 'BCA Master Card', kol: 'Kol 2', label: 'Jumlah pinjaman', amount: 'Rp 1,523,000', isActive: false },
    { id: 2, bank: 'BCA', name: 'BCA Master Card', kol: 'Kol 2', label: 'Jumlah pinjaman', amount: 'Rp 5,000,000', isActive: true },
    { id: 3, bank: 'CIMB', name: 'CIMB Niaga Card', kol: 'Kol 5', label: 'Jumlah pinjaman', amount: 'Rp 45,477,000', isActive: false },
  ],
  Paylater: [
    { id: 1, bank: 'SP', name: 'Shopee Paylater', kol: 'Kol 4', label: 'Jumlah pinjaman', amount: 'Rp 4,000,000', isActive: false },
    { id: 2, bank: 'TR', name: 'Traveloka Paylater', kol: 'Kol 2', label: 'Jumlah pinjaman', amount: 'Rp 2,400,000', isActive: true },
  ],
  KKB: [
    { id: 1, bank: 'BCA', name: 'BCA Finance - Toyota Avanza', kol: 'Kol 5', label: 'Jumlah pinjaman', amount: 'Rp 172,000,000', isActive: true },
  ],
  KPR: [],
  KTA: [
    { id: 1, bank: 'MN', name: 'Mandiri KTA', kol: 'Kol 5', label: 'Jumlah pinjaman', amount: 'Rp 100,000,000', isActive: false },
    { id: 2, bank: 'BRI', name: 'BRI KTA', kol: 'Kol 2', label: 'Jumlah pinjaman', amount: 'Rp 54,100,000', isActive: true },
  ],
  Other: [],
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
      loanCategories: LOAN_CATEGORIES,
      loanAccounts: LOAN_ACCOUNTS,
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
