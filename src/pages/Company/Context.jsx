import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { myToaster } from '@interstellar-component'
import { useApp } from '@src/AppContext'
import { CompanyService } from './service'

const CompanyContext = createContext()

/** Keep API row shape; only merge `checked` for table selection. */
function withSelectionRow(item) {
  if (!item || typeof item !== 'object') return null
  return { ...item, checked: Boolean(item.checked) }
}

/** MyColumn `field` → query `sort` param (backend snake_case). */
const SORT_FIELD_TO_API = {
  name: 'name',
  enrollment_status: 'enrollment_status',
  enrollment_step: 'enrollment_step',
}

function CompanyProvider({ children }) {
  const { setSlider } = useApp()

  const [currentSlider, setCurrentSlider] = useState({
    status: false,
    current: null,
    id: null,
  })

  const [company, setCompany] = useState({
    data: [],
    meta: {},
    filter: [],
    loading: false,
  })

  const [companyDetail, setCompanyDetail] = useState(null)
  const [isLoadingCompanyDetail, setIsLoadingCompanyDetail] = useState(false)

  const [params, setParams] = useState({
    page: 1,
    limit: 10,
    search: '',
    filter: [],
    sort: null,
    order: null,
    status: 'All status',
  })

  useEffect(() => {
    const open = currentSlider.status && currentSlider.current === 'details-slider'
    setSlider(!!open)
  }, [currentSlider, setSlider])

  const fetchCompanyDetail = useCallback(async (id) => {
    if (id == null || id === '') return
    setCompanyDetail(null)
    setIsLoadingCompanyDetail(true)
    try {
      const res = await CompanyService.getDetailCompany(id)
      const d = res?.data !== undefined ? res.data : res
      setCompanyDetail(d)
    } catch (e) {
      myToaster(e)
      setCompanyDetail(null)
    } finally {
      setIsLoadingCompanyDetail(false)
    }
  }, [])

  const handleCurrentSlider = useCallback(
    (slider, id) => {
      if (slider?.current) {
        setCurrentSlider({
          status: true,
          current: slider.current,
          id: id ?? null,
        })
        if (id != null && id !== '' && slider.current === 'details-slider') {
          fetchCompanyDetail(id)
        }
      } else {
        setCurrentSlider((v) => ({ ...v, current: null }))
        setTimeout(() => {
          setCurrentSlider({ status: false, current: null, id: null })
          setCompanyDetail(null)
        }, 200)
      }
    },
    [fetchCompanyDetail]
  )

  const getCompany = useCallback(async () => {
    const limit = params.limit ?? 10
    const sortApi = params.sort ? SORT_FIELD_TO_API[params.sort] ?? params.sort : null
    const query = {
      page: params.page,
      limit,
      ...(params.search ? { search: params.search } : {}),
      ...(Array.isArray(params.filter) && params.filter.length > 0 ? { filter: params.filter } : {}),
      ...(sortApi ? { sort: sortApi } : {}),
      ...(params.order ? { order: params.order } : {}),
      ...(params.status && params.status !== 'All status' ? { enrollment_status: params.status } : {}),
    }
    setCompany((s) => ({ ...s, loading: true }))
    try {
      const res = await CompanyService.getCompany(query)
      const rawRows = Array.isArray(res.data) ? res.data : []
      const rows = rawRows.map((r) => withSelectionRow(r)).filter(Boolean)
      const rawMeta = res.meta
      const perPageForMeta = Number(rawMeta?.per_page ?? rawMeta?.limit ?? limit) || limit
      const meta =
        rawMeta && typeof rawMeta === 'object' && !Array.isArray(rawMeta)
          ? {
              ...rawMeta,
              total_page:
                rawMeta.total_page ??
                rawMeta.last_page ??
                Math.max(1, Math.ceil(Number(rawMeta.total ?? rows.length) / perPageForMeta)),
            }
          : {
              current_page: 1,
              per_page: limit,
              total: rows.length,
              total_page: 1,
            }
      setCompany({
        data: rows,
        meta,
        filter: res.filter ?? [],
        loading: false,
      })
    } catch (e) {
      myToaster(e)
      setCompany((s) => ({ ...s, loading: false }))
    }
  }, [params])

  useEffect(() => {
    getCompany()
  }, [getCompany])

  const handleCompanySort = useCallback(({ sort, order }) => {
    setParams((p) => ({
      ...p,
      page: 1,
      sort: sort ?? null,
      order: order ?? null,
    }))
  }, [])

  const handleCompanySelectionChange = useCallback((updated) => {
    setCompany((prev) => ({
      ...prev,
      data: updated.data,
    }))
  }, [])

  const setPage = useCallback((page) => {
    setParams((p) => ({ ...p, page }))
  }, [])

  const setSearchTerm = useCallback((search) => {
    setParams((p) => ({ ...p, page: 1, search }))
  }, [])

  const setSelectedStatus = useCallback((status) => {
    setParams((p) => ({ ...p, page: 1, status }))
  }, [])

  const companyRows = useMemo(
    () => (Array.isArray(company?.data) ? company.data : []),
    [company?.data]
  )

  const companyMeta = useMemo(() => {
    const m = company?.meta
    if (m && typeof m === 'object' && !Array.isArray(m)) return m
    return {
      current_page: 1,
      per_page: params.limit ?? 10,
      total: companyRows.length,
      total_page: 1,
    }
  }, [company?.meta, companyRows.length, params.limit])

  const contextValue = useMemo(
    () => ({
      params,
      setParams,
      company,
      companyRows,
      companyMeta,
      getCompany,
      handleCompanySort,
      handleCompanySelectionChange,
      companyDetail,
      isLoadingCompanyDetail,
      fetchCompanyDetail,
      currentSlider,
      handleCurrentSlider,
      setPage,
      searchTerm: params.search,
      setSearchTerm,
      selectedStatus: params.status,
      setSelectedStatus,
      sortField: params.sort,
      sortOrder: params.order,
    }),
    [
      params,
      company,
      companyRows,
      companyMeta,
      getCompany,
      handleCompanySort,
      handleCompanySelectionChange,
      companyDetail,
      isLoadingCompanyDetail,
      fetchCompanyDetail,
      currentSlider,
      handleCurrentSlider,
      setPage,
      setSearchTerm,
      setSelectedStatus,
    ]
  )

  return <CompanyContext.Provider value={contextValue}>{children}</CompanyContext.Provider>
}

const useCompany = () => {
  const context = useContext(CompanyContext)
  if (context === undefined) {
    throw new Error('useCompany must be used within a CompanyProvider')
  }
  return context
}

export { CompanyProvider, useCompany }
